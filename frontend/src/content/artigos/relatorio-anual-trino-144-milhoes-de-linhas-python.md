---
title: "Meu relatório anual travava o Trino: 144 milhões de linhas e o que mudou no script Python"
description: "Um script que funcionava bem com um mês de dados (12 milhões de linhas) travou o Trino quando precisou gerar o relatório do ano. Como dividir o problema, agregar no lugar certo e deixar o script retomável."
pubDate: 2026-11-05
tags: ["python","dados","trino","performance"]
cover: "../../assets/capas/relatorio-anual-trino.jpg"
---

Eu tinha um script em Python que gerava um relatório mensal. Ele consultava uma tabela no **Trino**, trazia os dados de um mês e montava o resultado. Um mês dava cerca de **12 milhões de linhas**, e o script dava conta.

Até que veio o pedido: **o mesmo relatório, só que anual.**

Parecia uma mudança de uma linha: trocar o filtro de um mês para doze. Só que 12 milhões vezes 12 são **cerca de 144 milhões de linhas**. E o Trino travou completamente.

Este artigo é sobre o que mudou no script para o relatório anual sair. Spoiler: a maior parte da solução não foi "deixar o Python mais rápido". Foi parar de pedir tudo de uma vez.

## Por que a mesma query travou

O Trino é um motor de consultas distribuído. Ele divide o trabalho entre vários nós e processa boa parte dele **em memória**. Isso o torna muito rápido para consultas grandes, mas com um limite: uma única consulta só pode usar uma certa quantidade de memória do cluster.

A versão anual do script fazia, na prática, isto:

```python
from datetime import date

import pandas as pd
from trino.dbapi import connect

conn = connect(host="trino.interno", port=443, http_scheme="https",
               user="relatorios", catalog="hive", schema="analytics")

cur = conn.cursor()
cur.execute("""
    SELECT *
    FROM eventos
    WHERE data_evento BETWEEN DATE '2025-01-01' AND DATE '2025-12-31'
""")
df = pd.DataFrame(cur.fetchall(), columns=[c[0] for c in cur.description])

relatorio = df.groupby("campanha_id").agg(...)
```

Tem pelo menos três problemas aqui, e todos crescem junto com o volume:

1. **Uma consulta só, gigante.** Se ela passar do limite de memória, falha. Se falhar depois de 40 minutos, você perde os 40 minutos. E enquanto roda, disputa o cluster com todo mundo que também está consultando.
2. **`SELECT *` e `fetchall()`.** Todas as colunas de 144 milhões de linhas saem do Trino, passam pela rede e tentam caber na memória da máquina que roda o Python.
3. **A agregação está no lugar errado.** O `groupby` do pandas resume tudo no final. Ou seja: o script trazia 144 milhões de linhas para jogar a maior parte delas fora logo depois.

Com 12 milhões de linhas, esses problemas existiam, mas cabiam. Com 144 milhões, não cabem mais.

## Estratégia 1: dividir o ano em meses

A primeira mudança, e a que destravou o relatório, foi **parar de pedir o ano inteiro de uma vez**. Em vez de uma consulta de 144 milhões de linhas, doze consultas de cerca de 12 milhões, uma por mês.

O tamanho de cada consulta voltou ao que o script já processava bem. E se uma delas falhar, só aquele mês precisa rodar de novo.

```python
def intervalo_do_mes(ano: int, mes: int) -> tuple[date, date]:
    inicio = date(ano, mes, 1)
    fim = date(ano + 1, 1, 1) if mes == 12 else date(ano, mes + 1, 1)
    return inicio, fim
```

Repare que o fim é o **primeiro dia do mês seguinte**, e a consulta usa `<` em vez de `<=`. Assim não tem dúvida sobre o último dia do mês, nem sobre horários no fim do dia quando a coluna é um timestamp.

Dividir por mês tem mais uma vantagem quando a tabela é **particionada por data**, o que é comum em data lakes. Com o filtro de um mês, o Trino lê só as partições daquele mês e ignora o resto do ano.

## Estratégia 2: agregar no Trino, não no pandas

O relatório não precisa de 12 milhões de linhas por mês. Precisa dos totais por campanha. Então quem deve somar é o Trino, que faz isso perto dos dados e em paralelo:

```python
SQL_MES = """
    SELECT
        campanha_id,
        count(*)          AS eventos,
        sum(impressoes)   AS impressoes,
        sum(cliques)      AS cliques
    FROM eventos
    WHERE data_evento >= ? AND data_evento < ?
    GROUP BY campanha_id
"""

def consultar_mes(ano: int, mes: int) -> pd.DataFrame:
    inicio, fim = intervalo_do_mes(ano, mes)
    cur = conn.cursor()
    cur.execute(SQL_MES, (inicio, fim))
    df = pd.DataFrame(cur.fetchall(), columns=[c[0] for c in cur.description])
    df["mes"] = mes
    return df
```

Doze milhões de linhas viram algumas centenas ou milhares, uma por campanha. É isso que atravessa a rede e chega no Python.

De quebra, o `SELECT *` desaparece. Com formatos colunares como Parquet e ORC, ler menos colunas significa ler menos dados do disco.

> Regra prática: se o Python vai resumir os dados, peça para o banco resumir antes. Traga para o Python só o que ele não consegue fazer lá.

## Estratégia 3: salvar cada mês assim que ele fica pronto

Com doze consultas, aparece um risco novo: o mês 9 falha e você perde os 8 anteriores, porque estavam só na memória.

A solução é tratar cada mês como um **checkpoint**: assim que ele fica pronto, vai para um arquivo. Se o script for executado de novo, ele pula o que já existe.

```python
from pathlib import Path

SAIDA = Path("saida/relatorio_2025")
SAIDA.mkdir(parents=True, exist_ok=True)

def processar_mes(ano: int, mes: int) -> Path:
    arquivo = SAIDA / f"{ano}-{mes:02d}.parquet"
    if arquivo.exists():
        return arquivo
    consultar_mes(ano, mes).to_parquet(arquivo, index=False)
    return arquivo
```

O script fica **retomável**. Uma queda no meio do caminho custa um mês de processamento, não o ano inteiro.

## Estratégia 4: paralelismo, mas com limite

Doze consultas em sequência são seguras, mas lentas. Doze ao mesmo tempo voltam ao problema original: muita carga no cluster de uma vez.

O meio-termo é um número pequeno de meses em paralelo:

```python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=3) as pool:
    arquivos = list(pool.map(lambda m: processar_mes(2025, m), range(1, 13)))
```

Cada thread abre a sua consulta e fica esperando o Trino responder, então threads funcionam bem aqui: o trabalho pesado acontece no cluster, não no Python. O `max_workers` é o botão de controle. Comece baixo e suba só se o cluster aguentar.

Se o seu cliente de banco não for seguro para compartilhar uma conexão entre threads, abra uma conexão por thread.

## Estratégia 5: juntar os meses no final

Com os doze arquivos prontos, o relatório anual é uma soma de tabelas pequenas:

```python
anual = (
    pd.concat(pd.read_parquet(a) for a in arquivos)
      .groupby("campanha_id", as_index=False)[["eventos", "impressoes", "cliques"]]
      .sum()
)
```

Isso roda em segundos, porque cada arquivo tem só os totais do mês.

## O cuidado que quase ninguém tem: métricas que não somam

Somar mês a mês funciona para **contagens e somas**. Não funciona para tudo.

O exemplo clássico é **usuários únicos**. Se uma pessoa aparece em janeiro e em fevereiro, ela conta uma vez em cada mês, mas deveria contar uma vez só no ano. Somar os únicos de cada mês **infla o resultado**. O mesmo vale para médias de médias e medianas.

Para únicos, o Trino tem uma saída elegante: o **HyperLogLog**. Em vez de guardar o número de únicos de cada mês, você guarda um "resumo" probabilístico dos IDs. Depois junta os resumos dos meses e calcula o total do ano:

```sql
-- por mês: guarda o resumo dos usuários
SELECT campanha_id,
       CAST(approx_set(usuario_id) AS varbinary) AS usuarios_hll
FROM eventos
WHERE data_evento >= ? AND data_evento < ?
GROUP BY campanha_id;

-- no final: junta os resumos dos 12 meses
SELECT campanha_id,
       cardinality(merge(CAST(usuarios_hll AS HyperLogLog))) AS usuarios_unicos
FROM resumos_mensais
GROUP BY campanha_id;
```

O resultado é aproximado, com um erro padrão de cerca de 2%. Para relatório de volume, normalmente é mais que suficiente. Se a métrica precisar ser exata, ela precisa ser calculada sobre o período inteiro, e aí vale pensar em rodar só essa parte com mais cuidado.

## Antes e depois

| | Antes | Depois |
|---|---|---|
| Consultas | 1, com o ano inteiro | 12, uma por mês |
| Linhas que chegam ao Python | ~144 milhões | totais por campanha e mês |
| Onde a agregação acontece | pandas | Trino |
| Se algo falhar | recomeça do zero | refaz só o mês que falhou |
| Carga no cluster | um pico enorme | controlada pelo `max_workers` |

## Checklist para scripts de dados que vão crescer

- [ ] Divida o período em pedaços que você sabe que funcionam (dia, semana, mês).
- [ ] Filtre pela coluna de partição, com intervalo `>= início` e `< fim`.
- [ ] Agregue no banco. Traga para o Python só o resultado.
- [ ] Peça só as colunas de que precisa. Nada de `SELECT *`.
- [ ] Salve cada pedaço assim que ele fica pronto e pule o que já existe.
- [ ] Use paralelismo com limite, pensando no cluster e não só no seu script.
- [ ] Antes de somar pedaços, confira se a métrica pode ser somada.

## Conclusão

O script que travava não tinha um problema de Python. Tinha um problema de **tamanho de pedido**. Ele pedia ao Trino o ano inteiro de uma vez e depois jogava fora quase tudo o que recebia.

Dividir o problema em meses foi o que destravou o relatório. Agregar no lugar certo e salvar cada pedaço foi o que o deixou previsível. E é essa a lição que eu levo para qualquer script de dados: **ele vai crescer**. Escreva pensando no dia em que o mês vira um ano.

E você? Qual foi o maior volume que já derrubou um script seu, e como resolveu? Vamos conversar nos comentários! 🚀

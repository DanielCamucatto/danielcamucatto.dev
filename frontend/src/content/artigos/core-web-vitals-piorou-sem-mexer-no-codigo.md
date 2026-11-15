---
title: "Meu Core Web Vitals passou de 100% bom para 24% bom sem eu mexer em uma linha de código"
description: "O LCP do meu site foi de 616 ms para 5,2 segundos em uma semana, sem nenhum deploy. A causa não estava no código: um navegador automatizado entrou na amostra. Como separar o problema real do ruído antes de otimizar."
pubDate: 2026-11-26
tags: ["webperf","observabilidade","frontend","cloudflare"]
cover: "../../assets/capas/core-web-vitals-robo.jpg"
---

No domingo, dia da análise semanal de métricas, abri o Web Analytics da Cloudflare e o painel estava vermelho.

Uma semana antes, ele estava assim:

| Métrica (Core Web Vitals, usuários reais) | Semana anterior | Esta semana |
|---|---|---|
| LCP, percentil 75 | **616 ms** | **5.240 ms** |
| LCP bom | **100%** | **24%** |
| LCP ruim | 0% | 35% |
| Visitas (sem bots) | 26 | 101 |

Meu último deploy tinha sido na noite anterior ao início daquela semana. Nenhuma imagem nova, nenhuma dependência, nenhum ajuste de layout durante os sete dias. O site era o mesmo.

## A tentação de otimizar

Quando uma métrica de desempenho fica vermelha, o reflexo é abrir o código. Comprimir imagem, trocar fonte, adiar um script, mexer no cache.

Eu já tinha feito isso antes neste mesmo site, e funcionou: uma capa de artigo de 1600 px estava causando um LCP de 2,7 segundos, e resolvi com imagens responsivas. Dessa vez, antes de mexer em qualquer coisa, olhei **onde** o tempo estava sendo gasto.

## O que o painel já dizia

O LCP de 5,2 segundos se dividia assim:

| Etapa | Tempo (P75) | Parte do total |
|---|---|---|
| Tempo até o primeiro byte | 802 ms | 13% |
| Carregamento do recurso | 0 ms | 0% |
| **Atraso na renderização do elemento** | **5.240 ms** | **87%** |

Duas coisas chamam atenção.

A primeira: o servidor respondeu em 802 ms, que é normal. A Cloudflare entrega o site estático da borda, e nada ali mudou.

A segunda: o recurso foi baixado sem demora. O que atrasou foi o navegador **pintar** o elemento na tela. Isso quase nunca é problema de servidor ou de imagem. É o navegador de quem está visitando, que está lento, ocupado ou limitado.

Quando o gargalo está do lado de quem visita, a pergunta deixa de ser "o que está lento no meu site?" e passa a ser **"quem está visitando?"**.

## Quem estava visitando

Mudei a visão do painel de "geral" para dois recortes.

**Por país:** das 101 visitas, cerca de 88 vinham dos Estados Unidos. Nas semanas anteriores, os Estados Unidos eram uma fração pequena das visitas, ao lado do Brasil.

**Por página:** quase todas essas visitas, também cerca de 88, caíam na **home**, e em nenhuma outra página.

Visitas de pessoas se espalham pelos artigos, porque cada pessoa chega por um link diferente. Quase 90 visitas só na página inicial, vindas de um único país, têm outra cara: um programa visitando o site.

## A confirmação em outra fonte

O Web Analytics é um painel só. Para não tirar conclusão de uma única fonte, cruzei com outras duas.

**Google Analytics:** no relatório sem spam, a semana tinha 76 sessões, 69 delas **diretas** (sem origem), com um pico nos dias 9 e 10. Quem chega de um link tem origem. Quem chega sem nenhuma, em bloco, costuma ser máquina.

**Análise de segurança da Cloudflare:** abri os eventos da semana e olhei os IPs com mais requisições. Um deles, dos Estados Unidos, tinha **345 requisições em três rajadas** (dias 9, 10 e 11). Era um Chrome de desktop completo, em HTTP/3, e fez **54 POSTs para `/cdn-cgi/rum`**.

Esse caminho é o pulo do gato. `/cdn-cgi/rum` é o endereço para onde o script do Web Analytics manda as medições do navegador. Ou seja, esse visitante executou o JavaScript do site, esperou carregar e **reportou os próprios tempos**, como qualquer pessoa real faria.

Por isso o filtro "excluir bots" do painel não pegou: ele identifica robôs que não executam JavaScript. Um navegador de verdade, controlado por um programa, passa por visitante. E o LCP que ele reportou foi de vários segundos.

Eu não consigo provar que as 88 visitas vieram todas desse IP, só que o padrão bate: país, página, dias, tipo de navegador e o envio da medição. O que dá para afirmar com segurança é o mais importante: **o código do site não mudou, e o número piorou**.

## Por que um visitante estraga o percentil

Isso só pôde acontecer porque a amostra era pequena.

O Core Web Vitals do painel é um **percentil 75**: o valor abaixo do qual ficam 75% das visitas. Com 26 visitas reais, uma visita mais lenta ou mais rápida quase não mexe no resultado. Com 101 visitas, 88 delas sendo de um único programa, **quem manda no percentil é o robô**.

| Situação | Visitas reais | Visitas de robô | Quem decide o P75 |
|---|---|---|---|
| Semana anterior | ~26 | ~0 | as pessoas |
| Esta semana | ~13 | ~88 | o robô |

Medir desempenho com poucas visitas é medir quem passou. Sem cuidado, você acaba otimizando o site para o computador de outra pessoa.

## O que eu fiz (e o que decidi não fazer)

**Não mexi no código.** Esse foi o resultado mais importante da análise. Se eu tivesse reagido ao vermelho comprimindo imagens e mexendo em scripts, teria gasto horas resolvendo um problema que não existia, e talvez piorado algo que estava bom.

O que eu fiz foi do lado de fora do código:

1. **Criei uma regra na Cloudflare** bloqueando esse IP. É uma solução frágil, porque ele pode trocar de endereço, mas custa 30 segundos e não toca no site.
2. **Passei a olhar o recorte por país e por página antes de olhar o LCP.** Quando o número muda do nada, a primeira pergunta é de onde veio a visita.
3. **Uso o relatório sem spam no Analytics como referência.** Esse filtro eu já tinha criado numa semana anterior, por causa de outro tráfego de lixo.

Na mesma análise, apareceu outro visitante curioso: quatro IPs do Google Cloud na Bélgica, com cerca de 1,3 mil requisições, testando caminhos como `/.env`, `/config/master.key` e `/secrets.yaml`. É um scanner procurando segredos esquecidos. Como o site é estático e não tem nenhum desses arquivos, não havia nada a vazar, e criei uma segunda regra para barrá-los. Mas foi mais um lembrete de que **o tráfego de um site pequeno é, em boa parte, de máquinas**.

## Checklist: antes de otimizar uma métrica de campo

- [ ] Houve deploy ou mudança de conteúdo no período? Se não, desconfie da amostra antes do código.
- [ ] Quebre o tempo em partes (servidor, rede, renderização). Se o gargalo é a renderização no cliente, olhe quem é o cliente.
- [ ] Recorte por país e por página. Concentração em um país ou em uma página é sinal de robô.
- [ ] Compare com uma segunda fonte (Analytics, logs de segurança). Se só um painel mostra o problema, investigue o painel.
- [ ] Olhe o tamanho da amostra. Com poucas dezenas de visitas, um visitante atípico move o percentil.
- [ ] Só depois de limpar a amostra, decida se há algo no código para corrigir.

## Conclusão

A melhor otimização desta semana foi não otimizar nada.

Métrica de campo é a média de quem passou pelo seu site, e nem todo mundo que passa é gente. Antes de culpar o código, vale perguntar quem está visitando. Às vezes a resposta é um navegador controlado por um programa, em outro continente, esperando a página carregar.

Você já otimizou algo por causa de um número que, depois, se mostrou ruído? Conta nos comentários! 🚀

---
title: "Fritar pastel: o mock que escondeu o volume da API a 3 horas do deploy"
description: "O cliente atrasou as APIs, a gente mockou para ganhar tempo, e a API real chegou um dia antes da entrega: sem paginação e com muito mais dados do que o front aguentava. O que fizemos em 3 horas, a dívida que ficou e o que mudamos depois."
pubDate: 2026-11-13
tags: ["nextjs","react","arquitetura","carreira"]
cover: "../../assets/capas/fritar-pastel-mock-api.jpg"
---

Quem já trabalhou em consultoria conhece esta cena.

O cliente demora semanas para mandar os requisitos: o texto do e-mail, o acesso ao sistema, o layout da landing page. Quando finalmente manda tudo, espera que esteja pronto **no dia seguinte**.

A gente chamava isso de **fritar pastel**. O pedido chega, e o cliente espera que saia quentinho na hora, como na feira.

## A regra que ninguém escreve no contrato

Em TI, entrega sob pressão tem uma regra simples, que todo mundo conhece e quase ninguém fala em voz alta:

| Opção | O que você ganha | O que você paga |
|---|---|---|
| Entregar rápido | cumpre o prazo que o cliente espera | abre mão de testes, de acabamento, de validar o que não deu tempo |
| Entregar completo | entrega o que foi combinado, do jeito certo | estoura o prazo (o SLA) que o cliente tinha na cabeça |

Não existe a terceira opção, "rápido e completo". Quando parece que existe, é porque alguma coisa ficou escondida. E foi exatamente isso que aconteceu nesta história.

## O atalho: mockar a API

Numa consultoria em que trabalhei, pegamos um desses pastéis. Era um front em **Next.js** que consumia as APIs do cliente para montar as telas.

O problema: o cliente demorou para nos passar as APIs que ele usava para consultar o serviço. E o prazo de entrega não mudou.

A decisão foi a que quase todo time toma nessa situação: **mockar as APIs**. Criamos respostas falsas com o formato que esperávamos, construímos as telas em cima delas e combinamos o seguinte: quando as APIs reais chegassem, era só apontar as requisições para os endereços certos.

Na teoria, trocar o mock pela API real era mudar uma URL.

Na prática, o mock tinha um defeito que só aparece tarde demais: **ele responde o que você imagina, não o que a API real devolve.** O formato até pode bater. O volume, quase nunca.

## A virada: a API real chegou um dia antes

Como era de se esperar, o cliente entregou os dados das APIs **faltando um dia para a entrega final**.

Quando finalmente apontamos o front para a API real, veio a surpresa:

- **Eram muito mais dados do que o sistema aguentava.** O mock devolvia uma lista pequena e bem comportada. A API real devolvia tudo.
- **A API não tinha paginação.** Não havia como pedir "os primeiros 20". Cada chamada trazia a lista inteira.
- **O front ficou absurdamente lento.** O React recebia muito mais dados do que a tela mostrava e tentava renderizar tudo.
- **Começaram os erros de hidratação.**

Esse último merece uma explicação rápida.

### O que é erro de hidratação

No Next.js, a página é renderizada primeiro no servidor, que manda o HTML pronto para o navegador. Depois, o React "acorda" esse HTML no navegador e passa a controlar a página. Esse processo se chama **hidratação**.

Para dar certo, o React precisa gerar no navegador **exatamente o mesmo HTML** que o servidor gerou. Se alguma coisa diferir, ele reclama do erro de hidratação, e a página pode piscar, perder interatividade ou ser refeita do zero no navegador.

Com uma lista enorme, componentes pesados e dados que podiam mudar entre a renderização no servidor e a no navegador, as chances de diferença se multiplicam. Junte isso com a lentidão, e a tela que funcionava lindamente com o mock virou outra coisa.

E faltavam **3 horas** para o deploy e a apresentação para o cliente.

## O que fizemos em 3 horas

Com esse prazo, não dava para consertar a causa: a API era do cliente, e não ia ganhar paginação até o fim da tarde. O objetivo passou a ser outro: **entregar algo que funcionasse na apresentação, sabendo que seria provisório.**

### 1. Paginação no front

Se a API não pagina, o front pagina. A API continuava devolvendo tudo, mas a tela passou a renderizar só um pedaço por vez:

```tsx
const POR_PAGINA = 20;

function ListaPaginada({ itens }: { itens: Item[] }) {
  const [pagina, setPagina] = useState(0);
  const visiveis = itens.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);
  const totalPaginas = Math.ceil(itens.length / POR_PAGINA);

  return (
    <>
      {visiveis.map((item) => (
        <Linha key={item.id} item={item} />
      ))}
      <Paginacao atual={pagina} total={totalPaginas} onChange={setPagina} />
    </>
  );
}
```

Isso não resolve o tamanho da resposta: os dados ainda trafegam inteiros pela rede. Mas resolve o que estava travando a tela, que era **renderizar** tudo de uma vez.

### 2. Simplificar componentes e renderizações

A segunda medida foi cortar o que deixava cada item pesado e o que podia gerar diferença entre servidor e navegador:

- componentes visuais mais simples, com menos camadas e menos efeitos;
- menos lógica dentro da renderização de cada item da lista;
- nada que dependesse do navegador sendo calculado durante a primeira renderização.

O custo apareceu na hora: **a tela ficou visualmente mais simples do que o layout que tínhamos apresentado.**

## A apresentação: saiu a tempo, mas o cliente percebeu

O deploy saiu e a apresentação aconteceu no horário. Funcionou.

Mas o cliente notou que a tela tinha elementos visuais mais simples do que o combinado. Explicamos o que tinha acontecido: foi um problema técnico, causado pelo volume de dados da API, e na semana seguinte teríamos a tela **pixel perfect**, do jeito que estava no Figma, que era o que tínhamos combinado.

Repare no que aconteceu aqui. O pastel foi frito no prazo, mas parte da conta ficou para a semana seguinte. Isso é **dívida técnica** na forma mais pura: uma decisão consciente de entregar menos agora para cumprir o prazo, com o compromisso de pagar depois.

O problema não é ter feito dívida. Às vezes, é a decisão certa. O problema é quando ela é feita **sem ninguém saber**, e o mock tinha escondido a dívida de nós mesmos até o último dia.

## O que mudamos depois

A lição que ficou não foi técnica. Foi de processo.

A partir desse projeto, começamos a pedir a **todos os nossos clientes** que atendessem às nossas **especificações técnicas** antes de começarmos. Ou seja: o que a gente precisa receber, e em que condições, para conseguir entregar no prazo que eles querem.

Se eu fosse montar essa lista hoje, ela teria pelo menos isto:

- **Prazo para entregar as APIs**, com data, e não "assim que der". Se a API atrasar, a entrega atrasa junto, e isso fica escrito desde o começo.
- **Uma amostra real da resposta**, com o volume de produção ou pelo menos o tamanho esperado. Não o formato: o tamanho.
- **Paginação** (ou filtros) em qualquer endpoint que devolva listas.
- **Ambiente de homologação** com dados parecidos com os de produção.

## Como usar mock sem cair nessa armadilha

Mockar não foi o erro. Mock é uma ferramenta ótima para não ficar parado esperando o outro lado. O erro foi confiar que o mock representava a realidade. Algumas formas de evitar isso:

**Mock com volume, não só com formato.** Se o mock devolve 5 itens, você está testando 5 itens. Gere milhares:

```ts
import { faker } from "@faker-js/faker";

export const itensMock = Array.from({ length: 10_000 }, () => ({
  id: faker.string.uuid(),
  nome: faker.commerce.productName(),
  descricao: faker.lorem.paragraph(),
}));
```

Se a tela travar com 10 mil itens no mock, ela vai travar em produção. A diferença é que você descobre na primeira semana, não na última tarde.

**Pergunte o tamanho antes de perguntar o formato.** "Quantos registros essa chamada devolve hoje? E daqui a um ano?" é uma pergunta de 30 segundos que teria mudado essa história inteira.

**Trate a troca do mock pela API real como uma tarefa, não como um detalhe.** "É só trocar a URL" é a frase mais perigosa do projeto. Reserve tempo para ela no cronograma, de preferência longe da véspera da entrega.

**Deixe a dívida visível.** Quando o atalho for necessário, escreva o que ficou para trás e combine com o cliente quando será pago. Uma dívida que o cliente conhece é um combinado. Uma dívida que ele descobre na apresentação vira desconfiança.

## Checklist para o próximo pastel

- [ ] Peça as APIs com data de entrega, e amarre o prazo do projeto a essa data.
- [ ] Peça uma amostra real da resposta, com o volume de produção.
- [ ] Confirme se os endpoints de lista têm paginação ou filtros.
- [ ] Monte o mock com volume realista, não só com o formato certo.
- [ ] Reserve tempo no cronograma para trocar o mock pela API real.
- [ ] Se precisar de um atalho, escreva a dívida e combine com o cliente quando ela será paga.

## Conclusão

Fritar pastel faz parte da vida em consultoria, e nem sempre dá para fugir. O que dá para escolher é **onde fica o risco**: escondido num mock que só responde o que você imagina, ou na mesa, combinado com o cliente desde o começo.

Naquela tarde, a gente entregou no prazo e pagou a conta depois. Hoje, a primeira pergunta que eu faço quando alguém me passa uma API é: **quantos dados ela devolve?**

E você? Já teve um pastel que queimou na véspera da entrega? Conta nos comentários! 🚀

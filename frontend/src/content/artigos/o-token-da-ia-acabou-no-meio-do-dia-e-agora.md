---
title: "O token da IA acabou no meio do dia. E agora?"
description: "Dois projetos, quatro repositórios, entrega no dia seguinte e o aviso de que a sessão de IA ia parar por duas horas. O que fazer com esse tempo, e por que ser produtivo não é ser babá de agente."
pubDate: 2026-10-20
tags: ["ia","produtividade","carreira","regrasdenegocio"]
cover: "../../assets/capas/token-ia-acabou.jpg"
---

Era meio do dia e eu estava com **dois projetos rodando ao mesmo tempo**. Dois agentes no Claude Code, cada um coordenando subagentes, quatro subagentes no total, trabalhando em **quatro repositórios diferentes**. As duas demandas precisavam estar entregues no dia seguinte.

Aí apareceu o aviso: a sessão ia ficar sem tokens, e o limite só voltaria **em duas horas**.

Com prazo apertado, a reação mais comum é uma de duas: **pagar por mais tokens** ou **abrir outra IA** e continuar de onde parou. Eu também uso o Gemini, então a segunda opção estava a um clique.

Não fiz nenhuma das duas. Parei e me fiz uma pergunta desconfortável: **se a IA para, eu paro junto?**

## Babá de agente

Quem trabalha com vários agentes em paralelo conhece a rotina. Você distribui as tarefas, aprova um comando aqui, corrige a direção ali, revisa um diff, libera o próximo passo. A tela não para de se mexer, e a sensação é de que você nunca produziu tanto.

Só que boa parte desse trabalho é **cuidar dos agentes**, não do problema. É fácil confundir a velocidade deles com a sua produtividade.

Quando o token acaba, essa confusão aparece. Os agentes param, e o que sobra é o que está na sua cabeça. Se o que está lá é só "o que eu pedi para cada agente fazer", as duas horas viram espera.

A conclusão que tirei naquela tarde foi simples: **eu não sou produtivo por ser babá de IA. Sou produtivo porque entendo, a fundo, as regras de negócio da empresa.** E isso não acaba junto com o token.

## O que a IA não sabe sobre a sua empresa

Um agente lê o código e infere o que pode. Mas o código guarda **decisões que já foram tomadas**, não os motivos por trás delas. O agente não sabe:

- **Por que a regra existe.** Aquele `if` estranho pode ser uma exigência legal, um acordo com um cliente grande ou um bug que alguém transformou em funcionalidade.
- **Quais são as exceções que ninguém escreveu.** O caso que o time de suporte resolve na mão toda semana não está em nenhum repositório.
- **O que pode quebrar fora do código.** Um relatório que o financeiro usa, uma integração de um parceiro, um processo manual de outra área.
- **Quem decide.** Quando duas regras entram em conflito, quem tem a palavra final não é o modelo.

É justamente aí que mora o valor de um dev mais experiente. A IA escreve o código de uma regra muito rápido. **Saber qual é a regra certa** continua sendo trabalho de gente.

## O que fazer nas duas horas

Se o token acabou, o tempo não precisa virar espera. Esta é a lista que eu sigo, e todas as tarefas dela tornam o trabalho com IA melhor quando o limite voltar.

### 1. Escreva as regras de negócio com as suas palavras

Pegue a demanda e escreva, em texto corrido ou em tópicos, **o que precisa acontecer e o que não pode acontecer**. Critérios de aceite, casos de borda, o que fazer quando o dado vem incompleto.

Se você trava em algum ponto, achou uma dúvida que o agente teria resolvido "do jeito dele", sem perguntar.

### 2. Revise o que os agentes já entregaram

Com vários agentes em paralelo, é comum aprovar diff rápido demais. Use a pausa para ler **com calma** o que foi gerado e comparar com as regras que você acabou de escrever.

Código que funciona, mas implementa a regra errada, é o pior tipo de bug: passa no teste, passa no review apressado e chega em produção.

### 3. Escreva os testes das regras

Teste que descreve o negócio ("cliente com pedido cancelado não recebe cupom") vale mais do que teste que descreve a implementação. É o tipo de teste que você consegue escrever sem IA, porque o difícil nele é **saber o comportamento esperado**, não digitar o código.

Quando o token voltar, esses testes viram a régua para o agente: ele implementa até passar.

### 4. Converse com quem conhece o negócio

PO, analista, alguém do suporte, quem pediu a demanda. Leve as dúvidas que surgiram no passo 1. Uma conversa de 15 minutos costuma evitar um dia de retrabalho, e **nenhum agente vai marcar essa conversa por você**.

### 5. Prepare a fila para quando o limite voltar

Quebre o que falta em tarefas pequenas, cada uma com contexto, regras e critério de pronto. Quando a sessão voltar, você não começa explicando tudo de novo: entrega um pedido bem escrito e revisa o resultado.

Na prática, as duas horas sem IA viram **a parte mais importante do prompt**.

### 6. Faça o que é pequeno demais para delegar

Renomear uma variável confusa, ajustar uma mensagem de erro, atualizar o README, fechar aquele PR que só precisava de um último ajuste. São tarefas em que explicar para o agente leva mais tempo do que fazer.

## Antes de acabar: gaste melhor

A pausa também mostrou onde eu estava gastando mal. Algumas coisas que mudei:

- **Paralelismo tem preço.** Dois agentes com quatro subagentes consomem tokens muito mais rápido. Hoje eu paralelizo só o que é realmente independente, e deixo o resto em sequência.
- **Uma sessão por tarefa.** Conversa longa carrega todo o histórico a cada mensagem. Terminou a tarefa, abra uma sessão nova.
- **Contexto do projeto num arquivo.** Um arquivo com as regras, os comandos e as convenções do repositório (no Claude Code, o `CLAUDE.md`) evita reexplicar o projeto toda vez.
- **Não peça para o agente ler tudo.** Aponte os arquivos que importam. Quanto mais ele lê sem necessidade, mais rápido o limite chega.
- **O modelo mais caro para o que é difícil.** Tarefa trivial não precisa do modelo mais potente, e às vezes não precisa de modelo nenhum.

## E se eu pagar por mais tokens?

Não tem nada de errado nisso. Se o prazo é crítico e o custo cabe no orçamento, pagar pode ser a decisão certa. O mesmo vale para trocar de ferramenta.

O ponto é **não fazer isso no automático**. Trocar de IA no meio da tarefa tem um custo que não aparece na fatura: o outro modelo não tem o contexto da sessão, as convenções do projeto nem as decisões que você tomou com o primeiro. Você passa um bom tempo reexplicando tudo, e o resultado nem sempre segue o mesmo padrão.

Antes de abrir a carteira ou outra aba, vale perguntar: **o que eu consigo fazer agora que só eu sei fazer?** Quase sempre a lista é maior do que parece.

## Checklist para quando o token acabar

- [ ] Escrevi as regras de negócio da demanda com as minhas palavras.
- [ ] Revisei com calma o que os agentes entregaram, comparando com essas regras.
- [ ] Escrevi testes que descrevem o comportamento esperado.
- [ ] Levei as dúvidas para quem conhece o negócio.
- [ ] Deixei as próximas tarefas quebradas e prontas para quando o limite voltar.
- [ ] Resolvi o que era pequeno demais para delegar.
- [ ] Anotei onde estava gastando tokens à toa.

## Conclusão

A IA multiplica o que você sabe. Se você entende a regra de negócio, ela multiplica a sua entrega. Se não entende, **ela multiplica o erro**, e numa velocidade que nenhum dev conseguiria sozinho.

O limite de tokens vai acabar de novo, para mim e para você. Quando acontecer, vale lembrar que o agente parou, mas o seu conhecimento do negócio continua disponível. Duas horas usadas nisso costumam render mais do que duas horas de agentes rodando sem direção.

Escrevi mais sobre como começar a trabalhar com IA em [Do Medo à Maestria](/artigos/do-medo-a-maestria-guia-pratico-para-o-desenvolvedores-na-era-da-ia/).

E você? O que faz quando o token acaba no meio do dia? Vamos conversar nos comentários! 🚀

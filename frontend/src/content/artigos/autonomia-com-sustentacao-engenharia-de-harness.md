---
title: "Autonomia com sustentação: o papel da engenharia de harness"
description: "Dar autonomia para agentes de IA não é escrever um prompt melhor. É montar a estrutura em volta deles: contexto, verificação, limites e memória. O que eu uso no dia a dia e o que aprendi errando."
pubDate: 2026-11-03
tags: ["ia","claudecode","engenhariadesoftware","produtividade"]
cover: "../../assets/capas/engenharia-de-harness.jpg"
---

No [artigo sobre o token que acabou no meio do dia](/artigos/o-token-da-ia-acabou-no-meio-do-dia-e-agora/), eu disse que ser produtivo com IA não é ser **babá de agente**: ficar aprovando comando, corrigindo rumo e revisando diff o dia inteiro.

Mas isso deixa uma pergunta no ar: **então como deixar o agente trabalhar sozinho sem ele quebrar tudo?**

A resposta não está num prompt melhor. Está no que fica **em volta** do modelo. É isso que tem sido chamado de **engenharia de harness**.

## O que é um harness

Em inglês, *harness* é o arnês, a cadeirinha de escalada. Ela não escala por você. Mas é por causa dela que você consegue subir mais alto: se escorregar, a queda é curta.

Num agente de IA, o harness é tudo o que não é o modelo:

| Peça | Pergunta que ela responde |
|---|---|
| Contexto | O que o agente precisa saber deste projeto antes de começar? |
| Ferramentas | O que ele consegue fazer: rodar testes, abrir o navegador, consultar uma API? |
| Limites | O que ele pode fazer sozinho e o que precisa me perguntar antes? |
| Verificação | Como ele (e eu) sabe que terminou de verdade? |
| Memória | O que ele aprendeu ontem e não pode errar de novo hoje? |

O modelo é o mesmo para todo mundo. **O harness é o que é seu.** E é ele que decide quanto de autonomia dá para entregar com segurança.

## Por que o prompt não basta

Um prompt vale para uma conversa. Amanhã, numa sessão nova, o agente não lembra que o banco sobe com Docker, que o projeto usa multi-tenancy ou que um teste de snapshot quebra toda vez que alguém mexe nos textos.

Se essas coisas só existem na sua cabeça, você vai repetir tudo de novo. E vai voltar a ser babá.

> Prompt é instrução para uma tarefa. Harness é a estrutura que vale para todas.

## As peças do meu harness

Não tem nada de sofisticado aqui. São arquivos de texto e algumas configurações. O que muda é tratar isso como parte do projeto, e não como detalhe.

### 1. O repositório explica a si mesmo

Todo repositório em que eu trabalho com agentes tem um `CLAUDE.md` (ou `AGENTS.md`) na raiz. No monorepo maior que mantive, ele tinha **125 linhas**:

- os comandos para subir banco e Redis, rodar o frontend e o backend;
- como os módulos do backend se organizam, como funciona o multi-tenancy e a fila de envio de SMS;
- as convenções de código que ninguém escreveu em lugar nenhum.

É o mesmo documento que eu daria para uma pessoa nova no time. A diferença é que o agente lê **inteiro, toda vez**.

Para tarefas maiores, uso um segundo tipo de arquivo: um briefing. Ele tem seções como "o que já foi feito", "tarefa imediata", "**não fazer agora**" e "ao terminar". A seção do que não fazer é a que mais evita estrago. O agente é muito bom em ser útil além do que foi pedido.

### 2. "Pronto" é o que a CI diz, não o que o agente diz

A regra mais importante: **o agente roda o mesmo que a CI roda antes de dizer que terminou.** No meu site, isso é `lint`, `test` e `build`.

Aprendi isso do jeito ruim. Um PR de conteúdo falhou na CI porque mudar um texto quebrava um teste de snapshot. O agente tinha dito que estava tudo certo, e do ponto de vista dele estava: o código compilava. Depois disso, a regra virou uma linha fixa nas instruções do projeto, junto com o comando para atualizar o snapshot e o aviso de conferir o diff.

Verificação é o que transforma "acho que funcionou" em "funcionou".

### 3. Limites claros: o que ele faz sozinho e o que me pergunta

Autonomia não é tudo ou nada. Eu separo em três faixas:

| Faixa | Exemplos | Como fica |
|---|---|---|
| Faz sozinho | ler código, rodar testes, criar branch, editar arquivos | liberado |
| Faz e me mostra | abrir PR, mudar configuração do projeto | liberado, com revisão depois |
| Só com o meu "sim" | publicar, enviar mensagem, apagar, mexer em produção | sempre pergunta |

As ferramentas de agente já permitem configurar isso por projeto, com listas do que é permitido e do que é negado. Vale o tempo gasto: cada pedido de permissão desnecessário é um momento de babá, e cada permissão larga demais é um risco.

### 4. Memória: cada erro vira uma linha

Essa é a peça que mais rende com o tempo. Toda vez que algo dá errado de um jeito não óbvio, vira uma anotação que o agente lê na próxima sessão. Alguns exemplos reais das minhas:

- No painel da Cloudflare, o botão "Imprimir relatório" fica colado no seletor de período e abre um diálogo que trava a aba.
- A proteção contra robôs do meu site bloqueia o cliente HTTP padrão do Python, mas deixa o `curl` passar.
- A API do dev.to devolve erro 429 se você cria vários artigos em sequência.

Nada disso está em documentação nenhuma. Sem a anotação, cada sessão nova paga o mesmo preço de novo.

### 5. Trabalho e projetos pessoais não se misturam

Mantenho **perfis separados** do agente para o trabalho e para os meus projetos pessoais. Cada um tem a sua configuração, o seu modelo padrão, os seus plugins e a sua memória.

Isso evita duas coisas: o agente aplicar uma convenção do trabalho no meu site (ou o contrário), e uma informação da empresa aparecer onde não devia. Até a conta do GitHub muda: no projeto pessoal, os PRs saem da minha conta pessoal, não da do trabalho.

## O que o harness não resolve

Um cuidado que vale para todo mundo: **harness também é código, e código tem dívida.**

Arquivos de configuração acumulam coisas. Integrações antigas, permissões que faziam sentido num projeto que acabou e, no pior caso, tokens de acesso escritos direto no arquivo. Revise o seu harness como revisa o resto do código: o que não serve mais sai, e segredo fica em variável de ambiente ou num cofre, nunca em texto puro.

E tem uma coisa que nenhum harness entrega: **saber por que a regra de negócio existe.** O agente segue as instruções que você escreveu. Se a instrução está errada porque você não entendeu o negócio, ele vai executar o erro com muita eficiência.

É por isso que o meu papel mudou, mas não diminuiu. Eu reviso menos comandos e mais decisões.

## Autonomia com sustentação

O título deste artigo é a ideia toda. Dá para dar muita autonomia para um agente, desde que exista algo que segure a queda:

- o contexto evita que ele comece errado;
- a verificação mostra quando ele errou;
- os limites impedem que um erro vire estrago;
- a memória evita que o mesmo erro aconteça duas vezes.

Sem isso, você tem duas opções ruins: vigiar tudo, ou confiar e torcer.

## Checklist para montar o seu harness

- [ ] Crie um `CLAUDE.md` ou `AGENTS.md` com os comandos, a arquitetura e as convenções do projeto.
- [ ] Escreva o que **não** fazer, não só o que fazer.
- [ ] Faça o agente rodar o mesmo que a CI antes de dizer que terminou.
- [ ] Separe o que ele faz sozinho do que precisa da sua aprovação.
- [ ] Transforme cada erro não óbvio numa linha de memória.
- [ ] Separe o contexto do trabalho do contexto dos projetos pessoais.
- [ ] Revise o harness de tempos em tempos e tire segredos de arquivos de configuração.

## Conclusão

Quando o token acabou no meio do dia, eu percebi que boa parte do meu trabalho com agentes era vigiar. Montar o harness foi o que mudou isso: o tempo que eu gastava aprovando comando agora vai para entender o problema e revisar as decisões que importam.

O modelo vai continuar melhorando, e o de todo mundo melhora junto. O harness é o que cada um constrói, e é nele que está a diferença.

E você? O que já está no seu harness, e o que aprendeu do jeito difícil? Vamos conversar nos comentários! 🚀

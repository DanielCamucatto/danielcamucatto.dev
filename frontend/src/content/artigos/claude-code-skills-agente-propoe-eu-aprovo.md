---
title: "Meu agente propõe skills, eu leio o SKILL.md e aprovo: como escolho o que instalar"
description: "Skills dão capacidades novas ao agente, mas também são instruções e código que ele executa. Como uso a find-skills com um agente orquestrador, por que leio o SKILL.md antes de aprovar e o que fiz quando uma skill não servia."
pubDate: 2026-12-01
tags: ["ia","claudecode","seguranca","produtividade"]
cover: "../../assets/capas/claude-code-skills.jpg"
---

No [artigo sobre engenharia de harness](/artigos/autonomia-com-sustentacao-engenharia-de-harness/), uma das peças era o **limite**: o que o agente faz sozinho e o que só faz com o meu "sim".

Falta falar de uma parte desse limite que mudou o meu dia a dia: **as skills**. Elas dão capacidades novas ao agente. E, justamente por isso, a pergunta é a mesma: **como deixar o agente ganhar capacidades sem eu virar babá e sem abrir a porta para qualquer código?**

## O que é uma skill

Uma skill é uma pasta com um arquivo `SKILL.md`. Nele estão as instruções de como fazer um tipo de tarefa (ler um PDF, revisar um PR, mexer numa planilha) e, às vezes, scripts e outros arquivos de apoio. O agente carrega a skill quando a tarefa pede.

Não confunda com um **servidor MCP**. A skill ensina o agente a fazer algo. O servidor MCP é um programa que expõe ferramentas para ele, como acessar um sistema. Neste artigo aparecem os dois.

O ponto que importa: uma skill de terceiros é **instrução e código que o seu agente vai executar**, com as permissões que ele tem na sua máquina.

## O primeiro passo: a find-skills

Eu não saio procurando skills em sites. Uso a `find-skills`, uma skill da comunidade (não é um pacote oficial da Anthropic) que embrulha a CLI `npx skills` e busca no ecossistema do [skills.sh](https://skills.sh). A busca é, em geral, `npx skills find <palavra>`. Como existem várias versões, confira o `--help` da sua.

O que muda é **quem** usa a busca.

## Meu fluxo: o orquestrador propõe, eu aprovo

Eu tenho um agente **orquestrador**. Ele lê as tasks e, conforme o que cada uma pede, avalia se falta alguma skill. Quando falta, ele usa a `find-skills` para procurar candidatas.

E para aí. **Ele nunca instala nada sozinho: sempre pergunta a minha aprovação.**

Parece detalhe, mas é a diferença entre um agente que cresce com o meu controle e um agente que decide sozinho que código novo vai rodar.

## Por que eu não automatizo essa aprovação

Porque o risco é medido, e não é pequeno:

- [Um estudo](https://arxiv.org/abs/2601.10338) analisou 31.132 skills (de 42.447 coletadas em dois marketplaces) e encontrou **26,1% com pelo menos uma vulnerabilidade**, entre injeção de prompt, vazamento de dados, escalada de privilégio e risco de cadeia de suprimentos.
- [Outro relatório](https://arxiv.org/abs/2605.28588) analisou 3.984 skills e confirmou **76 com carga maliciosa**, incluindo roubo de credenciais e instalação de backdoor.

São preprints, com bases e critérios diferentes, então os percentuais não se comparam entre si. Mas a conclusão é a mesma: skill de terceiros não é conteúdo inofensivo. Aprovar é o momento em que eu sou o último filtro.

## O que eu faço antes de aprovar: leio o SKILL.md

Eu leio o `SKILL.md` antes de aprovar. É rápido e responde a duas perguntas:

1. **Isso faz o que eu preciso?**
2. **O que isso vai rodar na minha máquina?**

Ao ler, vale prestar atenção em alguns pontos (esta lista é recomendação geral, não um protocolo oficial):

- de onde a skill vem e quem a mantém;
- quais comandos e scripts ela manda executar;
- se ela acessa a rede, arquivos fora do projeto ou credenciais;
- se há instruções estranhas, como "ignore as regras anteriores" ou "não mostre isto ao usuário".

## O caso em que eu recusei uma skill

Numa dessas buscas apareceu uma skill para **ler um documento do Google Docs**. À primeira vista, resolvia o meu problema.

Ao ler o `SKILL.md`, percebi que ela lia **apenas o texto do documento**. Eu também precisava dos **comentários**, onde fica boa parte da discussão. Sem eles, o agente leria o documento e perderia o contexto.

Eu recusei. E o motivo importa: **foi a leitura do `SKILL.md` que mostrou a lacuna, antes de instalar qualquer coisa.** Sem esse passo, eu teria descoberto só depois, com uma resposta do agente incompleta e confiante.

## O que fiz em vez de aceitar

Fiz a minha própria ferramenta. Tecnicamente, é um **servidor MCP**, e ele roda como um **container Docker** na minha máquina. Algumas decisões que acertei nela:

- **Container efêmero, sem porta aberta.** Ele fala com o agente por entrada e saída padrão (`docker run --rm -i`). Sobe quando a sessão precisa e some quando ela termina.
- **Acesso pela conta de serviço.** Ela só enxerga os documentos que foram compartilhados com ela. Para consultar, basta o papel de Leitor.
- **Credencial fora da imagem.** A chave fica num arquivo fora do projeto e fora do git, e é montada no container como **somente leitura**. Quem a usa é a ferramenta: o que entra no contexto do agente é o resultado, não a chave.
- **Os comentários, que eram o motivo de tudo.** A ferramenta lista threads e respostas, e também cria comentários e responde. Os comentários vêm da API do Drive, que é separada da API do Docs.
- **Teste sem depender do agente.** Eu falo com o container direto, mandando as mensagens do protocolo MCP, para saber se a ferramenta funciona antes de registrá-la.
- **Versão do pacote fixada.** A versão 2.x do pacote `mcp` mudou a API e quebrava a ferramenta já na inicialização. Fixei a versão abaixo da 2.0 e anotei o motivo no README.

E uma lição que ficou no README: o texto **dentro de tabelas** sumia da leitura, **sem nenhum erro**. A resposta voltava completa na aparência, só sem o conteúdo. Hoje o extrator desce nas tabelas, e a regra ficou anotada: se uma leitura parecer incompleta, confira por outro caminho.

### O que o container protege

Ele protege a **credencial** e a **minha máquina**. O texto que a ferramenta devolve segue para o modelo, então tudo o que eu leio com ela precisa estar dentro do que o contrato e a política do meu plano permitem. O container resolve um problema de segurança, e não o outro.

## O que mudou

- As capacidades do agente crescem **quando eu aprovo**, e não quando ele decide.
- Uma skill que não serve é recusada em minutos, **antes** de instalar.
- Quando nenhuma serve, eu sei exatamente o que construir, porque a lacuna ficou clara.

É o mesmo princípio do harness: autonomia com sustentação. O agente escolhe o que propor. Eu fico com o "sim".

## Checklist para escolher skills

- [ ] Deixe o agente **propor** skills, não instalar.
- [ ] Leia o `SKILL.md` inteiro, incluindo os scripts que ele manda rodar.
- [ ] Confira a origem e quem mantém a skill.
- [ ] Veja o que ela executa: comandos, acesso à rede, arquivos e credenciais.
- [ ] Teste num projeto descartável antes de usar de verdade.
- [ ] Se nenhuma serve, escreva a sua e documente o motivo.
- [ ] Mantenha credenciais fora do alcance do agente (montadas como somente leitura, fora do git).
- [ ] Dê o menor acesso que resolve (Leitor, e não Editor).
- [ ] Lembre que o que a ferramenta devolve vai para o modelo.

## Conclusão

Skill é capacidade, e capacidade vem com risco. O que me deu tranquilidade não foi desconfiar de todas, e sim ter um passo claro: o agente propõe, **eu leio e eu aprovo**.

E você? Deixa o seu agente instalar skills sozinho? O que você olha antes de aprovar? Vamos conversar nos comentários! 🚀

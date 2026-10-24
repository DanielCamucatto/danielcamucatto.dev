---
title: "Meu site tinha 91 visitantes. A maioria era robô (parte 2)"
description: "Duas semanas depois de ligar o Bot Fight Mode e mudar a divulgação no LinkedIn, os números voltaram. Uma hipótese se confirmou pela metade, a outra estava errada."
pubDate: 2026-10-27
tags: ["observabilidade","cloudflare","analytics","linkedin"]
cover: "../../assets/capas/site-robos-parte-2.jpg"
---

Na [parte 1](/artigos/meu-site-tinha-91-visitantes-a-maioria-era-robo/), eu descobri que os 91 usuários que o Google Analytics mostrava eram, na maior parte, robôs. A conta honesta dava algo como **5 leitores reais por dia**.

Terminei com dois experimentos rodando:

1. **Bot Fight Mode** ligado na Cloudflare, para barrar robôs antes de chegarem ao site.
2. **Link no primeiro comentário** nos posts do LinkedIn, em vez de no corpo do texto, apostando que o LinkedIn entregaria mais.

Prometi contar o que aconteceu, inclusive se as hipóteses estivessem erradas. Uma delas estava.

## Experimento 1: barrar robôs na borda

### Os primeiros seis dias pareciam perfeitos

Seis dias depois de ligar o Bot Fight Mode, as requisições nas últimas 24 horas tinham caído de **635 para 125**. Uma queda de 80%.

E o melhor sinal veio da comparação entre as ferramentas. Na semana de 12 a 18 de outubro:

| Ferramenta | Número |
|---|---|
| Google Analytics | 15 usuários, 19 visualizações |
| Cloudflare Web Analytics (sem robôs) | 15 visitas, 19 visualizações |

Pela primeira vez, **os dois números batiam**. O GA estava medindo gente.

### Mas a queda não foi toda mérito do Bot Fight Mode

Quando fui ver quem tinha sumido, a história ficou menos bonita.

O IP de Singapura que fazia mais de um quarto do tráfego tinha feito **1,54 mil requisições** e parado na manhã do dia 13. Só que, dessas, o Bot Fight Mode barrou **apenas 27**. Ele não foi expulso. **Ele parou sozinho.**

Se eu tivesse olhado só o antes e o depois, teria dado todo o crédito para a ferramenta. Para garantir que ele não voltasse, criei uma regra de bloqueio específica para esse IP, uma linha só:

```
(ip.src eq 178.128.112.36)
```

O Bot Fight Mode fez, sim, o trabalho dele com os outros robôs. Ele vem desafiando todos os dias uma faixa de IPs de Singapura (`47.128.63.x`) e outra de servidores nos EUA (`18.97.9.x`). E as regras gerenciadas da Cloudflare barraram um scanner procurando arquivos PHP, num site que não tem uma linha de PHP.

### Duas semanas depois, o número voltou a subir

Nesta semana, as requisições das últimas 24 horas estavam em **342**. Bem acima dos 125, ainda que abaixo dos 635.

E aqui veio outra lição. Um pico de cerca de 65 requisições de uma vez no gráfico era **eu mesmo**: um script que conferia se todos os links dos meus artigos no dev.to apontavam para páginas que existem. Tirando isso, ficam cerca de 275.

O `robots.txt` foi pedido **211 vezes** em sete dias. Estados Unidos (1,02 mil requisições) lideram, à frente do Brasil (953), e Singapura, Alemanha e China completam a lista. Robô continua sendo a maior parte da audiência. Só que agora uma parte maior dele é desafiada antes de chegar.

### E o GA voltou a descolar

Na semana de 17 a 23 de outubro:

| Ferramenta | Número |
|---|---|
| Google Analytics | 12 usuários, **1 segundo** de engajamento médio |
| Cloudflare Web Analytics (sem robôs) | 4 visitas, 6 visualizações |

Três dos 12 "usuários" do GA vinham de **Urumqi, na China**. Nenhum deles aparece no Web Analytics da Cloudflare.

Ou seja: o Bot Fight Mode reduz o volume, mas **não deixa o GA limpo**. Robôs que executam JavaScript, como um navegador de verdade, continuam virando "usuário".

> Barrar na borda diminui o problema. Não elimina a necessidade de comparar duas fontes antes de acreditar num número.

## Experimento 2: link no primeiro comentário

Essa era a hipótese de que eu tinha mais certeza. É um conselho que circula muito: o LinkedIn entrega menos posts com link externo, então coloque o link no primeiro comentário.

Os resultados:

| Post | Onde estava o link | Impressões | Reações |
|---|---|---|---|
| Rate limiting (06/10) | no corpo | 123 | 0 |
| LLM em e-commerce (13/10) | no 1º comentário | 102 | 3 |
| Parte 1 desta série (15/10) | artigo nativo do LinkedIn | 85 | 4 leituras |
| Carrossel do rate limiting (21/10) | no 1º comentário | 48 | 1 |

O post com o link no comentário **não teve mais alcance** do que o com o link no corpo. Com cerca de 100 impressões por post, a diferença é ruído: horário, tema e o gancho do texto pesam muito mais do que o lugar do link.

O custo, por outro lado, foi claro. Todos os links tinham UTM, e na última semana o LinkedIn somou **271 impressões e zero visitas** ao site. Ninguém abre os comentários para procurar um link.

**A hipótese estava errada.** Pelo menos com o tamanho da minha audiência, o link no comentário não trouxe alcance e acabou com os cliques.

O carrossel merece uma nota à parte: foi o pior resultado do período. Mas ele repetia o tema de um post de duas semanas antes, então não dá para culpar só o formato.

## O que eu não estava olhando: os outros canais

Enquanto eu me preocupava com o LinkedIn, os outros canais contavam uma história diferente.

- **dev.to:** **96 leitores** na mesma semana em que o site teve 4 visitas. Quase tudo indo para artigos antigos que aparecem em busca, como Clean Code em PHP e gerenciamento de memória em Node.js. Todos têm o `canonical_url` apontando para o meu site, então o Google sabe qual é o original.
- **TabNews:** um único post gerou **a única visita com origem identificada** da semana no site e uma conversa nos comentários.
- **Google:** o Search Console passou de 14 impressões em 28 dias para **61 impressões em 7 dias**. Ainda com zero cliques e posição média de 16,9, na segunda página, mas as buscas por "ortogonalidade" e "idempotência" já mostram meus artigos.

O canal em que eu mais investia era o que menos levava gente ao site.

## Como foi trabalhar com um agente de IA (de novo)

Assim como na parte 1, fiz a coleta desses números com o Claude Code abrindo os painéis no navegador. Duas situações valem o registro:

- **Ele contou o próprio tráfego como visita.** O pico de requisições desta semana era a verificação de links que ele mesmo tinha rodado minutos antes. Foi ele que percebeu, ao bater o horário do pico com o horário do script, mas é exatamente o tipo de coisa que passa despercebida.
- **Ele travou o painel.** No Web Analytics da Cloudflare, o botão "Imprimir relatório" fica ao lado do seletor de período. Um clique errado abriu a janela de impressão e bloqueou a aba até eu fechar na mão.

A lição continua a mesma da parte 1: **verifique o resultado, não a intenção**. Inclusive quando quem mediu foi você.

## O que muda daqui para frente

1. **O Bot Fight Mode fica ligado.** Ele não resolve tudo, mas o custo é zero e o volume de robôs desafiados é constante.
2. **Os relatórios continuam com duas fontes.** O número de referência para "gente" passa a ser o Web Analytics da Cloudflare, com o GA para o detalhe do comportamento.
3. **O link volta para o corpo do post** no LinkedIn. Vou alternar com o link no comentário, com UTMs diferentes para cada um (`utm_content=corpo` e `utm_content=comentario`), e comparar com dados em vez de conselho.
4. **Os canais que funcionam ganham atenção.** Ajustar título e descrição dos artigos que já aparecem no Google e continuar publicando no TabNews.

## Checklist para quem roda experimentos num site pequeno

- [ ] Antes de dar o crédito para uma mudança, veja **quem** sumiu e **por quê**.
- [ ] Exclua do resultado o tráfego que você mesmo gerou.
- [ ] Compare as ferramentas de novo depois da mudança. Um número que bateu numa semana pode descolar na seguinte.
- [ ] Coloque UTM em todo link que você divulga. Sem isso, tudo vira "Direct".
- [ ] Desconfie de conselhos de algoritmo que você não consegue medir com a sua audiência.
- [ ] Olhe para todos os canais, não só para o que você mais usa.

## Até aqui

O resumo honesto é este: **barrar robôs na borda funcionou, mas pela metade**, e **o link no comentário não funcionou**. Nenhuma das duas coisas é o que eu esperava quando escrevi a parte 1.

Mas é por isso que vale medir. Sem os números, eu estaria até hoje recomendando o link no comentário e dando todo o crédito ao Bot Fight Mode.

E você? Já testou alguma "regra do algoritmo" com os seus próprios números? Vamos conversar nos comentários! 🚀

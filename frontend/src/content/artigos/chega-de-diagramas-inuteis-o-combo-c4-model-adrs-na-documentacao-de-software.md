---
title: "Chega de diagramas inúteis: O combo C4 Model + ADRs na documentação de software"
description: "Você já entrou num projeto onde o único diagrama disponível era um \"emaranhado de caixas e setas\" sem..."
pubDate: 2026-02-12
tags: ["architecture","productivity","softwareengineering","systemdesign"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F36yxbz9zct7zl3g8cbeu.png"
devtoUrl: "https://dev.to/danielcamucatto/chega-de-diagramas-inuteis-o-combo-c4-model-adrs-na-documentacao-de-software-575l"
---

Você já entrou num projeto onde o único diagrama disponível era um "emaranhado de caixas e setas" sem legenda? Ou pior: deparou-se com uma decisão técnica estranha e ninguém no time lembrava o porquê ela foi tomada?

Se já passou por isso, sabe que documentação má-feita custa caro. Mas não precisamos de manuais de 50 páginas. O segredo da agilidade reside em dois pilares: C4 Model (o mapa) e ADRs (o diário).

## 🗺️ 1. C4 Model: O "Google Maps" da sua Arquitetura

O C4 Model resolve o problema dos diagramas ambíguos através de níveis de abstração. O nível mais amado pelos desenvolvedores é o Nível 2 (Containers), que mostra a tecnologia e as responsabilidades.

Exemplo: Sistema de Agendamento (Nível 2)
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/swvl059jn9dzwv441p01.png)

## 📜 2. ADRs (Architecture Decision Records): A Memória do Time

Se o C4 mostra como o sistema é hoje, a ADR explica por que ele chegou lá. É um arquivo Markdown simples no Git que evita que o conhecimento se perca em conversas de corredor.

Exemplo Prático de ADR:

```
# ADR 012: Migração para gRPC na comunicação interna

**Data:** 12/02/2026 | **Status:** Aceito

**1. Contexto:** A latência entre os serviços de 'Checkout' e 'Estoque' via REST/JSON está impactando a performance em picos de acesso.

**2. Decisão:** Adotaremos gRPC com Protocol Buffers para todas as chamadas síncronas entre microserviços.

**3. Consequências:**
- (+) Redução do tamanho do payload e ganho de performance.
- (-) Necessidade de ferramentas específicas (ex: Postman gRPC) para debug manual.

```
Resumo do Histórico de Decisões:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7n6boytc9rgrl7gydozv.png)

## 🧠 3. Por que essa combinação é o "suplemento" ideal?

C4 Model é a Visão Espacial: Garante que o time não se perca na estrutura (Saúde visual).

ADR é a Visão Temporal: Garante que o time não esqueça o "porquê" (Memória técnica).

Juntos, eles permitem o Docs as Code: documentação que vive no Git, é revisada em Pull Requests e realmente agrega valor.

E no seu time?

Como vocês registram as decisões? Ainda confiam apenas na memória ou já usam algum desses padrões? Vamos conversar nos comentários! 👇

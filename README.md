# Deploy test - dom 28 set 2025 00:21:29 -03


## Artigos

Os artigos ficam em `frontend/src/content/artigos/` como Markdown (`.md`) ou MDX (`.mdx`)
e são publicados em `https://danielcamucatto.dev.br/artigos/<nome-do-arquivo>/`.

Frontmatter:

```yaml
---
title: "Título do artigo"
description: "Resumo de uma ou duas frases (aparece na listagem e no preview de links)"
pubDate: 2026-10-04
tags: ["node", "arquitetura"]
cover: "https://..."   # opcional
draft: true            # opcional: aparece só no `npm run dev`
---
```

- Para blocos de código, indique a linguagem (` ```ts `, ` ```php `…) para ter realce de sintaxe.
- `npm run import:devto` (em `frontend/`) traz artigos novos do dev.to; os que já existem não são sobrescritos.
- RSS em `/rss.xml` e sitemap em `/sitemap-index.xml` são gerados no build.

Deploy: veja [DEPLOY.md](DEPLOY.md).

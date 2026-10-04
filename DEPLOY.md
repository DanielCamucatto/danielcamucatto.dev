# Deploy — Cloudflare Pages

O site é estático (Astro) e é publicado no **Cloudflare Pages** pela integração com o GitHub:

- push em `main` → produção em https://danielcamucatto.dev.br
- push em qualquer outra branch / PR → preview em `https://<branch>.<projeto>.pages.dev`

O workflow `.github/workflows/ci.yml` continua rodando lint, testes e build em PRs.

## Configuração do projeto no Cloudflare Pages

Workers & Pages → Create → Pages → *Connect to Git* → repositório `danielcamucatto.dev`:

| Campo | Valor |
| --- | --- |
| Production branch | `main` |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `frontend` |

Variáveis (Settings → Variables and Secrets), em *Production* e *Preview*:

- `PUBLIC_GA_MEASUREMENT_ID` — ID do GA4 (opcional)

A versão do Node vem de `frontend/.nvmrc` (Astro exige Node ≥ 22.12).

## Domínio

1. O domínio `danielcamucatto.dev.br` usa os nameservers da Cloudflare (configurados no registro.br).
2. No projeto do Pages: Custom domains → adicionar `danielcamucatto.dev.br` e `www.danielcamucatto.dev.br`.
   Como a zona está na mesma conta, a Cloudflare cria os registros DNS sozinha.
3. Redirecionar `www` → raiz: Rules → Redirect Rules → *Redirect from WWW to root*.

## Rollback

Pages → Deployments → escolha um deploy anterior → *Rollback to this deployment*.

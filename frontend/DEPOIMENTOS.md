# Depoimentos

Formulário na página inicial, aprovação em `/admin/depoimentos/`. A seção só aparece com
**tudo configurado** e a lista só é publicada a partir de **3 aprovados**.

## Recursos na Cloudflare (projeto Pages `danielcamucatto-dev`)

Configurar em **Production**. O preview não deve usar o banco de produção.

| Item | Nome | Observação |
|---|---|---|
| Banco D1 | binding `DB` | aplicar `migrations/0001_depoimentos.sql` |
| Bucket R2 | binding `FOTOS` | privado, sem acesso público |
| Turnstile | `TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET` | o segredo como variável criptografada |
| Sal do IP | `IP_SALT` | texto aleatório longo, criptografado |
| Access | `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, `ADMIN_EMAIL` | aplicativo cobrindo `/admin/*` e `/api/admin/*` |

Depois de mudar bindings ou variáveis, é preciso um novo deploy.

## Segurança

- `/api/admin/*` confere o token do Access na própria função; sem configuração, nega tudo.
- O IP não é gravado, só um hash com sal, usado no limite de 3 envios por hora.
- Recusar um depoimento apaga o registro e a foto.

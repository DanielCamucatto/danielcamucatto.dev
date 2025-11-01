# Configuração do Base Path do Vite

Este projeto usa diferentes `base` paths dependendo do ambiente de deploy:

## Ambientes

### Netlify (branch `homolog`)
- **Base path**: `/` (raiz)
- **Configuração**: Arquivo `netlify.toml` na raiz define `NETLIFY=true` e `VITE_BASE_PATH=/`
- **URL**: https://danielcamucattodev.netlify.app
- Não precisa configurar nada no dashboard — o `netlify.toml` configura automaticamente

### GitHub Pages (branch `main`)
- **Base path**: `/danielcamucatto.dev/` (project page)
- **Configuração**: Definir `VITE_BASE_PATH=/danielcamucatto.dev/` no build
- **URL**: https://danielcamucatto.github.io/danielcamucatto.dev/

### Local Development
- **Base path**: `/` (padrão)
- Rode normalmente: `npm run dev` ou `make dev`

## Como funciona

O `vite.config.ts` detecta automaticamente:

```typescript
base: process.env.NETLIFY === 'true' 
  ? '/' 
  : process.env.VITE_BASE_PATH || '/danielcamucatto.dev/'
```

- Se `NETLIFY=true` (Netlify build): usa `/`
- Se `VITE_BASE_PATH` definido: usa o valor customizado
- Caso contrário: usa `/danielcamucatto.dev/` (GitHub Pages)

## Configurar no GitHub Actions (para main)

No workflow de deploy do GitHub Pages, certifique-se de que o build usa o base correto:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_BASE_PATH: /danielcamucatto.dev/
```

Ou defina diretamente no `package.json`:

```json
{
  "scripts": {
    "build:gh-pages": "VITE_BASE_PATH=/danielcamucatto.dev/ vite build"
  }
}
```

## Verificar paths gerados

Após o build, verifique `dist/index.html`:
- Netlify: deve ter `/assets/index-xxx.js`
- GitHub Pages: deve ter `/danielcamucatto.dev/assets/index-xxx.js`

## Troubleshooting

### Erro 404 em assets no Netlify
- **Causa**: Build não detectou configuração correta
- **Solução**: Arquivo `netlify.toml` na raiz já configura `NETLIFY=true` e `VITE_BASE_PATH=/`
- **Verificação**: Após deploy, inspecione `dist/index.html` — os paths devem ser `/assets/...` (sem prefixo `/danielcamucatto.dev/`)
- **Forçar rebuild**: No dashboard do Netlify → **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

### Erro 404 em assets no GitHub Pages
- Verifique se `VITE_BASE_PATH=/danielcamucatto.dev/` foi definido no build
- Verifique `dist/index.html` — os paths devem ser `/danielcamucatto.dev/assets/...`

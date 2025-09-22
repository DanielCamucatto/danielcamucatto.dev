 # Daniel Camuçatto — Site Pessoal

 Este repositório contém o site pessoal (frontend) baseado em React + TypeScript + Vite, com suporte a temas, internacionalização e deploy via GitHub Pages.

 ## Conteúdo
 - frontend/: aplicação React (Vite + TypeScript)
 - docker/: configs para Docker (nginx etc.)
 - .github/: workflows de CI e deploy

 ## Tecnologias
 - React 18+ / TypeScript
 - Vite
 - Tailwind CSS
 - Jest + Testing Library
 - ESLint + Prettier
 - Docker + Docker Compose
 - GitHub Actions (CI e Deploy para GitHub Pages)

 ## Requisitos locais
 - Node.js (recomendado LTS 18/20)
 - npm (ou pnpm/yarn) — o projeto utiliza npm por padrão
 - Docker (opcional, para ambiente isolado)

 ## Rodando localmente (modo desenvolvimento)

 1) Instale dependências (na raiz, preferível executar dentro de `frontend`):

 ```bash
 cd frontend
 npm install
 ```

 2) Rodar em modo dev (Vite):

 ```bash
 npm run dev
 # abre http://localhost:5173
 ```

 Alternativa via Docker (dev):

 ```bash
 # na raiz do repositório
 docker compose -f docker-compose.dev.yml up --build
 # O container fará npm install e executará o Vite no container
 ```

 Makefile (atalhos):
 - `make dev` — inicia o ambiente de desenvolvimento (via docker-compose)
 - `make stop` — para os containers
 - `make logs-dev` — mostra logs do container dev

 ## Build para produção

 ```bash
 cd frontend
 npm run build
 # os arquivos finais estarão em frontend/dist
 ```

 ## Testes

 - Rodar todos os testes:

 ```bash
 cd frontend
 npm test
 ```

 - Atualizar snapshots:

 ```bash
 npm test -- -u
 ```

 ## Lint e formatação

 ```bash
 cd frontend
 npm run lint
 npm run lint -- --fix
 ```

 ## Deploy

 O projeto usa um workflow GitHub Actions para construir o `frontend` e publicar `frontend/dist` na branch `gh-pages`. O deploy automático acontece quando o workflow é bem-sucedido.

 Observações:
 - É necessário permitir que o GITHUB_TOKEN escreva conteúdo (Settings → Actions → General → Allow write permissions for workflows) ou usar um Personal Access Token (PAT) se preferir.

 ## Desenvolvimento no VS Code (Dev Container)

 Há configurações de Dev Container que permitem abrir o workspace em um container com Node e dependências instaladas. Use o Remote - Containers extension no VS Code.

 ## Recomendações e próximos passos

 - Configurar cache de dependências no CI (actions/cache) para acelarar builds.
 - Configurar Codecov para cobertura de testes e adicionar badges no README.
 - Adicionar testes E2E (Playwright/Cypress) e integrá-los ao CI.

 ## Como contribuir

 1. Crie uma branch a partir de `main`.
 2. Rode lint/test/build localmente.
 3. Abra PR com descrição e checklist (lint, test, build).

 ---
 Arquivo gerado automaticamente. Se quiser que eu inclua instruções mais detalhadas (ex.: variáveis de ambiente, comandos docker específicos ou exemplos de CI), diga o que adicionar.

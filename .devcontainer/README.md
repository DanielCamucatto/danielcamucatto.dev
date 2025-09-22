Abra este projeto no VS Code e use "Remote-Containers: Reopen in Container" (ou Command Palette → Remote-Containers → Reopen in Container).

O devcontainer usa `docker-compose.dev.yml` e conecta ao serviço `frontend`. A extensão Prettier será instalada dentro do container, assim a extensão do VS Code encontrará o binário `prettier` já disponível.

Observação: o container instalará dependências conforme definido em `frontend/Dockerfile.dev` (tem `npm install`).

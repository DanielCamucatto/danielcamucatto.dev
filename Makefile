# ==============================================================================
#  Comandos para o Ambiente de Desenvolvimento
# ==============================================================================

# Inicia os contêineres de desenvolvimento em modo detached (-d)
dev:
	docker compose -f docker-compose.dev.yml up -d

# Para os contêineres de desenvolvimento
stop-dev:
	docker compose -f docker-compose.dev.yml down

# Exibe e acompanha os logs dos contêineres de desenvolvimento
logs-dev:
	docker compose -f docker-compose.dev.yml logs -f

# ==============================================================================
#  Comandos para o Ambiente de Produção
# ==============================================================================

# Constrói as imagens para produção
build-prod:
	docker compose build

# Inicia os contêineres de produção em modo detached (-d)
prod:
	docker compose up -d

# Para os contêineres de produção
stop-prod:
	docker compose down

# Exibe e acompanha os logs dos contêineres de produção
logs-prod:
	docker compose logs -f


# Declara que os targets não são arquivos para evitar conflitos
.PHONY: dev stop-dev logs-dev build-prod prod stop-prod logs-prod

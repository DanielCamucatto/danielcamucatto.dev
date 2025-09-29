# ==============================================================================
#  Ajuda e Informações
# ==============================================================================

# Exibe a lista de comandos disponíveis
help:
	@echo "📦 Comandos disponíveis no Makefile:"
	@echo ""
	@echo "🚀 Desenvolvimento:"
	@echo "  make dev          - Inicia contêineres em modo desenvolvimento"
	@echo "  make build-dev    - Constrói e inicia contêineres de desenvolvimento" 
	@echo "  make stop-dev     - Para os contêineres de desenvolvimento"
	@echo "  make logs-dev     - Exibe logs dos contêineres de desenvolvimento"
	@echo ""
	@echo "🏭 Produção:"
	@echo "  make build-prod   - Constrói imagens para produção"
	@echo "  make prod         - Inicia contêineres de produção"
	@echo "  make stop-prod    - Para os contêineres de produção"
	@echo "  make logs-prod    - Exibe logs dos contêineres de produção"
	@echo ""
	@echo "🧪 Testes:"
	@echo "  make test         - Executa todos os testes"
	@echo "  make test-watch   - Executa testes em modo watch"
	@echo "  make coverage     - Gera relatório de cobertura de testes"
	@echo "  make snapshots    - Atualiza snapshots dos testes"
	@echo ""
	@echo "✨ Qualidade de Código:"
	@echo "  make lint         - Executa ESLint"
	@echo "  make typecheck    - Executa verificação de tipos TypeScript"
	@echo "  make codequality  - Executa lint + typecheck"
	@echo ""  
	@echo "🎯 Pipeline:"
	@echo "  make ci           - Executa toda a pipeline (qualidade + testes)"
	@echo ""
	@echo "❓ Ajuda:"
	@echo "  make help         - Exibe esta ajuda"

# ==============================================================================
#  Comandos para o Ambiente de Desenvolvimento
# ==============================================================================

# Inicia os contêineres de desenvolvimento em modo detached (-d)
dev:
	docker compose -f docker-compose.dev.yml up -d

# Constrói e inicia os contêineres de desenvolvimento
build-dev:
	docker compose -f docker-compose.dev.yml up -d --build

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



# ==============================================================================
#  Code Quality
# ==============================================================================

# Executa ESLint para verificar qualidade do código
lint:
	docker compose -f docker-compose.dev.yml exec frontend npm run lint

# Executa verificação de tipos TypeScript
typecheck:
	docker compose -f docker-compose.dev.yml exec frontend npm run test:typecheck

# Executa todas as verificações de qualidade de código
codequality: lint typecheck
	@echo "✅ Todas as verificações de qualidade passaram!"

# ==============================================================================
#  Testes
# ==============================================================================

# Executa todos os testes
test:
	docker compose -f docker-compose.dev.yml exec frontend npx jest --passWithNoTests

# Gera relatório de cobertura de testes
coverage:
	docker compose -f docker-compose.dev.yml exec frontend npx jest --coverage

# Atualiza snapshots dos testes
snapshots:
	docker compose -f docker-compose.dev.yml exec frontend npx jest --updateSnapshot

# Executa testes em modo watch (desenvolvimento)
test-watch:
	docker compose -f docker-compose.dev.yml exec frontend npx jest --watch

# ==============================================================================
#  Comandos Combinados
# ==============================================================================

# Executa todos os testes de qualidade e testes unitários
ci: codequality test
	@echo "🎉 Pipeline de CI passou com sucesso!"

# Define o target padrão
.DEFAULT_GOAL := help

# Declara que os targets não são arquivos para evitar conflitos
.PHONY: help dev build-dev stop-dev logs-dev build-prod prod stop-prod logs-prod lint typecheck codequality test coverage snapshots test-watch ci

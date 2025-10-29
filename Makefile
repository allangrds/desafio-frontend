.PHONY: up down build run logs restart shell

up:
	@echo "🚀 Subindo container Next.js..."
	docker compose up

up-silent:
	@echo "🚀 Subindo container Next.js..."
	docker compose up -d

down:
	@echo "🧹 Derrubando containers..."
	docker compose down

build:
	@echo "🏗️ Buildando imagem de produção..."
	docker build -t bycoders-frontend-challenge .

run:
	@echo "🚀 Rodando imagem de produção..."
	docker run -p $$(grep ^PORT .env | cut -d '=' -f2):$$(grep ^PORT .env | cut -d '=' -f2) --env-file .env bycoders-frontend-challenge

logs:
	docker compose logs -f

restart:
	docker compose restart

shell:
	docker compose exec web sh
.PHONY: up down build test run logs restart shell

up:
	@echo "🚀 Subindo container Next.js..."
	docker compose up

up-silent:
	@echo "🚀 Subindo container Next.js..."
	docker compose up -d

down:
	@echo "🧹 Derrubando containers..."
	docker compose down

test:
	@echo "🧪 Rodando testes..."
	docker compose exec web npm run test

logs:
	docker compose logs -f

restart:
	docker compose restart

shell:
	docker compose exec web sh

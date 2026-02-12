# Makefile for Wheel Spinner Docker commands
# Provides convenient shortcuts for common Docker operations

.PHONY: help dev prod test build clean down logs shell

# Default target - show help
help:
	@echo "Wheel Spinner - Docker Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development environment (live reload)"
	@echo "  make dev-build    - Rebuild dev container"
	@echo "  make shell        - Open shell in dev container"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Start production environment"
	@echo "  make prod-build   - Rebuild production container"
	@echo ""
	@echo "Testing:"
	@echo "  make test         - Start test environment"
	@echo "  make test-build   - Rebuild test container"
	@echo "  make test-run     - Run tests in container"
	@echo ""
	@echo "General:"
	@echo "  make logs         - View container logs"
	@echo "  make down         - Stop all containers"
	@echo "  make clean        - Stop containers and remove volumes"
	@echo "  make build        - Build all images"

# Development
dev:
	docker-compose --profile dev up

dev-build:
	docker-compose --profile dev up --build

# Production
prod:
	docker-compose --profile prod up -d

prod-build:
	docker-compose --profile prod up --build -d

# Testing
test:
	docker-compose --profile test up -d

test-build:
	docker-compose --profile test up --build -d

test-run:
	docker-compose --profile test run --rm wheel-spinner-test npm test

# Utility commands
shell:
	docker-compose --profile dev exec wheel-spinner-dev sh

logs:
	docker-compose logs -f

down:
	docker-compose --profile dev --profile prod --profile test down

clean:
	docker-compose --profile dev --profile prod --profile test down -v
	docker system prune -f

build:
	docker-compose build --parallel

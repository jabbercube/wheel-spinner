# Makefile for Wheel Spinner
# Uses plain docker commands — no docker compose required.
# Always builds from the local Dockerfile.

IMAGE     = wheel-spinner
CONTAINER = wheel-spinner
VOLUME    = wheel-spinner-data
PORT      = 3000

# Optional runtime overrides (pass on the command line):
#   make run WHEEL_DEFAULT_ENTRIES='["Alice","Bob","Carol"]'
WHEEL_DEFAULT_ENTRIES ?=

.PHONY: help build run stop logs shell clean

help:
	@echo "Wheel Spinner - Docker Commands"
	@echo ""
	@echo "  make build   - Build image from Dockerfile"
	@echo "  make run     - Run container"
	@echo "  make stop    - Stop and remove container"
	@echo "  make logs    - Tail container logs"
	@echo "  make shell   - Open shell in running container"
	@echo "  make clean   - Stop container and delete data volume"

build:
	docker build \
		--target production \
		--build-arg BUILD_ENV=prod \
		-t $(IMAGE) \
		.

run:
	docker run -d \
		--name $(CONTAINER) \
		--restart unless-stopped \
		-p $(PORT):$(PORT) \
		-v $(VOLUME):/app/backend/data \
		-e NODE_ENV=production \
		-e PORT=$(PORT) \
		-e NODE_OPTIONS=--openssl-legacy-provider \
		$(if $(WHEEL_DEFAULT_ENTRIES),-e WHEEL_DEFAULT_ENTRIES='$(WHEEL_DEFAULT_ENTRIES)') \
		$(IMAGE)

stop:
	docker stop $(CONTAINER) && docker rm $(CONTAINER)

logs:
	docker logs -f $(CONTAINER)

shell:
	docker exec -it $(CONTAINER) sh

clean:
	docker stop $(CONTAINER) && docker rm $(CONTAINER)
	docker volume rm $(VOLUME)

include .env
default: run
# Sets variable for common migration Docker command
MIGRATE_CMD = docker run -it --rm --network host --volume $(PWD)/internal/infra/database:/db migrate/migrate
APP_NAME=globo-challenge
VERSION=1.0.0
DOCKER_IMAGE=$(APP_NAME):$(VERSION)

# Access the Air container
air-logs:
	@docker compose logs -f air
.PHONY: air-logs

# Build the Docker image
docker-build:
	@echo "=====> Building Docker image"
	@docker build --no-cache -t $(DOCKER_IMAGE) .
.PHONY: docker-build

# Access the PostgreSQL container
psql:
	@echo "=====> Accessing PostgreSQL container"
	@docker exec -it $(DB_NAME) psql -U $(DB_USER) -d $(DB_NAME)
.PHONY: psql

# Execute the Go server
run:
	@echo "=====> Running Go server"j
	@go run cmd/api/main.go
.PHONY: run

# Add a new migration
migrate:
	@echo "=====> Adding a new migration"
	@if [ -z "$(name)" ]; then echo "Migration name is required"; exit 1; fi
	@$(MIGRATE_CMD) create -ext sql -dir /db/migrations $(name)
.PHONY: migrate

# Apply all pending migrations
migrate-up:
	@echo "=====> Applying all pending migrations"
	@$(MIGRATE_CMD) -path=/db/migrations -database "$(DB_URL)" up
.PHONY: migrate-up

# Revert all applied migrations
migrate-down:
	@echo "=====> Reverting all applied migrations"
	@$(MIGRATE_CMD) -path=/db/migrations -database "$(DB_URL)" down
.PHONY: migrate-down

# Apply the last pending migration
migrate-next:
	@echo "=====> Applying the last pending migration"
	@$(MIGRATE_CMD) -path=/db/migrations -database "$(DB_URL)" up 1
.PHONY: migrate-next

# Revert the last applied migration
migrate-previous:
	@echo "=====> Reverting the last applied migration"
	@$(MIGRATE_CMD) -path=/db/migrations -database "$(DB_URL)" down 1
.PHONY: migrate-previous

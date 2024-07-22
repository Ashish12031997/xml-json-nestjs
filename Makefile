# Variables

# Docker Commands
up:
	docker-compose up --build -d

down:
	docker-compose down

logs:
	docker-compose logs -f


.PHONY: up down logs

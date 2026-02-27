env:
ifeq ($(OS),Windows_NT)
	copp .env-example .env && copy backend\.env-example backend\.env && copy frontend\.env-example frontend\.env
else
	cp .env-example .env && cp backend/.env-example backend/.env && cp frontend/.env-example frontend/.env
endif

seed:
	docker compose --profile init run --rm db-seed

up: seed
	docker compose up --build -d

down:
	docker compose down -v

superuser:
	docker compose exec backend python manage.py createsuperuser


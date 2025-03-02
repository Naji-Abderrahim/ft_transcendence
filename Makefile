all:
	docker compose up

build:
	docker build -t django-base ./django_base/
	docker compose build

clean:
	docker system prune -af

re: clean build all 

# Ujin Hackathon

Структура:
- cabinet - фронтенд панели УК
- display - фронтенд для отображения информации на экране
- ujin-backend - бэкенд для обработки данных и взаимодействия с базой данных

Для запуска проекта необходимо:

Создать в корневой папке файл backend.env и заполнить его по шаблону example.env

И в cabinet и display создать .env файлы по шаблону .env.example в каждом по отдельности

После этого необходимо собрать бэкенд
```bash
cd ujin-backend
./gradlew build -x test
```

Затем запустить docker compose в корне проекта

```bash
docker compose up --build
```

Запустить фронтенды cabinet и display:

```bash
yarn dev -- --host
```

В консоли будут ссылки на фронтенды.
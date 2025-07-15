1.Создать и активировать виртуальное окружение в директории backend:

python -m venv venv

venv\Scripts\activate

2.Установить зависимости:

В директории backend: pip install -r requirements.txt

В директории frontend: npm install

3.Создать базу данный PostreeSQL.

4.Создать .env и запонить данные для базы даных, в соответвии с настройкой БД. Пример нужных данных:

DB_NAME=wb_db

DB_USER=user

DB_PASSWORD=12345

DB_HOST=localhost

DB_PORT=5432

5.Запустить backend и frontend (локально).

В директории backend (на порту 8000): python .\manage.py runserver

В директории frontend: npm start

6.Открыть главную страницу сайта:

http://localhost:3000/

7.Выполнить парсинг с Wildberries, введя нужные данные в соответсвующие поля.

8.Проверить функционал сайта: Сортировки, фильтры, графики



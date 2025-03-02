echo "[my_service]" > /root/.pg_service.conf
echo "host=$DB_HOST" >> /root/.pg_service.conf
echo "user=$DB_USER" >> /root/.pg_service.conf
echo "dbname=$DB_NAME" >> /root/.pg_service.conf
echo "port=5432" >> /root/.pg_service.conf
echo "password=$DB_PASSWORD" >> /root/.pg_service.conf
./manage.py makemigrations mainApp
./manage.py migrate mainApp
./manage.py runserver 0.0.0.0:8001

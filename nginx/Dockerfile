FROM alpine:3.17


WORKDIR /src
COPY ./tools/script.sh .
COPY ./configs/config.conf /etc/nginx/http.d/default.conf


RUN apk update
RUN apk add nginx vim bash openssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/certs/server.key -out /etc/ssl/certs/server.cert -subj "/CN=darify.com"

ENTRYPOINT ["bash", "./script.sh"]

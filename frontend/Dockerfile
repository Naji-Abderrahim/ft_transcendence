FROM alpine:3.17

RUN apk update
RUN apk add nginx vim bash
RUN mkdir -p /var/www/app

WORKDIR /var/www/app

COPY . .
COPY ./conf/nginx.conf /etc/nginx/http.d/default.conf


RUN chown -R nginx:nginx /var/www/app && chmod -R 755 /var/www/app

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

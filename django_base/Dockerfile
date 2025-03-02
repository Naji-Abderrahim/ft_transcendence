FROM alpine:3.17.10

WORKDIR /src
COPY ./requirement.txt /src

RUN apk update
RUN apk add python3 py3-pip
RUN apk add py3-pillow py3-psycopg2 py3-qrcode tzdata vim bash
RUN pip install -r ./requirement.txt

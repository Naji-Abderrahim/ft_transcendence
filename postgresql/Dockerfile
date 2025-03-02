FROM alpine:3.17

RUN apk update 
RUN apk add postgresql14 vim bash

RUN mkdir -p /run/postgresql
RUN chown postgres:postgres /run/postgresql

RUN su postgres -c "initdb -D /var/lib/postgresql/14/data"
 
RUN chmod 700 /var/lib/postgresql/14/data
RUN chown -R postgres:postgres /var/lib/postgresql/14/data

WORKDIR /src
COPY ./tools/script.sh .

ENTRYPOINT exec ./script.sh

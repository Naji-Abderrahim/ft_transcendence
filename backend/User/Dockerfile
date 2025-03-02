FROM django-base

WORKDIR /src
COPY ./requirement.txt /src

COPY ./source_code/ .
COPY ./tools/script.sh ./tools/script.sh

ENTRYPOINT exec ./tools/script.sh

FROM mhart/alpine-node:5.9.0

RUN apk add --update git
RUN apk add --update bash

RUN mkdir -p /app
WORKDIR /app

COPY ./container /app
COPY ./public /app/public

RUN mkdir /app/logs
RUN chmod -R 0755 /app

EXPOSE 3000

CMD npm start
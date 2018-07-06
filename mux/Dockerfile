FROM node:8-alpine

ENV APP /usr/src/app
WORKDIR $APP

# Ensure both package.json AND package-lock.json are copied if applicable (npm@5+)
COPY package*.json index.js $APP/

COPY ./lib $APP/lib

RUN npm install
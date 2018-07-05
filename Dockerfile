FROM node:8-alpine
ADD ./ ./
RUN npm install
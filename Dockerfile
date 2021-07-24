FROM node:12
WORKDIR /usr/src/clean-api
COPY ./package.json .
RUN npm i --only=prod
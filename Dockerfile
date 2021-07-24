FROM node:12
WORKDIR /usr/src/clean-api
COPY ./package.json .
RUN npm i --only=prod
COPY ./dist ./dist
EXPOSE 5000
CMD npm start
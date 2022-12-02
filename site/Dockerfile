FROM node:14-alpine

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]
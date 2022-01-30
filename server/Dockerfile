FROM node:16

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .
COPY .env.production .env

ENV NODE_ENV production
EXPOSE 8080

CMD ["yarn", "start"]
USER node

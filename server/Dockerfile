FROM node:16

WORKDIR /opt/server

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

COPY . .

CMD ["yarn", "start"]

FROM node:16
RUN yarn global add serve
WORKDIR /opt/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build
CMD ["yarn", "start"]

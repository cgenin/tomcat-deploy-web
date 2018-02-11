FROM node:carbon

VOLUME /db
VOLUME /logs

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm run build

COPY . .

EXPOSE 8080

ENV NODE_ENV production

CMD [ "node", "server/bin/www" ]

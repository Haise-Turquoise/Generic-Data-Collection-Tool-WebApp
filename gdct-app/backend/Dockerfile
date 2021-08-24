FROM node:14.10.1-alpine

WORKDIR /app

COPY package.json .

RUN apk --no-cache --virtual build-dependencies add python && npm install && npm cache clean --force

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]

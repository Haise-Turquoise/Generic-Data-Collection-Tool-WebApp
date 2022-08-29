FROM node:14.10.1-alpine


WORKDIR /app

COPY package.json .

RUN apk --no-cache --virtual build-dependencies add \
  python \
  make \
  g++ \ 
  && npm install && apk del build-dependencies && npm cache clean --force

COPY . .

EXPOSE 8181

CMD [ "npm", "start" ]

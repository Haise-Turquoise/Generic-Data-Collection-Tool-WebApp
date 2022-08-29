FROM node:14.10.1

WORKDIR /app

COPY package.json .

ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN npm install --no-optional && npm cache clean --force

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]

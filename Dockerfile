FROM node:16.14.0-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build:web

EXPOSE 80

CMD ["npm","run","serve:prod"]
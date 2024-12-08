FROM node:18.18.0-alpine
# See: https://docs.expo.dev/build-reference/infrastructure/

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build:web

EXPOSE 80

CMD ["npm","run","serve:prod"]
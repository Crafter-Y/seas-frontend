FROM node:18.18.0-alpine AS base
# See: https://docs.expo.dev/build-reference/infrastructure/

FROM base AS builder

WORKDIR /app

COPY package*.json .

# npm ci does not work because something is wrong with the lockfile
RUN npm install

COPY . .

RUN npm run build:web

# TODO: this part can be rewritten to nginx to just serve the files
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

RUN npm install serve-handler

COPY --from=builder --chown=nodejs:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=nodejs:nodejs /app/dist /app/dist
COPY --from=builder --chown=nodejs:nodejs /app/serve.js /app/serve.js

USER nodejs
EXPOSE 80

CMD ["npm","run","serve:prod"]
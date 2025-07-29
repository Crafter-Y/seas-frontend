FROM node:20.19.2-alpine AS base
# See: https://docs.expo.dev/build-reference/infrastructure/

FROM base AS builder

WORKDIR /app

COPY package*.json .
COPY .npmrc .

# npm ci does not work because something is wrong with the lockfile
RUN npm install

COPY . .

RUN npm run build:web

# TODO: this part can be rewritten to nginx to just serve the files and rewrite config.json
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

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["npm","run","serve:prod"]
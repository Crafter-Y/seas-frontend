# Stage 1: static web export
FROM node:24.22.0-alpine AS builder
WORKDIR /app

COPY package*.json .npmrc ./

RUN npm ci

COPY . .

# API and web domain the build talks to (staging overrides them; see app.config.js).
ARG SEAS_API_URL
ARG SEAS_WEB_DOMAIN
ENV SEAS_API_URL=$SEAS_API_URL SEAS_WEB_DOMAIN=$SEAS_WEB_DOMAIN

RUN npm run build:web && rm -f dist/config.json

# Stage 2: serve with nginx (the tenant's /config.json is generated from the host name)
FROM nginx:1.31.7-alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=5s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -q -T 2 -O /dev/null http://127.0.0.1:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]

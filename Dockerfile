# Статический сайт курсов: сборка Vite и раздача через nginx (без API — аккаунты и синхронизация не работают)
FROM node:22-alpine AS build
WORKDIR /app/web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
COPY deploy/nginx/security-headers.conf /app/deploy/nginx/security-headers.conf
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/web/dist /usr/share/nginx/html
EXPOSE 80

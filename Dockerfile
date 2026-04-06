# Build from dfsfront/: docker build -t discussion-forum-ui .
# Set VITE_API_URL only if the UI is served without /api reverse proxy (e.g. CDN + separate API host).
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Relative /api works when nginx proxies to the API container (see nginx.conf).
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

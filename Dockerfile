#build angular
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

#nginx
FROM nginxinc/nginx-unprivileged:alpine3.21 AS runner

USER nginx

COPY nginx.conf /etc/nginx/nginx.conf

COPY --chown=nginx:nginx --from=builder /app/dist/*/browser /usr/share/nginx/html

EXPOSE 8099

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
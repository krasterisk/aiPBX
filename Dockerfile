# ============================================
# Stage 1: Build
# ============================================
FROM node:22-slim AS builder
WORKDIR /app
# Кэширование зависимостей
COPY package.json package-lock.json ./
RUN npm install --ignore-scripts
# Копируем исходный код
COPY . .
# Build arguments (передаются через docker-compose)
ARG API_URL=https://aipbx.net/api
ARG STATIC_URL=https://aipbx.net/static
ARG PORT=7003
ARG TG_BOT_ID=8298793342
ARG STRIPE_PUBLISHABLE_KEY=
# Production build
RUN npm run build:prod -- \
  --env apiUrl=${API_URL} \
  --env staticUrl=${STATIC_URL} \
  --env port=${PORT} \
  --env tgBotId=${TG_BOT_ID} \
  --env stripePublishableKey=${STRIPE_PUBLISHABLE_KEY}

# ============================================
# Stage 2: Production (Nginx для отдачи статики)
# ============================================
FROM nginx:1.27-alpine AS production
# Удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf
# Копируем наш конфиг
COPY nginx/frontend.conf /etc/nginx/conf.d/default.conf
# Копируем билд из стадии builder
COPY --from=builder /app/build /usr/share/nginx/html
# Security: запуск nginx от non-root пользователя
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html
EXPOSE 80
# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
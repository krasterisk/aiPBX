# ============================================
# Stage 1: Build (Webpack + SEO prerender)
# ============================================
# Use official Puppeteer image: Node + Google Chrome + libs already baked in.
# Avoids apt→deb.debian.org during build (DNS often broken in Docker bridge on VPS)
# and avoids BuildKit network.host (not allowed on this host).
FROM ghcr.io/puppeteer/puppeteer:21.11.0 AS builder

USER root
WORKDIR /app

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Кэширование зависимостей (Chrome already in base image)
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps --ignore-scripts --prefer-offline

# Копируем исходный код
COPY . .

# Build arguments (передаются через docker-compose / [deploy:1] EU)
ARG API_URL=https://aipbx.net/api
ARG STATIC_URL=https://aipbx.net/static
ARG PORT=7003
ARG TG_BOT_ID=8298793342
# Public OAuth client ID (embedded in the JS bundle; override via compose if needed)
ARG GOOGLE_CLIENT_ID=833962533381-ehqsn7soc4s9e82cv9ats589787ihrog.apps.googleusercontent.com
ARG STRIPE_PUBLISHABLE_KEY=
ARG SITE_URL=https://aipbx.net
ARG GA4_MEASUREMENT_ID=
ARG GOOGLE_ADS_ID=
ARG ADS_SIGNUP_LABEL=

# webpack.config.ts reads these via process.env → DefinePlugin
ENV SITE_URL=${SITE_URL} \
    GA4_MEASUREMENT_ID=${GA4_MEASUREMENT_ID} \
    GOOGLE_ADS_ID=${GOOGLE_ADS_ID} \
    ADS_SIGNUP_LABEL=${ADS_SIGNUP_LABEL} \
    GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID} \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Production build (+ postbuild:prod runs verify-prerender)
RUN npm run build:prod -- \
  --env apiUrl=${API_URL} \
  --env staticUrl=${STATIC_URL} \
  --env port=${PORT} \
  --env tgBotId=${TG_BOT_ID} \
  --env googleClientId=${GOOGLE_CLIENT_ID} \
  --env stripePublishableKey=${STRIPE_PUBLISHABLE_KEY}

# Fail-closed SEO gate (explicit; also covered by npm postbuild:prod)
RUN node scripts/verify-prerender.js

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

---
description: Production deployment plan for aiPBX (Frontend + Backend + Database)
---

# 🚀 Deployment Plan — aiPBX

## Обзор архитектуры

```
                    ┌─────────────┐
        Internet ──►│  Cloudflare  │  (DNS + CDN + WAF + DDoS protection)
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    Nginx    │  :80 / :443 (SSL termination)
                    │  (reverse   │
                    │   proxy)    │
                    └──┬──────┬──┘
                       │      │
            ┌──────────▼┐  ┌──▼──────────┐
            │ Frontend  │  │  Backend    │
            │  (static  │  │  NestJS     │
            │  build)   │  │  :5005      │
            │           │  │  + WS :3033 │
            └───────────┘  │  + UDP:3032 │
                           └──────┬──────┘
                                  │
                           ┌──────▼──────┐
                           │ PostgreSQL  │
                           │   :5432     │
                           └─────────────┘
```

---

## Фаза 0 — Подготовка инфраструктуры

### 0.1 Выбор хостинга
- **Рекомендация**: VPS/VDS (Hetzner, DigitalOcean, Selectel, Timeweb Cloud)
- **Минимальные требования**: 2 vCPU, 4 GB RAM, 40 GB SSD
- **ОС**: Ubuntu 22.04 LTS / Debian 12

### 0.2 Установка базовых пакетов на сервер
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker и Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка docker-compose plugin (v2)
sudo apt install docker-compose-plugin -y

# Проверка
docker --version
docker compose version
```

### 0.3 Настройка файрвола (UFW)
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 0.4 Настройка SSH
```bash
# Отключить вход по паролю (только ключи)
sudo nano /etc/ssh/sshd_config
# PasswordAuthentication no
# PermitRootLogin no
sudo systemctl restart sshd
```

---

## Фаза 1 — Конфигурация окружений

### 1.1 Структура переменных окружения

Создать файл `.env.production` в корне проекта (**НЕ коммитить в git!**):

```env
# === General ===
NODE_ENV=production
TZ=UTC

# === Frontend Build Args ===
FRONTEND_API_URL=https://aipbx.net/api
FRONTEND_STATIC_URL=https://aipbx.net/static
FRONTEND_PORT=7003
FRONTEND_TG_BOT_ID=8298793342
FRONTEND_STRIPE_KEY=pk_live_...

# === Backend ===
PORT=5005
UDP_SERVER_PORT=3032
EXTERNAL_HOST=<SERVER_IP>:3032
PRIVATE_KEY=<generated-strong-jwt-secret>
TIMEZONE=Asia/Krasnoyarsk
API_URL=https://aipbx.net
CLIENT_URL=https://aipbx.net

# === Database ===
DB_DIALECT=postgres
DB_HOST=postgres
DB_PORT=5432
DB_USER=aipbx_user
DB_PASS=<generated-strong-password>
DB_NAME=aipbx_production

# === OpenAI / LLM ===
OPENAI_API_KEY=sk-proj-...
OPENAI_API_URL=wss://api.openai.com/v1/realtime
DEEPSEEK_API_KEY=sk-...
QWEN_API_KEY=sk-...
QWEN_API_URL=wss://dashscope-intl.aliyuncs.com/api-ws/v1/realtime

# === External Services ===
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=833962533381-...
COMPOSIO_API_KEY=ak_...
ENCRYPTION_KEY=<64-hex-chars>
CURRENCY_UPDATE_URL=https://openexchangerates.org/api/latest.json?app_id=...

# === Email ===
MAIL_HOST=smtp.migadu.com
MAIL_USER=noreply@aipbx.net
MAIL_PASS=<mail-password>

# === Telegram ===
TELEGRAM_BOT_TOKEN=<bot-token>
TELEGRAM_ADMIN_CHATID=<chat-id>
AIPBX_BOTNAME=aiPBXBot
```

### 1.2 Обновить `.gitignore`
```
.env.production
.env.staging
.env.local
```

---

## Фаза 2 — Docker: Multi-stage Builds

### 2.1 Frontend — `Dockerfile.frontend`

Заменить текущий `Dockerfile` на multi-stage build.

> **Phase 09 SEO:** live `aiPBX/Dockerfile` installs apt `chromium`, sets
> `PUPPETEER_EXECUTABLE_PATH`, and accepts build ARGs `SITE_URL` (default
> `https://aipbx.net`), `GA4_MEASUREMENT_ID`, `GOOGLE_ADS_ID`, `ADS_SIGNUP_LABEL`.
> After `npm run build:prod` it runs `node scripts/verify-prerender.js` (fail-closed).

```dockerfile
# ============================================
# Stage 1: Build
# ============================================
FROM node:22-slim AS builder

WORKDIR /app

# Кэширование зависимостей
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Копируем исходный код
COPY . .

# Build arguments (передаются через docker-compose)
ARG API_URL=https://aipbx.net/api
ARG STATIC_URL=https://aipbx.net/static
ARG WS_URL=wss://aipbx.krasterisk.ru
ARG PORT=7003
ARG TG_BOT_ID=8298793342
ARG GOOGLE_CLIENT_ID=833962533381-ehqsn7soc4s9e82cv9ats589787ihrog.apps.googleusercontent.com
ARG STRIPE_PUBLISHABLE_KEY
ARG SITE_URL=https://aipbx.net
ARG GA4_MEASUREMENT_ID
ARG GOOGLE_ADS_ID
ARG ADS_SIGNUP_LABEL

# Production build
RUN npm run build:prod -- \
  --env apiUrl=${API_URL} \
  --env staticUrl=${STATIC_URL} \
  --env wsUrl=${WS_URL} \
  --env port=${PORT} \
  --env tgBotId=${TG_BOT_ID} \
  --env googleClientId=${GOOGLE_CLIENT_ID} \
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
```

### 2.2 Backend — `Dockerfile` (aiPBX_backend)

Адаптированный Dockerfile для реального проекта `aiPBX_backend` (NestJS + Sequelize + MySQL).

> **Отличия от текущего Dockerfile**: `npm ci` вместо `npm install`, убран PM2 (Docker сам перезапускает контейнер), non-root пользователь, healthcheck, env через docker-compose вместо `COPY .production.env`.

```dockerfile
# ============================================
# Stage 1: Build
# ============================================
FROM node:22-slim AS builder

WORKDIR /app

# Для native-зависимостей (sharp, bcryptjs и т.д.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:22-slim AS production

WORKDIR /app

# Для sharp в рантайме
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev && \
    rm -rf /var/lib/apt/lists/*

# Production-зависимости
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Копируем билд и статику
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/static ./static 2>/dev/null || true
COPY --from=builder /app/public ./public 2>/dev/null || true

# Переменные окружения передаются через docker-compose (env_file),
# НЕ копируем .production.env в образ!
ENV NODE_ENV=production

# Non-root пользователь (node уже есть в образе node:22-slim)
USER node

# API:5005, UDP:3032 (Asterisk), WS:3033 (Socket.IO)
EXPOSE 5005 3032/udp 3033

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5005/api', (r) => { process.exit(r.statusCode < 500 ? 0 : 1) }).on('error', () => process.exit(1))"

CMD ["node", "dist/main.js"]
```

---

## Фаза 3 — Nginx Reverse Proxy

### 3.1 `nginx/frontend.conf` (внутри контейнера фронтенда)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml application/xml+rss text/javascript
               image/svg+xml;

    # Кэширование статических ресурсов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### 3.2 `nginx/reverse-proxy.conf` (основной Nginx на хосте)

```nginx
# HTTP → HTTPS redirect
server {
    listen 80;
    server_name aipbx.net www.aipbx.net;
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name aipbx.net www.aipbx.net;

    # SSL сертификаты (Let's Encrypt / Certbot)
    ssl_certificate     /etc/letsencrypt/live/aipbx.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aipbx.net/privkey.pem;

    # SSL оптимизация
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://telegram.org https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' wss: https://api.stripe.com https://accounts.google.com https://oauth.telegram.org; frame-src https://accounts.google.com https://oauth.telegram.org https://js.stripe.com;" always;

    # ─── Frontend (SPA) ───
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ─── Backend API ───
    location /api/ {
        proxy_pass http://backend:5005;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Request limits
        client_max_body_size 50M;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 120s;
    }

    # ─── Static files ───
    location /static/ {
        proxy_pass http://backend:5005;
        proxy_set_header Host $host;
        expires 7d;
        add_header Cache-Control "public";
    }

    # ─── WebSocket ───
    location /ws/ {
        proxy_pass http://backend:3033;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400;
    }

    # ─── Socket.IO ───
    location /socket.io/ {
        proxy_pass http://backend:3033;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }
}
```

---

## Фаза 4 — Docker Compose (Production)

### 4.1 `docker-compose.production.yml`

```yaml
services:
  # ─── PostgreSQL ──────────────────────
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups/postgres:/backups
    networks:
      - app-internal
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: "1.0"
    # Порт НЕ экспонируем наружу — только внутренняя сеть

  # ─── Backend (NestJS) ───────────────
  backend:
    build:
      context: ./aiPBX_backend
      dockerfile: Dockerfile
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    env_file:
      - .env.production
    environment:
      NODE_ENV: production
      DB_HOST: postgres  # override: указываем на контейнер
    ports:
      - "3032:3032/udp"  # Asterisk UDP — напрямую, без Cloudflare
      # 3033 НЕ экспонируем — WS трафик идёт через Nginx:443 (Cloudflare)
    networks:
      - app-internal
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: "2.0"

  # ─── Frontend (React + Webpack) ─────
  frontend:
    build:
      context: ./aiPBX
      dockerfile: Dockerfile
      args:
        API_URL: ${FRONTEND_API_URL}
        STATIC_URL: ${FRONTEND_STATIC_URL}
        PORT: ${FRONTEND_PORT}
        TG_BOT_ID: ${FRONTEND_TG_BOT_ID}
        GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
        STRIPE_PUBLISHABLE_KEY: ${FRONTEND_STRIPE_KEY}
        # SEO prerender + gtag (webpack DefinePlugin via process.env)
        SITE_URL: ${SITE_URL:-https://aipbx.net}
        GA4_MEASUREMENT_ID: ${GA4_MEASUREMENT_ID}
        GOOGLE_ADS_ID: ${GOOGLE_ADS_ID}
        ADS_SIGNUP_LABEL: ${ADS_SIGNUP_LABEL}
    restart: unless-stopped
    networks:
      - app-internal
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: "0.5"

  # ─── Nginx Reverse Proxy ────────────
  nginx:
    image: nginx:1.27-alpine
    restart: unless-stopped
    depends_on:
      - frontend
      - backend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/reverse-proxy.conf:/etc/nginx/conf.d/default.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    networks:
      - app-internal
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3

  # ─── Certbot (Let's Encrypt) ────────
  certbot:
    image: certbot/certbot:latest
    depends_on:
      - nginx
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  postgres_data:
    driver: local

networks:
  app-internal:
    driver: bridge
    internal: false
```

---

## Фаза 5 — База данных: Бэкапы и миграции

> ⚠️ **Миграция с MySQL на PostgreSQL**: Текущий бэкенд использует `mysql2` драйвер в Sequelize.
> Для PostgreSQL необходимо:
> 1. `npm install pg pg-hstore` + `npm uninstall mysql2` в бэкенде
> 2. Изменить `dialect: 'mysql'` → `dialect: 'postgres'` в конфиге Sequelize
> 3. Адаптировать переменные окружения (`MYSQL_*` → `POSTGRES_*`)
> 4. Мигрировать данные из старой MySQL БД

### 5.1 Автоматический бэкап БД (PostgreSQL / MySQL)

Создать `scripts/backup-db.sh`:

```bash
#!/bin/bash
set -euo pipefail

# Загрузить переменные
source /app/aipbx/.env.production

# Конфигурация
BACKUP_DIR="/app/aipbx/backups/${DB_DIALECT}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/aipbx_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

mkdir -p ${BACKUP_DIR}

# Дамп базы в зависимости от диалекта
if [ "${DB_DIALECT}" = "postgres" ]; then
  docker compose -f /app/aipbx/docker-compose.production.yml exec -T postgres \
    pg_dump -U ${DB_USER} -d ${DB_NAME} --format=custom \
    | gzip > ${BACKUP_FILE}
elif [ "${DB_DIALECT}" = "mysql" ]; then
  docker compose -f /app/aipbx/docker-compose.production.yml exec -T mysql \
    mysqldump -u${DB_USER} -p${DB_PASS} ${DB_NAME} \
    --single-transaction --routines --triggers \
    | gzip > ${BACKUP_FILE}
else
  echo "[$(date)] ERROR: Unknown DB_DIALECT: ${DB_DIALECT}"
  exit 1
fi

# Проверка размера
FILESIZE=$(stat -c%s "${BACKUP_FILE}")
echo "[$(date)] Backup created: ${BACKUP_FILE} (${FILESIZE} bytes)"

# Удаление старых бэкапов
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete
echo "[$(date)] Old backups cleaned (retention: ${RETENTION_DAYS} days)"
```

### 5.2 Cron для автоматических бэкапов

```bash
# Добавить в crontab (crontab -e)
# Бэкап каждый день в 3:00 AM UTC
0 3 * * * /app/aipbx/scripts/backup-db.sh >> /var/log/db-backup.log 2>&1
```

### 5.3 Восстановление из бэкапа

```bash
# PostgreSQL:
gunzip < backups/postgres/aipbx_YYYYMMDD_HHMMSS.sql.gz | \
  docker compose -f docker-compose.production.yml exec -T postgres \
  pg_restore -U ${DB_USER} -d ${DB_NAME} --clean --if-exists

# MySQL:
gunzip < backups/mysql/aipbx_YYYYMMDD_HHMMSS.sql.gz | \
  docker compose -f docker-compose.production.yml exec -T mysql \
  mysql -u${DB_USER} -p${DB_PASS} ${DB_NAME}
```

---

## Фаза 6 — CI/CD Pipeline (GitHub Actions)

> Деплой на **3 сервера** с разными доменами и env-параметрами.
> Каждый сервер использует отдельный **GitHub Environment** со своими секретами.

### 6.0 Настройка GitHub Environments

В репозитории: **Settings → Environments** → создать 3 окружения:

| Environment | Домен | Описание |
|------------|-------|----------|
| `production-1` | `aipbx.net` | Основной сервер |
| `production-2` | `aipbx.org` | Второй сервер |
| `production-3` | `aipbx.ru` | Третий сервер |

В **каждом** Environment задать свои секреты:

```
SERVER_HOST          — IP сервера
SERVER_USER          — SSH пользователь
SSH_PRIVATE_KEY      — SSH ключ
FRONTEND_API_URL     — https://aipbx.net/api (для каждого домена своё)
FRONTEND_STATIC_URL  — https://aipbx.net/static
FRONTEND_STRIPE_KEY  — pk_live_... (может отличаться)
TG_BOT_ID            — ID бота
```

### 6.1 `.github/workflows/deploy.yml`

```yaml
name: 🚀 Deploy to Production

on:
  push:
    branches: [main]
    paths-ignore:
      - "*.md"
      - ".docs/**"
      - ".loki/**"

  # Ручной запуск с выбором сервера
  workflow_dispatch:
    inputs:
      target:
        description: "Deploy target"
        required: true
        default: "all"
        type: choice
        options:
          - all
          - production-1
          - production-2
          - production-3

env:
  REGISTRY: ghcr.io
  IMAGE_PREFIX: ${{ github.repository }}

jobs:
  # ─── Step 1: Lint & Test ─────────────
  quality:
    name: 🔍 Quality Checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"
      - run: npm ci
      - run: npm run lint:ts
      - run: npm run lint:scss
      - run: npm run test:unit -- --ci --coverage

  # ─── Step 2: Build & Push per-server Frontend Images ─
  build:
    name: 🏗️ Build (${{ matrix.server }})
    needs: quality
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    # Выбираем серверы для деплоя
    if: >
      github.event_name == 'push' ||
      github.event.inputs.target == 'all' ||
      github.event.inputs.target == matrix.server
    strategy:
      matrix:
        server: [production-1, production-2, production-3]
    environment: ${{ matrix.server }}
    steps:
      - uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build & Push Frontend
        uses: docker/build-push-action@v5
        with:
          context: .
          file: Dockerfile
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}/frontend-${{ matrix.server }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}/frontend-${{ matrix.server }}:${{ github.sha }}
          build-args: |
            API_URL=${{ secrets.FRONTEND_API_URL }}
            STATIC_URL=${{ secrets.FRONTEND_STATIC_URL }}
            PORT=7003
            TG_BOT_ID=${{ secrets.TG_BOT_ID }}
            GOOGLE_CLIENT_ID=${{ secrets.GOOGLE_CLIENT_ID }}
            STRIPE_PUBLISHABLE_KEY=${{ secrets.FRONTEND_STRIPE_KEY }}
          cache-from: type=gha,scope=${{ matrix.server }}
          cache-to: type=gha,scope=${{ matrix.server }},mode=max

  # ─── Step 3: Deploy to all servers ───
  deploy:
    name: 🚀 Deploy (${{ matrix.server }})
    needs: build
    runs-on: ubuntu-latest
    if: >
      github.event_name == 'push' ||
      github.event.inputs.target == 'all' ||
      github.event.inputs.target == matrix.server
    strategy:
      matrix:
        server: [production-1, production-2, production-3]
      fail-fast: false  # Не останавливать остальные при ошибке на одном
    environment: ${{ matrix.server }}
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app/aipbx

            # Pull latest images
            docker compose -f docker-compose.production.yml pull

            # Rolling update (zero-downtime)
            docker compose -f docker-compose.production.yml up -d \
              --remove-orphans \
              --force-recreate frontend backend

            # Wait for health checks
            sleep 10

            # Verify deployment
            curl -sf http://localhost/api/health || exit 1

            # Cleanup old images
            docker image prune -f

            echo "✅ Deployment to ${{ matrix.server }} successful!"

      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: "❌ Deploy to ${{ matrix.server }} failed!"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

> **Почему отдельный образ для каждого сервера?**
> `API_URL` вкомпилирован в JS-бандл при сборке, поэтому для `aipbx.net` и `aipbx.com`
> нужны разные Docker-образы фронтенда. Бэкенд одинаковый — он получает
> конфигурацию из `.env.production` на каждом сервере.

---

## Фаза 7 — Мониторинг и логирование

### 7.1 Простой мониторинг (рекомендуется для начала)

Добавить в `docker-compose.production.yml`:

```yaml
  # ─── Watchtower (auto-update images) ──
  watchtower:
    image: containrrr/watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      WATCHTOWER_CLEANUP: "true"
      WATCHTOWER_POLL_INTERVAL: 300  # check every 5 min
      WATCHTOWER_LABEL_ENABLE: "true"
    networks:
      - app-internal
```

### 7.2 Логирование через Docker

```yaml
# Добавить в каждый сервис:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "5"
        tag: "{{.Name}}"
```

### 7.3 Продвинутый мониторинг (Фаза 2)

Для полноценного мониторинга рекомендуется Grafana + Prometheus стек:

```yaml
  # ─── Prometheus ─────────────────────
  prometheus:
    image: prom/prometheus:latest
    restart: unless-stopped
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - app-internal
    ports:
      - "9090:9090"  # только для internal

  # ─── Grafana ────────────────────────
  grafana:
    image: grafana/grafana:latest
    restart: unless-stopped
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - app-internal
    ports:
      - "3000:3000"  # только для internal

  # ─── Node Exporter ─────────────────
  node-exporter:
    image: prom/node-exporter:latest
    restart: unless-stopped
    networks:
      - app-internal

  # ─── Postgres Exporter ─────────────
  postgres-exporter:
    image: prometheuscommunity/postgres-exporter:latest
    restart: unless-stopped
    environment:
      DATA_SOURCE_NAME: "postgresql://${DB_USER}:${DB_PASS}@postgres:5432/${DB_NAME}?sslmode=disable"
    networks:
      - app-internal
```

---

## Фаза 8 — SSL сертификаты (Let's Encrypt)

### 8.1 Первоначальное получение сертификата

```bash
# 1. Сначала запустить nginx без SSL
docker compose -f docker-compose.production.yml up -d nginx

# 2. Получить сертификат
docker compose -f docker-compose.production.yml run --rm certbot \
  certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email admin@aipbx.net \
  --agree-tos \
  --no-eff-email \
  -d aipbx.net \
  -d www.aipbx.net

# 3. Перезапустить nginx с SSL конфигом
docker compose -f docker-compose.production.yml restart nginx
```

### 8.2 Автоматическое обновление
Certbot контейнер уже настроен на автообновление каждые 12 часов (см. Фазу 4).

---

## Фаза 9 — Безопасность (Hardening)

### 9.1 Чеклист безопасности

- [ ] **Secrets**: Все секреты в `.env.production` или GitHub Secrets, НЕ в коде
- [ ] **SSH**: Только аутентификация по ключам, root-логин отключён
- [ ] **Firewall**: Открыты только порты 80, 443, SSH
- [ ] **PostgreSQL**: НЕ экспонирован наружу, доступен только из внутренней сети Docker
- [ ] **Docker**: Non-root пользователи в контейнерах
- [ ] **HTTPS**: Все соединения через SSL/TLS
- [ ] **Headers**: Security headers настроены в Nginx
- [ ] **CORS**: Настроен на бэкенде (только разрешённые домены)
- [ ] **Rate Limiting**: Настроен в Nginx или на уровне приложения
- [ ] **Updates**: Регулярные обновления ОС и Docker images
- [ ] **Backups**: Автоматические бэкапы БД с ротацией

### 9.2 Rate Limiting в Nginx

```nginx
# Добавить в начало nginx конфига (http блок)
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=3r/m;

# В location /api/:
location /api/ {
    limit_req zone=api burst=20 nodelay;
    # ...
}

# В location /api/auth/:
location /api/auth/login {
    limit_req zone=login burst=5;
    # ...
}
```

---

## Фаза 10 — Команды управления

### 10.1 Деплой (первый раз)

```bash
# 1. Клонировать репозиторий
git clone git@github.com:krasterisk/aiPBX.git /app/aipbx
cd /app/aipbx

# 2. Создать .env.production
cp .env.example .env.production
nano .env.production  # заполнить все значения

# 3. Создать директории
mkdir -p nginx certbot/conf certbot/www backups/postgres

# 4. Скопировать nginx конфиг
cp nginx/reverse-proxy.conf nginx/

# 5. Запуск
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build

# 6. Проверка
docker compose -f docker-compose.production.yml ps
docker compose -f docker-compose.production.yml logs -f
```

### 10.2 Обновление (routine deploy)

```bash
cd /app/aipbx
git pull origin main
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build --force-recreate frontend backend
docker image prune -f
```

### 10.3 Откат (rollback)

```bash
# Откат к предыдущему коммиту
git log --oneline -5
git checkout <previous-commit-hash>
docker compose -f docker-compose.production.yml --env-file .env.production up -d --build frontend backend
```

### 10.4 Просмотр логов

```bash
# Все сервисы
docker compose -f docker-compose.production.yml logs -f

# Конкретный сервис
docker compose -f docker-compose.production.yml logs -f backend
docker compose -f docker-compose.production.yml logs -f postgres

# Последние 100 строк
docker compose -f docker-compose.production.yml logs --tail=100 backend
```

### 10.5 Доступ к БД

```bash
docker compose -f docker-compose.production.yml exec postgres \
  psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}
```

---

## Порядок реализации (Roadmap)

| #  | Этап                     | Приоритет | Время  |
|----|--------------------------|-----------|--------|
| 1  | Подготовить сервер (UFW, SSH, Docker) | 🔴 Критично | 1 ч   |
| 2  | Создать `.env.production`             | 🔴 Критично | 30 мин |
| 3  | Написать `Dockerfile.frontend`        | 🔴 Критично | 1 ч   |
| 4  | Написать `Dockerfile.backend`         | 🔴 Критично | 1 ч   |
| 5  | Настроить Nginx (reverse proxy + SSL) | 🔴 Критично | 2 ч   |
| 6  | Собрать `docker-compose.production.yml` | 🔴 Критично | 1 ч |
| 7  | Получить SSL сертификат               | 🔴 Критично | 30 мин |
| 8  | Первый деплой + smoke test            | 🔴 Критично | 1 ч   |
| 9  | Настроить бэкапы БД                   | 🟡 Важно    | 30 мин |
| 10 | CI/CD (GitHub Actions)                | 🟡 Важно    | 2 ч   |
| 11 | Мониторинг (базовый)                  | 🟢 Желательно | 1 ч |
| 12 | Мониторинг (Grafana + Prometheus)     | 🟢 Желательно | 3 ч |
| 13 | Security hardening                    | 🟡 Важно    | 1 ч   |

**Общее ориентировочное время: ~15 часов**

---

## Дополнительные рекомендации

1. **Staging окружение**: Создайте `docker-compose.staging.yml` + `.env.staging` для предварительного тестирования перед production
2. **Blue/Green Deployment**: Для zero-downtime деплоя рассмотрите использование Traefik вместо Nginx как reverse proxy
3. **Secrets Management**: Для enterprise-уровня рассмотрите HashiCorp Vault или AWS Secrets Manager
4. **CDN**: Используйте Cloudflare для кэширования статики и защиты от DDoS
5. **Database Replication**: Для высокой доступности настройте PostgreSQL streaming replication
6. **Container Orchestration**: При масштабировании рассмотрите переход на Kubernetes (K3s для начала)
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
            │  :7003    │  │  + WS :3033 │
            └───────────┘  └──────┬──────┘
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
FRONTEND_WS_URL=wss://aipbx.krasterisk.ru
FRONTEND_PORT=7003
FRONTEND_TG_BOT_ID=8298793342
FRONTEND_STRIPE_KEY=pk_live_51Q0CNuRQGiq1R43M...

# === Backend ===
BACKEND_PORT=5005
WS_PORT=3033
JWT_SECRET=<generated-strong-secret>
JWT_EXPIRATION=7d

# === Database ===
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=aipbx_user
POSTGRES_PASSWORD=<generated-strong-password>
POSTGRES_DB=aipbx_production

# === External Services ===
STRIPE_SECRET_KEY=sk_live_...
GOOGLE_CLIENT_ID=833962533381-...
COMPOSIO_API_KEY=...
OPENAI_API_KEY=...

# === Monitoring (optional) ===
SENTRY_DSN=https://...
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

Заменить текущий `Dockerfile` на multi-stage build:

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
ARG STRIPE_PUBLISHABLE_KEY

# Production build
RUN npm run build:prod -- \
  --env apiUrl=${API_URL} \
  --env staticUrl=${STATIC_URL} \
  --env wsUrl=${WS_URL} \
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
```

### 2.2 Backend — `Dockerfile.backend`

> ⚠️ Этот Dockerfile предполагает, что бэкенд — отдельный NestJS проект.
> Адаптируйте путь к репозиторию при необходимости.

```dockerfile
# ============================================
# Stage 1: Build
# ============================================
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:22-slim AS production

# Создаём non-root пользователя
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Копируем только production зависимости
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Копируем билд
COPY --from=builder /app/dist ./dist

# Безопасность
USER appuser

EXPOSE 5005 3033

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5005/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

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
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' wss://aipbx.krasterisk.ru https://api.stripe.com;" always;

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
version: "3.9"

services:
  # ─── PostgreSQL ──────────────────────
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups/postgres:/backups
    networks:
      - app-internal
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
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
      context: ./backend  # путь к репозиторию бэкенда
      dockerfile: Dockerfile.backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USERNAME: ${POSTGRES_USER}
      DB_PASSWORD: ${POSTGRES_PASSWORD}
      DB_DATABASE: ${POSTGRES_DB}
      JWT_SECRET: ${JWT_SECRET}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      COMPOSIO_API_KEY: ${COMPOSIO_API_KEY}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
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
      context: .  # текущий репозиторий (aiPBX)
      dockerfile: Dockerfile.frontend
      args:
        API_URL: ${FRONTEND_API_URL}
        STATIC_URL: ${FRONTEND_STATIC_URL}
        WS_URL: ${FRONTEND_WS_URL}
        PORT: ${FRONTEND_PORT}
        TG_BOT_ID: ${FRONTEND_TG_BOT_ID}
        STRIPE_PUBLISHABLE_KEY: ${FRONTEND_STRIPE_KEY}
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
    internal: false  # false, чтобы nginx мог принимать внешние подключения
```

---

## Фаза 5 — База данных: Бэкапы и миграции

### 5.1 Автоматический бэкап PostgreSQL

Создать `scripts/backup-db.sh`:

```bash
#!/bin/bash
set -euo pipefail

# Конфигурация
BACKUP_DIR="/app/backups/postgres"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/aipbx_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

# Создание директории
mkdir -p ${BACKUP_DIR}

# Дамп базы
docker compose -f docker-compose.production.yml exec -T postgres \
  pg_dump -U ${POSTGRES_USER} -d ${POSTGRES_DB} --format=custom \
  | gzip > ${BACKUP_FILE}

# Проверка размера
FILESIZE=$(stat -f%z "${BACKUP_FILE}" 2>/dev/null || stat -c%s "${BACKUP_FILE}")
echo "[$(date)] Backup created: ${BACKUP_FILE} (${FILESIZE} bytes)"

# Удаление старых бэкапов
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete
echo "[$(date)] Old backups cleaned (retention: ${RETENTION_DAYS} days)"
```

### 5.2 Cron для автоматических бэкапов

```bash
# Добавить в crontab (crontab -e)
# Бэкап каждый день в 3:00 AM UTC
0 3 * * * /app/scripts/backup-db.sh >> /var/log/db-backup.log 2>&1
```

### 5.3 Восстановление из бэкапа

```bash
# Восстановление
gunzip < backups/postgres/aipbx_YYYYMMDD_HHMMSS.sql.gz | \
  docker compose -f docker-compose.production.yml exec -T postgres \
  pg_restore -U ${POSTGRES_USER} -d ${POSTGRES_DB} --clean --if-exists
```

---

## Фаза 6 — CI/CD Pipeline (GitHub Actions)

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

  # ─── Step 2: Build & Push Docker Images ─
  build:
    name: 🏗️ Build Docker Images
    needs: quality
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
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
          file: Dockerfile.frontend
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}/frontend:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}/frontend:${{ github.sha }}
          build-args: |
            API_URL=${{ secrets.FRONTEND_API_URL }}
            STATIC_URL=${{ secrets.FRONTEND_STATIC_URL }}
            WS_URL=${{ secrets.FRONTEND_WS_URL }}
            PORT=7003
            TG_BOT_ID=${{ secrets.TG_BOT_ID }}
            STRIPE_PUBLISHABLE_KEY=${{ secrets.STRIPE_PUBLISHABLE_KEY }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ─── Step 3: Deploy ─────────────────
  deploy:
    name: 🚀 Deploy
    needs: build
    runs-on: ubuntu-latest
    environment: production
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
            
            echo "✅ Deployment successful!"

      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: "❌ Deployment failed! Check GitHub Actions."
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

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
      DATA_SOURCE_NAME: "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?sslmode=disable"
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

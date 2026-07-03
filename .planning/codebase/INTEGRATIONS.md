# External Integrations

**Analysis Date:** 2026-06-24

## APIs & External Services

**AI / LLM (backend):**
- OpenAI-compatible API — chat, embeddings (optional), realtime voice WebSocket
  - SDK/Client: `openai` npm package (`aiPBX_backend/src/open-ai/open-ai.service.ts`)
  - Auth: `OPENAI_API_KEY`, optional proxy `OPENAI_BASE_URL`, realtime `OPENAI_API_URL`
- Yandex Cloud realtime speech — vendor adapter `yandex` (`aiPBX_backend/src/open-ai/realtime-model.adapter.ts`)
  - Auth: `YANDEX_API_KEY`, `YANDEX_API_URL`, `YANDEX_MODEL`
- Alibaba Qwen realtime — vendor adapter `qwen`
  - Auth: `QWEN_API_KEY`, `QWEN_API_URL`
- Ollama (self-hosted) — non-realtime LLM, embeddings, operator analytics fallback
  - Client: native `fetch` to `OLLAMA_URL` (`aiPBX_backend/src/non-realtime/llm/ollama-chat.provider.ts`, `aiPBX_backend/src/knowledge/embedding.service.ts`)
  - Auth: none (internal network); models via `DEFAULT_OLLAMA_MODEL`, `EMBEDDING_MODEL`, `ANALYTICS_LLM_MODEL`

**Speech (backend):**
- GPU ASR / Whisper HTTP — default STT for non-realtime and operator analytics
  - Client: `axios`/`fetch` (`aiPBX_backend/src/whisper/whisper.service.ts`, `aiPBX_backend/src/operator-analytics/providers/external-stt.provider.ts`)
  - Auth: `STT_TOKEN` / `STT_API_TOKEN`; URLs: `WHISPER_API_URL`, `STT_API_URL`
- OpenAI STT — optional when `OPENAI_STT_ENABLED=true`
- Vosk (local CPU STT) — `vosk-koffi` in `aiPBX_backend/src/vosk-server/` (module disabled in `app.module.ts`)
- Silero TTS / OmniVoice TTS — HTTP TTS providers (`aiPBX_backend/src/non-realtime/tts/`)
  - URLs: `SILERO_TTS_URL`, `OMNIVOICE_TTS_URL`

**Telephony (backend):**
- Asterisk ARI (REST + WebSocket events) — call control, Stasis applications
  - SDK/Client: `ari-client`, custom `ari-http-client.ts` (`aiPBX_backend/src/ari/`)
  - Auth: per-PBX-server credentials stored in DB (`pbx_servers` table); env `AIPBX_BOTNAME`, `EXTERNAL_HOST`
- RTP UDP media server — receives audio streams on `UDP_SERVER_PORT` (`aiPBX_backend/src/rtp-udp-server/rtp-udp-server.service.ts`)
- SIP trunks — configuration and status via `sip-trunks` module; libraries `sip.js`, `werift`

**Payments:**
- Stripe — USD domains (`aipbx.net`, `aipbx.org`)
  - SDK: `stripe` (backend), `@stripe/stripe-js` + `@stripe/react-stripe-js` (frontend `src/features/CheckoutByStripe/`)
  - Auth: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (backend); `STRIPE_PUBLISHABLE_KEY` / `FRONTEND_STRIPE_KEY` (frontend build arg)
- Robokassa — RUB domain (`aipbx.ru`)
  - Client: custom MD5 signature flow (`aiPBX_backend/src/payments/payments.service.ts`)
  - Auth: `ROBOKASSA_MERCHANT_LOGIN`, `ROBOKASSA_PASSWORD_1`, `ROBOKASSA_PASSWORD_2`, `ROBOKASSA_TEST_MODE`
- Alfa Bank / alfawebhook — balance top-up callback compatible with legacy PBX webhook format
  - Client: `aiPBX_backend/src/accounting/alfawebhook-client.service.ts` (outgoing); incoming at `/api/payments/alfa-callback`

**Accounting / EDO (RU B2B, backend):**
- SBIS (Saby) — invoice creation, PDF fetch, EDO send/sign
  - Client: custom HTTP JSON-RPC style in `aiPBX_backend/src/accounting/sbis.service.ts`
  - Auth: `SBIS_LOGIN`, `SBIS_PASS`, `SBIS_ACC`; extensive `SBIS_*` tuning vars in `.env.example`

**MCP / third-party app connectors (backend):**
- Composio — OAuth and API-key connections for Gmail, Google Calendar, Outlook, Telegram, WhatsApp, Slack
  - SDK: `@composio/core` (`aiPBX_backend/src/mcp-client/services/composio.service.ts`)
  - Auth: `COMPOSIO_API_KEY`
  - Callback: `POST /api/mcp/composio/callback` (`aiPBX_backend/src/mcp-client/mcp-client.controller.ts`)
- Custom MCP servers — user-configured HTTP/SSE MCP endpoints with encrypted credentials (`ENCRYPTION_KEY`)

**Auth providers:**
- Email/password — bcrypt + JWT (`aiPBX_backend/src/auth/auth.service.ts`)
- Google Sign-In — `google-auth-library` OAuth2Client, `GOOGLE_CLIENT_ID` (backend + frontend `__GOOGLE_CLIENT_ID__`, `src/shared/lib/hooks/useGoogleLogin/`)
- Telegram Login Widget — HMAC validation of signed fields (`aiPBX_backend/src/auth/auth.service.ts`, frontend `TELEGRAM_BOT_ID` / `__TG_BOT_ID__`)
- API keys — static Bearer tokens in `api_keys` table (`aiPBX_backend/src/api-keys/api-key.guard.ts`)

**Currency rates (backend):**
- OpenExchangeRates — daily FX update
  - Client: `axios` in `aiPBX_backend/src/currency/currency.service.ts`
  - Auth: `CURRENCY_UPDATE_URL` (includes `app_id` query param)

## Data Storage

**Databases:**
- PostgreSQL (production default) or MySQL
  - Connection: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_DIALECT` (`aiPBX_backend/src/config/database.config.ts`)
  - Client: Sequelize + `@nestjs/sequelize`; models auto-loaded from feature modules
  - Extensions: pgvector for knowledge embeddings (`vector(768)` in `aiPBX_backend/src/knowledge/knowledge-chunk.model.ts`)

**File Storage:**
- Local filesystem — uploaded and generated files under `aiPBX_backend/static/`, served at `/static` via `@nestjs/serve-static` (`aiPBX_backend/src/files/files.service.ts`)
- Frontend static assets in `public/` (locales, favicon, SEO files)

**Caching:**
- None (no Redis/Memcached detected)
- In-memory maps used for WebSocket session routing (`aiPBX_backend/src/ws-server/ws-server.gateway.ts`)

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based auth (not Auth0/Firebase)
  - Implementation: `@nestjs/jwt` with `PRIVATE_KEY` secret (`aiPBX_backend/src/auth/auth.module.ts`)
  - Guards: `JwtAuthGuard`, `RolesGuard`, `ApiTokenGuard`, `ApiKeyGuard`
  - Frontend stores token in `localStorage` (`TOKEN_LOCALSTORAGE_KEY`), attached via RTK Query `prepareHeaders` (`src/shared/api/rtkApi.ts`)

## Monitoring & Observability

**Error Tracking:**
- Sentry — optional on both tiers
  - Frontend: `@sentry/react` with browser tracing + replay (`src/shared/config/sentry/initSentry.ts`); DSN via `SENTRY_DSN` build define
  - Backend: `@sentry/nestjs` in `aiPBX_backend/src/main.ts`; env `SENTRY_DSN`, `SENTRY_ENVIRONMENT`

**Logs:**
- NestJS `Logger` throughout backend services
- `console.log` in `main.ts` startup
- Frontend: browser console; no centralized log shipping detected

## CI/CD & Deployment

**Hosting:**
- Self-hosted VPS (three production environments behind Docker Compose + nginx)
- Domains: `aipbx.net` (USD/Stripe), `aipbx.ru` (RUB/Robokassa), `aipbx.org` (USD/Stripe) — runtime config in `src/shared/lib/domain/getDomainConfig.ts`

**CI Pipeline:**
- GitHub Actions — separate workflows per repo
  - Frontend (`aiPBX/.github/workflows/deploy.yml`): lint + Jest → SSH deploy frontend container
  - Backend (`aiPBX_backend/.github/workflows/deploy.yml`): Jest → SSH deploy backend via PM2/Docker
  - Node 22, `npm ci`, deploy gated by commit message deploy tags

## Environment Configuration

**Required env vars (minimum for local dev):**

Frontend (`.env` / `.env.local`):
- `API_URL` — REST base (dev default `/api`)
- `PORT` — dev server port
- Optional: `WS_URL`, `STATIC_URL`, `GOOGLE_CLIENT_ID`, `TELEGRAM_BOT_ID`, `STRIPE_PUBLISHABLE_KEY`, `SENTRY_DSN`, `YANDEX_METRIKA_ID`, `GA4_MEASUREMENT_ID`

Backend (`.env` or `.development.env`):
- `PORT`, `NODE_ENV`
- `DB_DIALECT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `PRIVATE_KEY` (JWT)
- `API_URL`, `CLIENT_URL`
- AI/telephony vars as needed for feature under test (see `aiPBX_backend/.env.example`)

**Secrets location:**
- Production: `/app/.env.production` on deploy servers (referenced in deploy workflows)
- Local: `.env`, `.env.local` (frontend), `.development.env` (backend) — gitignored
- GitHub Actions: environment-scoped secrets (`SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`) per `aipbx*_production` environment

## Webhooks & Callbacks

**Incoming (backend HTTP):**
- `POST /api/payments/webhook` — Stripe payment events (raw body, `stripe-signature` header)
- `POST /api/payments/robokassa/result` — Robokassa payment confirmation (form-urlencoded)
- `GET /api/payments/robokassa/success`, `/fail` — user redirect after payment
- `POST /api/payments/alfa-callback` — Alfa Bank / alfawebhook balance update (form-urlencoded)
- `POST /api/mcp/composio/callback` — Composio OAuth completion
- Telegram bot updates — `aiPBX_backend/src/telegram/telegram.controller.ts` (webhook endpoint for bot interactions)
- Operator analytics upload/API — authenticated REST under `/api/operator-analytics/` (API tokens per project)

**Outgoing:**
- Operator analytics project webhooks — configurable per-project `webhookUrl` + `webhookHeaders` for events like `anomaly.detected` (`aiPBX_backend/src/operator-analytics/dto/project.dto.ts`)
- SBIS EDO document send/sign — HTTP to Saby API (`aiPBX_backend/src/accounting/sbis.service.ts`)
- Alfa webhook client — balance notifications to external PBX (`aiPBX_backend/src/accounting/alfawebhook-client.service.ts`)
- Email via SMTP — password reset, billing alerts, runway warnings (`aiPBX_backend/src/mailer/mailer.service.ts`)
- Telegram admin notifications — signup logs, alerts via `node-telegram-bot-api` (`aiPBX_backend/src/telegram/telegram.service.ts`)
- Composio tool execution — outbound API calls on behalf of connected accounts
- OpenAI / Yandex / Qwen realtime — outbound WebSocket to inference endpoints
- GPU ASR/TTS/Ollama — outbound HTTP to self-hosted inference (`gpu.aipbx.net` in production `.env.example`)

**Realtime (WebSocket):**
- Socket.IO server on port 3033 — playground sessions, OpenAI event relay (`aiPBX_backend/src/ws-server/ws-server.gateway.ts`)
- Frontend connects via `socket.io-client` using `__WS__` or domain-derived host (`src/shared/lib/domain/getDomainConfig.ts`)
- OpenAI realtime proxy — backend maintains vendor WebSocket in `aiPBX_backend/src/open-ai/open-ai.connection.ts`

**Analytics (frontend, outbound to third parties):**
- Yandex Metrika — `https://mc.yandex.ru/metrika/tag.js` (`src/shared/config/analytics/initAnalytics.ts`)
- Google Analytics 4 — `googletagmanager.com/gtag/js` (`src/shared/config/analytics/initAnalytics.ts`)

---

*Integration audit: 2026-06-24*

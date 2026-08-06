# ARCHITECTURE — System Design Reference

Last updated: 2026-06-24.

## Deployment Topology

```
                    ┌─────────────┐
        Internet ──►│  Cloudflare  │  DNS + CDN + WAF
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    Nginx    │  :80 / :443 SSL
                    └──┬──────┬──┘
                       │      │
            ┌──────────▼┐  ┌──▼──────────┐
            │ Frontend  │  │  Backend    │
            │  static   │  │  NestJS     │
            │  SPA      │  │  :5005      │
            └───────────┘  │  WS :3033   │
                           │  UDP :3032  │
                           └──────┬──────┘
                                  │
                           ┌──────▼──────┐
                           │ PostgreSQL  │
                           └─────────────┘
```

**Servers:** aipbx.net `[deploy:1]` · aipbx.org `[deploy:2]` · aipbx.ru `[deploy:3]` (GPU services)  
**Deploy:** GitHub Actions SSH → Docker Compose on server. Tag `[deploy all]` or `[deploy:N]`.  
**Details:** `.agent/workflows/deploy.md`, `aiPBX_backend/.idea/deploy_architecture.md`

## Voice Pipeline Architecture

### Realtime (pipelineMode = realtime)

```
Asterisk ARI → AriService → RtpUdpServer (:3032)
    → OpenAiService WebSocket (OpenAI / Qwen / Yandex Realtime)
    → billing on response.done → AiCdrModule
```

### Non-realtime (pipelineMode = non-realtime)

```
Asterisk ARI → AriService → RtpUdpServer
    → Silero VAD → Whisper STT (GPU) → Ollama/OpenAI LLM → Silero/OmniVoice TTS
    → billing → AiCdrModule
```

**Reference:** `aiPBX_backend/.idea/voice-pipeline-architecture.md`

### Playground (browser test, no SIP)

```
Browser → WebSocket :3033 (playground_init / playground_audio / playground_stop)
    → PlaygroundModule → OpenAiService or NonRealtimeModule
    → events: playground.event (NOT openai.event)
```

**Reference:** `aiPBX_backend/.docs/EVENT-ROUTING-ARCHITECTURE.md`

### Public Widget (WebRTC embed)

```
External site → GET /api/widget/config → POST offer/ice/hangup
    → WidgetModule → same voice pipelines
```

## Frontend Architecture (FSD)

```
app/ → pages/ → widgets/ → features/ → entities/ → shared/
```

| Layer | Count | Role |
|-------|-------|------|
| pages | 38 | Route-level composition |
| widgets | ~10 | Layout (Navbar, Menubar, Sidebar) |
| features | 29 | User interactions, forms, sessions |
| entities | 25 | Domain API + types + list/card UI |
| shared | — | RTK base API, utils, 3 UI generations |

**State:** Redux Toolkit + RTK Query (`shared/api/rtkApi.ts`). Auth token in localStorage.  
**Routing:** React Router v6, `routeConfig.tsx` (~55 routes).  
**i18n:** i18next, `public/locales/{en,ru,de,zh}/`.  
**Build:** Webpack 5 primary; compile-time globals `__API__`, `__WS__`, `__STATIC__`.

**UI / copy conventions (required for new work):**
- No em dash (`—`, U+2014) in labels, buttons, hints, empty states, or i18n keys/values - use hyphen `-` or rephrase.
- No emoji in cabinet UI, i18n, or textual labels/descriptions - use shared icons (Lucide etc.).
- Details: `.docs/FRONTEND_ARCHITECTURE.md` («Тексты в UI»).

**UI generations (tech debt):**
- `shared/ui/deprecated/` — do not use
- `shared/ui/redesigned/` — legacy active
- `shared/ui/redesign-v3/` — **use for all new UI**

## Backend Architecture (NestJS Monolith)

**Entry:** `src/main.ts` — prefix `/api`, Helmet, Throttler 100/min, Swagger (non-prod).  
**ORM:** Sequelize + sequelize-typescript, PostgreSQL.  
**Auth:** JWT 14d, `RolesGuard`, `JwtAuthGuard`, `ApiTokenGuard`, `JwtOrApiKeyGuard`.  
**Multi-tenant:** `vpbxUserId` on JWT; admin bypasses scoping.

### Module dependency graph (simplified)

```
AriModule
├── RtpUdpServerModule
├── OpenAiModule
├── NonRealtimeModule
├── AudioModule
├── AssistantsModule
├── AiToolsHandlersModule
└── BillingModule → AiCdrModule

OperatorAnalyticsModule
├── WhisperModule
├── BillingModule
└── (STT → LLM → metrics pipeline)

OrganizationsModule → AccountingModule (SBIS)
PaymentsModule → BillingModule
McpClientModule → AiToolsHandlersModule
KnowledgeModule → AiToolsHandlersModule (knowledge_base handler)
```

### Scheduled jobs

| Cron | Module | Purpose |
|------|--------|---------|
| Every minute | AriModule | ARI health / reconnect |
| 1am daily | CurrencyModule | FX rate update |
| 3am daily | OperatorAnalytics | Retention (if enabled) |
| 4am daily | OperatorAnalytics | Anomaly detection (if enabled) |
| 9am daily | BillingModule | Balance runway alerts |
| 3am 1st + every 5min | AccountingModule | SBIS UPD closing |
| Every 10min | OperatorAnalytics | Stuck processing reaper |

## Data Flow: Operator Analytics

```
Upload audio/URL → STT (Whisper) → LLM metrics → project dashboard
    → AI Insights (structured, cached per tenant)
    → Public API (oa_xxx token) for external systems
```

**Env tuning:** `aiPBX_backend/docs/OPERATOR_ANALYTICS_ENV.md` (30+ vars)

## Data Flow: Billing (RU B2B)

```
Usage (tokens/STT/TTS) → BillingRecord (USD ledger)
    → display in TENANT_CURRENCY (RUB/USD)
    → monthly UPD closing via SBIS (RUB prod)
    → runway forecast cron → email alert
```

**Reference:** `aiPBX_backend/docs/BILLING_LEGAL_ENTITIES.md`

## Knowledge Base (RAG)

```
Upload PDF/DOCX/URL → parse → Ollama embeddings → pgvector
    → tool handler knowledge_base → search during call
```

**Reference:** `aiPBX_backend/.idea/knowledge-base-implementation.md`

## MCP Integration

- **Persistent:** MCP servers registered per tenant, tools synced to assistant
- **Ephemeral:** per chat message in `ChatModule` (SSE)
- **Composio:** OAuth for 250+ SaaS apps

**Reference:** `aiPBX_backend/.docs/MCP_INTEGRATION.md`

## Frontend Dashboard Architecture

Three dashboard pages share `DashboardLayout` + `dashboardPageSlice`:

| Page | Data source | Feature slice |
|------|-------------|---------------|
| Overview | `/reports/dashboard` | `features/Dashboard` |
| AI Analytics | `/ai-analytics/*` | `features/Dashboard` |
| Call Records | `/operator-analytics/*` | `features/OperatorAnalytics` |

**Reference:** `aiPBX/.idea/dashboards_architecture.md`

## Domain Config (multi-tenant domains)

`shared/lib/domain/getDomainConfig.ts` — runtime config per hostname:
- aipbx.ru → Robokassa, RUB, Russian legal docs
- aipbx.net / .org → Stripe, USD/EUR

## Security Boundaries (do not cross without phase)

| Area | Risk | Guard |
|------|------|-------|
| AriModule / RTP | Live calls drop | Manual telephony checklist |
| BillingModule | Money incorrect | Unit tests + manual verify |
| AccountingModule / SBIS | Legal docs wrong | SBIS sandbox first |
| Tenant isolation | Data leak | Cache keys must include userId |
| JWT / PRIVATE_KEY | Auth bypass | Never default `'SECRET'` in prod |

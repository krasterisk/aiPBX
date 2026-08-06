<!-- refreshed: 2026-06-24 -->
# Architecture

**Analysis Date:** 2026-06-24

## System Overview

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                         Browser / External Sites                          │
│   SPA (React) · WebRTC widget · Socket.IO client · Public landing pages  │
└───────────────┬──────────────────────────────┬───────────────────────────┘
                │ REST /api/*                   │ WS :3033 · UDP RTP :3032
                ▼                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    Nginx (SSL, static, API proxy)                         │
│   Frontend build → static SPA    Backend NestJS → :5005 (HTTP)           │
└───────────────┬──────────────────────────────┬───────────────────────────┘
                │                               │
                ▼                               ▼
┌───────────────────────────┐   ┌──────────────────────────────────────────┐
│  Frontend (aiPBX)         │   │  Backend (aiPBX_backend)                  │
│  `src/` — FSD layers      │   │  `src/` — NestJS monolith (~40 modules)  │
│  RTK Query + Redux        │   │  Sequelize + PostgreSQL/MySQL              │
└───────────────────────────┘   └──────────────┬───────────────────────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    ▼                          ▼                          ▼
            ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
            │ PostgreSQL   │          │ Asterisk ARI │          │ GPU services │
            │ :5432        │          │ SIP/RTP      │          │ Whisper STT  │
            └──────────────┘          └──────────────┘          │ Silero TTS   │
                                                                  └──────────────┘
```

**Repositories:**

| Repo | Path | Role |
|------|------|------|
| Frontend | `c:/Users/Professional/WebstormProjects/aiPBX` | React SPA, admin UI, public GTM pages |
| Backend | `c:/Users/Professional/WebstormProjects/aiPBX_backend` | REST API, telephony, billing, analytics |

**API contract:** REST `/api/*` + Socket.IO on port `3033`. Types duplicated by convention — frontend `entities/*/model/types/` mirrors backend DTOs; OpenAPI types generated to `src/shared/api/generated/schema.d.ts` via `npm run generate:api-types`.

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Frontend bootstrap | Mount React, providers, observability init | `src/index.tsx` |
| App shell | Auth-gated layout, router, toasts, onboarding | `src/app/App.tsx` |
| RTK Query base API | JWT auth header, cache tags, endpoint injection | `src/shared/api/rtkApi.ts` |
| Redux store | Static + dynamic reducers, RTK middleware | `src/app/providers/StoreProvider/config/store.ts` |
| Route config | ~55 routes, lazy pages, role guards | `src/app/providers/router/config/routeConfig.tsx` |
| NestJS entry | Global prefix, CORS, Helmet, Swagger, Sentry | `aiPBX_backend/src/main.ts` |
| App module | Module registry, DB, throttler, static files | `aiPBX_backend/src/app.module.ts` |
| ARI telephony | Asterisk connections, call routing, pipeline dispatch | `aiPBX_backend/src/ari/ari.service.ts` |
| WebSocket gateway | Real-time events, playground, auth by userId | `aiPBX_backend/src/ws-server/ws-server.gateway.ts` |
| Billing | Usage ledger, FX, runway alerts | `aiPBX_backend/src/billing/billing.service.ts` |
| Operator Analytics | STT → LLM metrics → dashboards, public API | `aiPBX_backend/src/operator-analytics/operator-analytics.service.ts` |

## Pattern Overview

**Overall:** Full-stack monolith split across two repos — Feature-Sliced Design (frontend) + NestJS modular monolith (backend).

**Key Characteristics:**
- Frontend layers enforce one-way imports: `app → pages → widgets → features → entities → shared`
- Backend modules are domain-vertical (`assistants/`, `billing/`, `ari/`) with controller → service → model pattern
- Multi-tenant scoping via `vpbxUserId` on JWT; admin bypasses tenant filters
- Voice pipelines branch on `pipelineMode`: `realtime` vs `non-realtime`
- Domain-specific payment/currency resolved at runtime on frontend (`getDomainConfig.ts`); backend handles Stripe vs Robokassa per tenant

## Layers

### Frontend — Feature-Sliced Design

**app:**
- Purpose: Application initialization, global providers, routing shell
- Location: `src/app/`
- Contains: `App.tsx`, `providers/` (Store, Theme, ErrorBoundary, Router), `middleware/`, global styles
- Depends on: `pages`, `widgets`, `features`, `entities`, `shared`
- Used by: `src/index.tsx`

**pages:**
- Purpose: Route-level composition; one slice per route group
- Location: `src/pages/` (~37 slices)
- Contains: `ui/*Page.tsx`, `*.async.ts` lazy wrappers, optional page-local reducers
- Depends on: `widgets`, `features`, `entities`, `shared`
- Used by: `src/app/providers/router/config/routeConfig.tsx`

**widgets:**
- Purpose: Composite layout blocks reused across pages
- Location: `src/widgets/` (~12 slices: `Navbar`, `Menubar`, `Page`, `DashboardLayout`, etc.)
- Contains: layout shells, documentation chrome, page scaffolding
- Depends on: `features`, `entities`, `shared`
- Used by: `pages`, `app/App.tsx`

**features:**
- Purpose: User interactions, forms, multi-step flows
- Location: `src/features/` (~29 slices: `Auth`, `Dashboard`, `OperatorAnalytics`, `Onboarding`, etc.)
- Contains: form UIs, wizards, checkout flows, session UIs
- Depends on: `entities`, `shared`
- Used by: `pages`, `widgets`

**entities:**
- Purpose: Domain data — API, types, list/card UI, page slices
- Location: `src/entities/` (25 slices: `User`, `Assistants`, `Billing`, `Report`, etc.)
- Contains: `api/*Api.ts` (RTK inject), `model/types/`, `model/slices/`, `ui/`
- Depends on: `shared` only
- Used by: `features`, `pages`, `widgets`, `app`

**shared:**
- Purpose: Cross-cutting utilities, design system, config
- Location: `src/shared/`
- Contains: `api/rtkApi.ts`, `ui/` (3 generations), `lib/`, `config/`, `const/`, `layouts/`
- Depends on: nothing above
- Used by: all layers

### Backend — NestJS Modules

**Core infrastructure:**
- Purpose: Boot, config, cross-cutting guards
- Location: `aiPBX_backend/src/main.ts`, `app.module.ts`, `config/`
- Contains: Sequelize config (`config/database.config.ts`), env resolution (`config/env-files.ts`)
- Depends on: NestJS platform packages
- Used by: all modules

**Domain modules:**
- Purpose: REST endpoints + business logic per product area
- Location: `aiPBX_backend/src/{module-name}/`
- Contains: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.model.ts`, `dto/`
- Pattern: `@Module` imports peer modules; `@Controller('resource')` + `@UseGuards(RolesGuard)`
- Used by: `app.module.ts` imports array

**Telephony / voice stack:**
- Purpose: Live calls, audio pipelines, CDR
- Location: `ari/`, `rtp-udp-server/`, `open-ai/`, `non-realtime/`, `audio/`, `playground/`, `widget/`
- Depends on: `assistants`, `billing`, `ai-cdr`, `ai-tools-handlers`
- Used by: Asterisk ARI events, browser playground, embeddable widget

**Billing / accounting:**
- Purpose: Usage metering, payments, legal documents (SBIS)
- Location: `billing/`, `payments/`, `accounting/`, `currency/`, `prices/`
- Depends on: `users`, `organizations`
- Used by: voice pipelines, operator analytics, frontend billing pages

## Data Flow

### Primary Request Path (Authenticated CRUD)

1. User action in page/feature component (`src/pages/AssistantsPage/ui/AssistantsPage/AssistantsPage.tsx`)
2. RTK Query hook from entity API (`src/entities/Assistants/api/assistantsApi.ts` → `useAssistants`)
3. HTTP `GET/POST/PATCH/DELETE` to `__API__` + `/assistants/*` with Bearer JWT (`src/shared/api/rtkApi.ts`)
4. Nginx proxies to NestJS `:5005` with global prefix `/api` (`aiPBX_backend/src/main.ts`)
5. `RolesGuard` validates JWT, sets `req.vpbxUserId`, `req.isAdmin` (`aiPBX_backend/src/auth/roles.guard.ts`)
6. Controller delegates to service (`aiPBX_backend/src/assistants/assistants.controller.ts` → `assistants.service.ts`)
7. Sequelize model read/write (`aiPBX_backend/src/assistants/assistants.model.ts`)
8. JSON response → RTK cache update via `providesTags` / `invalidatesTags`

### Real-Time Events (Live Calls / Playground)

1. Frontend connects Socket.IO to `getWsUrl()` (`src/shared/lib/hooks/useOpenAiEvents/useOpenAiEvents.ts`)
2. Client emits `auth` with `userId` → `WsServerGateway` maps socket to user (`aiPBX_backend/src/ws-server/ws-server.gateway.ts`)
3. Backend services emit domain events via `EventEmitter2` → gateway broadcasts (`openai.event`, `playground.event`)
4. Playground audio: browser → `playground_init` / `playground_audio` → `PlaygroundModule` → voice pipeline (`aiPBX_backend/src/playground/playground.module.ts`)

### Voice Call Pipeline (SIP via Asterisk)

1. Inbound SIP call hits Asterisk → ARI event (`aiPBX_backend/src/ari/ari.service.ts`)
2. `AriService` loads assistant config from `AssistantsService`
3. Audio routed via `RtpUdpServerService` on UDP `:3032` (`aiPBX_backend/src/rtp-udp-server/`)
4. **Realtime path:** `OpenAiService` WebSocket to OpenAI/Qwen/Yandex Realtime
5. **Non-realtime path:** `NonRealtimeService` — Silero VAD → Whisper STT → LLM → TTS
6. Tool calls via `AiToolsHandlersModule` (MCP, knowledge base, Composio)
7. Usage billed → `BillingModule` → `AiCdrModule` CDR records

### Operator Analytics Pipeline

1. Upload audio/URL via frontend `features/OperatorAnalytics` → `entities/Report`
2. `POST /api/operator-analytics/*` → `OperatorAnalyticsService`
3. STT via `WhisperModule` or external provider (`operator-analytics/providers/`)
4. LLM metric extraction → `MetricValue` models
5. Dashboard data served to `pages/DashboardCallRecordsPage`, `pages/AnalyticsProjectsPage`
6. External systems use `ApiTokenGuard` + `oa_xxx` tokens (`operator-analytics/guards/api-token.guard.ts`)

### Authentication Flow

1. Login form in `features/Auth` → `usersApi` login mutation (`src/entities/User/api/usersApi.ts`)
2. Backend `AuthService` validates credentials, returns JWT 14d (`aiPBX_backend/src/auth/auth.service.ts`)
3. Token stored in `localStorage` via `TOKEN_LOCALSTORAGE_KEY` (`src/shared/const/localstorage`)
4. `App.tsx` calls `useGetMe` to hydrate user slice; `RequireAuth` guards protected routes (`src/app/providers/router/ui/RequireAuth.tsx`)
5. Backend `RolesGuard` + `@Roles('ADMIN','USER')` on controllers enforce role + tenant scope

**State Management:**
- Global: Redux Toolkit store with `user`, `rtkApi`, `saveScroll` reducers (`src/app/providers/StoreProvider/config/store.ts`)
- Page-scoped: `DynamicModuleLoader` injects entity page reducers on mount (`src/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.tsx`)
- Server state: RTK Query cache with tag-based invalidation (`src/shared/api/rtkApi.ts` tagTypes)
- Legacy: Axios `$api` instance still available for thunks (`src/shared/api/api.ts`)

## Key Abstractions

**RTK Query endpoint injection:**
- Purpose: Single API slice, per-entity endpoints
- Examples: `src/entities/Assistants/api/assistantsApi.ts`, `src/entities/Billing/api/billingApi.ts`
- Pattern: `rtkApi.injectEndpoints({ endpoints: (build) => ({ ... }) })` — export generated hooks from entity `index.ts`

**Dynamic reducer manager:**
- Purpose: Code-split page state without bloating root store
- Examples: `assistantsPageReducer` in `src/entities/Assistants/model/slices/assistantsPageSlice.ts`
- Pattern: Page wraps content in `<DynamicModuleLoader reducers={{ assistantsPage: assistantsPageReducer }}>`

**NestJS module triad:**
- Purpose: Standard backend vertical slice
- Examples: `aiPBX_backend/src/assistants/assistants.module.ts`
- Pattern: `*.module.ts` (imports/exports) + `*.controller.ts` (HTTP) + `*.service.ts` (logic) + `*.model.ts` (Sequelize) + `dto/*.dto.ts`

**Multi-tenant request context:**
- Purpose: Scope data to tenant unless admin
- Examples: `RequestWithUser` in `aiPBX_backend/src/assistants/assistants.controller.ts`
- Pattern: `req.vpbxUserId || req.tokenUserId` passed to service; admin sees all

**Domain config (frontend):**
- Purpose: Runtime payment/currency per hostname
- Examples: `src/shared/lib/domain/getDomainConfig.ts`
- Pattern: `window.location.hostname` → `aipbx.ru` (Robokassa/RUB) vs `aipbx.net` (Stripe/USD)

**UI generation layers:**
- Purpose: Incremental redesign without big-bang migration
- Examples: `src/shared/ui/redesign-v3/` (new), `redesigned/` (active legacy), `deprecated/` (frozen)
- Pattern: All new UI components go in `redesign-v3/` per `.cursor/rules/frontend-fsd.mdc`

## Entry Points

**Frontend SPA:**
- Location: `src/index.tsx`
- Triggers: Browser loads `public/index.html` → Webpack bundle
- Responsibilities: Init Sentry/analytics, mount provider tree, render `App`

**Frontend routing:**
- Location: `src/app/providers/router/ui/AppRouter.tsx`
- Triggers: URL change via React Router v6
- Responsibilities: Lazy-load pages from `routeConfig`, apply `RequireAuth` + role checks

**Backend HTTP:**
- Location: `aiPBX_backend/src/main.ts`
- Triggers: `nest start` / `node dist/main`
- Responsibilities: Listen on `PORT`, serve `/api/*`, static `/static/*`, Swagger at `/api/docs` (non-prod)

**Backend WebSocket:**
- Location: `aiPBX_backend/src/ws-server/ws-server.gateway.ts`
- Triggers: Socket.IO client connection on port `3033`
- Responsibilities: User auth binding, event fan-out, playground session lifecycle

**ARI telephony:**
- Location: `aiPBX_backend/src/ari/ari.service.ts`
- Triggers: `onModuleInit` + cron every minute (health/reconnect)
- Responsibilities: Connect to PBX servers from DB, handle inbound/outbound AI calls

## Architectural Constraints

- **Threading:** Node.js single-threaded event loop; UDP RTP and WebSocket I/O on same process; GPU STT/TTS are external HTTP services
- **Global state:** Redux store singleton; Socket.IO client singleton in `useOpenAiEvents.ts` (module-level `io(wsUrl)`)
- **Circular imports:** Backend uses `forwardRef(() => AuthModule)` in `ari.module.ts`, `billing.module.ts`; frontend ESLint `krasterisk-plugin/layer-imports` enforces FSD boundaries
- **Disabled modules:** `AmiModule`, `VoskServerModule` commented out in `app.module.ts`; `VpbxUsersModule` exists but not imported (orphan)
- **Type sync:** No shared package — backend DTO changes require manual frontend entity type updates + `generate:api-types`
- **Build globals:** Webpack injects `__API__`, `__WS__`, `__STATIC__`, `__IS_DEV__` at compile time (`webpack.config.ts` → `config/build/`)

## Anti-Patterns

### Importing Upward in FSD

**What happens:** A `shared/` or `entities/` file imports from `features/` or `pages/`
**Why it's wrong:** Breaks layer isolation; creates circular deps and untestable coupling
**Do this instead:** Move shared logic down to `entities/` or `shared/lib/`; expose via entity `index.ts` public API

### Adding UI to deprecated/redesigned Without Reason

**What happens:** New components land in `src/shared/ui/redesigned/` or `deprecated/`
**Why it's wrong:** Perpetuates 3-way UI split; increases migration debt
**Do this instead:** Use `src/shared/ui/redesign-v3/` for all new components (`.cursor/rules/frontend-fsd.mdc`)

### Direct Axios Calls for CRUD

**What happens:** New endpoints called via `$api` instead of RTK Query
**Why it's wrong:** Bypasses cache tags, loading states, and established entity patterns
**Do this instead:** Inject endpoint in `entities/{Entity}/api/{entity}Api.ts` via `rtkApi.injectEndpoints`

### Touching Billing/ARI Without Phase Guard

**What happens:** Drive-by changes to `aiPBX_backend/src/billing/` or `ari/` during unrelated work
**Why it's wrong:** Money and live-call regressions; per `.planning/PROJECT.md` agent rules
**Do this instead:** Dedicated phase with unit tests + manual telephony checklist

### Hardcoded Tenant Scope in Backend

**What happens:** Service queries without `vpbxUserId` filter for non-admin users
**Why it's wrong:** Cross-tenant data leak
**Do this instead:** Follow `assistants.controller.ts` pattern — pass `realUserId` from `req.vpbxUserId`; include `userId` in cache keys on frontend

## Error Handling

**Strategy:** Layer-specific — RTK Query error shapes in UI, NestJS `HttpException` hierarchy on backend, React ErrorBoundary for render crashes.

**Patterns:**
- Frontend list pages: `ErrorGetData` entity component on RTK `isError` (`src/entities/ErrorGetData/`)
- Frontend global: `ErrorBoundary` in `src/app/providers/ErrorBoundary/ui/ErrorBoundary.tsx` with Sentry reporting
- Backend guards: `UnauthorizedException` / `HttpException` in `roles.guard.ts`
- Backend validation: Global `ValidationPipe` with `transform: true` in `main.ts`
- Toast feedback: `toastMiddleware` in `src/app/middleware/toastMiddleware.ts` for mutation errors

## Cross-Cutting Concerns

**Logging:** Backend `LoggerService` in `aiPBX_backend/src/logger/`; NestJS `Logger` in services; frontend `console` in dev, Sentry in prod (`src/shared/config/sentry/initSentry.ts`)

**Validation:** Backend `class-validator` DTOs in `dto/` folders; frontend form schemas in `features/*/model/types/` (e.g. `features/Auth/model/types/loginSchema.ts`)

**Authentication:** JWT Bearer 14d; `RolesGuard` + `@Roles()` decorator; frontend `RequireAuth` + role arrays in `routeConfig.tsx`; API keys via `ApiKeyModule` and `JwtOrApiKeyGuard` for programmatic access

**i18n:** `i18next` initialized in `src/shared/config/i18n/i18n`; keys in `public/locales/{en,ru,de,zh}/`

**UI / copy conventions (required for new work):**
- Do **not** use the em dash (`—`, U+2014) in user-facing labels, button text, hints, empty states, or i18n keys/values. Use a regular hyphen `-` (U+002D) or rephrase.
- Do **not** use emoji in cabinet UI, i18n strings, or textual labels/descriptions. Use shared icon components (e.g. Lucide) instead.
- Full frontend rules: `.docs/FRONTEND_ARCHITECTURE.md` (section «Тексты в UI»).

**Observability:** Sentry on both repos; Yandex Metrika + GA4 via `src/shared/config/analytics/initAnalytics.ts`

**Rate limiting:** Global `ThrottlerGuard` 100 req/min (`aiPBX_backend/src/app.module.ts`)

---

*Architecture analysis: 2026-06-24*

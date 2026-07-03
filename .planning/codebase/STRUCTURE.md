# Codebase Structure

**Analysis Date:** 2026-06-24

## Directory Layout

```
aiPBX/                              # Frontend repo
├── .planning/                      # GSD planning (agents + founder)
│   ├── codebase/                   # Codebase intelligence docs (this file)
│   └── intel/                      # Single source of truth for agents
├── .cursor/rules/                  # Cursor agent rules (FSD, core)
├── config/                         # Webpack, Jest, Storybook build config
│   ├── build/                      # Webpack plugins, loaders, env types
│   ├── jest/                       # Unit test config
│   └── storybook/                  # Storybook config + decorators
├── public/                         # Static assets, i18n locales, user docs
│   ├── locales/{en,ru,de,zh}/      # i18next translation JSON
│   ├── docs/                       # In-app user documentation
│   └── index.html                  # SPA shell
├── scripts/                        # Codegen (createSlice), cache, feature flags
├── src/                            # Application source (FSD)
│   ├── app/                        # Bootstrap, providers, router, global styles
│   ├── pages/                      # Route-level page slices (~37)
│   ├── widgets/                    # Layout composites (~12)
│   ├── features/                   # User interaction slices (~29)
│   ├── entities/                   # Domain slices (~25)
│   └── shared/                     # API, UI kit, lib, config, layouts
├── cypress/                        # E2E tests
├── docs/                           # Developer documentation
├── webpack.config.ts               # Primary build entry (production)
├── vite.config.ts                  # Alternate dev server (secondary)
├── tsconfig.json                   # Path alias @/* → src/*
└── package.json

aiPBX_backend/                        # Backend repo (sibling)
├── src/                            # NestJS application (~40 modules)
│   ├── main.ts                     # HTTP entry point
│   ├── app.module.ts               # Root module registry
│   ├── config/                     # DB, env file resolution
│   ├── auth/                       # JWT, guards, decorators
│   ├── shared/                     # Cross-module utilities (tenant helpers)
│   ├── ari/                        # Asterisk ARI telephony
│   ├── billing/                    # Usage metering, FX, runway
│   ├── operator-analytics/         # Speech analytics pipeline
│   ├── accounting/                 # SBIS invoices, legal docs
│   ├── open-ai/                    # Realtime voice WebSocket
│   ├── non-realtime/               # VAD → STT → LLM → TTS pipeline
│   ├── playground/                 # Browser voice test (no SIP)
│   ├── widget/                     # WebRTC embed widget
│   ├── ws-server/                  # Socket.IO gateway :3033
│   ├── rtp-udp-server/             # UDP audio :3032
│   └── {domain}/                   # One folder per NestJS module
├── migrations/                     # DB migrations
├── test/                           # E2E tests (supertest)
├── static/                         # Served at /static
├── docs/                           # Developer docs
├── .docs/                          # Agent-oriented backend docs
├── openapi.json                    # Exported OpenAPI schema
├── docker/                         # Docker compose fragments
├── nest-cli.json
└── package.json
```

## Directory Purposes

### Frontend (`aiPBX`)

**`src/app/`:**
- Purpose: Application shell and cross-cutting providers
- Contains: `App.tsx`, `providers/` (Store, Theme, Router, ErrorBoundary), `middleware/`, `styles/`
- Key files: `src/index.tsx`, `src/app/providers/router/config/routeConfig.tsx`, `src/app/providers/StoreProvider/config/store.ts`

**`src/pages/`:**
- Purpose: One slice per route or route group; thin composition layer
- Contains: `ui/{Name}Page/`, `*.async.ts`, `index.ts` barrel
- Key files: `src/pages/AssistantsPage/`, `src/pages/DashboardOverviewPage/`, `src/pages/PublicPricingPage/`

**`src/widgets/`:**
- Purpose: Reusable layout blocks spanning multiple pages
- Contains: `Navbar/`, `Menubar/`, `Page/`, `DashboardLayout/`, `DocumentationLayout/`
- Key files: `src/widgets/Page/ui/Page/Page.tsx`, `src/widgets/DashboardLayout/ui/DashboardLayout/DashboardLayout.tsx`

**`src/features/`:**
- Purpose: Interactive user flows — forms, wizards, checkout, sessions
- Contains: `ui/`, optional `model/` (schemas, slices)
- Key files: `src/features/Auth/`, `src/features/Dashboard/`, `src/features/OperatorAnalytics/`, `src/features/Onboarding/`

**`src/entities/`:**
- Purpose: Domain boundary — API, types, selectors, list/card UI
- Contains: `api/`, `model/types/`, `model/slices/`, `model/selectors/`, `ui/`, `lib/`
- Key files: `src/entities/User/`, `src/entities/Assistants/`, `src/entities/Billing/`, `src/entities/Report/`

**`src/shared/`:**
- Purpose: Framework-agnostic utilities and design system
- Contains: `api/`, `ui/` (deprecated, redesigned, redesign-v3, mui), `lib/`, `config/`, `const/`, `layouts/`
- Key files: `src/shared/api/rtkApi.ts`, `src/shared/const/router.ts`, `src/shared/lib/domain/getDomainConfig.ts`

**`config/`:**
- Purpose: Build tooling (not runtime app code)
- Contains: Webpack config builders, Jest setup, Storybook decorators
- Key files: `config/build/buildWebpackConfig.ts`, `config/jest/jest.config.ts`

**`public/`:**
- Purpose: Static files copied/served as-is
- Contains: `locales/`, `docs/`, favicon, robots.txt, sitemap.xml
- Key files: `public/locales/en/`, `public/locales/ru/`

### Backend (`aiPBX_backend`)

**`src/{module-name}/`:**
- Purpose: Vertical domain slice (standard NestJS module)
- Contains: `{name}.module.ts`, `{name}.controller.ts`, `{name}.service.ts`, `{name}.model.ts`, `dto/`, optional `guards/`, `providers/`, `lib/`
- Key files: Per-module; see module list in `src/app.module.ts`

**`src/config/`:**
- Purpose: Database and environment configuration
- Contains: `database.config.ts`, `env-files.ts`
- Key files: `src/config/database.config.ts`

**`src/auth/`:**
- Purpose: Authentication guards and JWT utilities shared by all modules
- Contains: `roles.guard.ts`, `jwt-auth.guard.ts`, `roles-auth.decorator.ts`, `auth.service.ts`
- Key files: `src/auth/roles.guard.ts`

**`src/shared/`:**
- Purpose: Backend cross-module helpers (not NestJS "shared module" — folder only)
- Contains: `tenant/` (currency, billing context helpers)
- Key files: `src/shared/tenant/tenant-currency.ts`

**`migrations/`:**
- Purpose: Sequelize/manual DB schema changes
- Contains: SQL or migration scripts
- Generated: Manual
- Committed: Yes

**`static/`:**
- Purpose: Files served at `/static` (uploads, generated assets)
- Generated: Runtime
- Committed: Partial (structure yes, uploads typically no)

## Key File Locations

### Frontend Entry Points

- `src/index.tsx`: React DOM mount, provider tree, Sentry/analytics init
- `src/app/App.tsx`: Auth-gated shell, layout selection, onboarding overlay
- `src/app/providers/router/ui/AppRouter.tsx`: Route rendering with `RequireAuth`
- `src/app/providers/router/config/routeConfig.tsx`: All route definitions (~55 routes)
- `webpack.config.ts`: Production build; injects `__API__`, `__WS__`, `__STATIC__`

### Frontend Configuration

- `tsconfig.json`: `@/*` path alias → `./src/*`
- `.eslintrc.js`: ESLint + `krasterisk-plugin` FSD layer rules
- `.env.example`: Documented env vars (never commit `.env`)
- `config/build/types/config.ts`: Webpack env type definitions

### Frontend Core Logic

- `src/shared/api/rtkApi.ts`: RTK Query base API + tag types
- `src/shared/api/generated/schema.d.ts`: OpenAPI-generated types (regenerate after backend export)
- `src/shared/const/router.ts`: Route path helpers (`getRouteAssistants()`, etc.)
- `src/entities/User/`: Auth state, `useGetMe`, login/signup API
- `src/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.tsx`: Lazy reducer injection

### Frontend Testing

- `config/jest/jest.config.ts`: Unit test runner config
- `**/*.test.ts(x)`: Co-located with source (e.g. `src/entities/Report/lib/mergeReportsCache.test.ts`)
- `cypress/`: E2E tests (`npm run test:e2e`)
- `.loki/`: Visual regression baselines (Storybook + Loki)

### Backend Entry Points

- `src/main.ts`: NestJS bootstrap, global pipes, Helmet, Swagger
- `src/app.module.ts`: All active module imports

### Backend Configuration

- `src/config/database.config.ts`: Sequelize + PostgreSQL/MySQL connection
- `src/config/env-files.ts`: `.development.env` / `.production.env` resolution
- `.env.example`: Required env var documentation
- `nest-cli.json`: NestJS CLI build config
- `openapi.json`: Committed OpenAPI spec (export via `npm run swagger:export`)

### Backend Core Logic

- `src/ari/ari.service.ts`: Telephony orchestration
- `src/ws-server/ws-server.gateway.ts`: Socket.IO :3033
- `src/billing/billing.service.ts`: Usage ledger
- `src/operator-analytics/operator-analytics.service.ts`: Analytics pipeline
- `src/accounting/sbis.service.ts`: SBIS integration (RU legal docs)

### Backend Testing

- `src/**/*.spec.ts`: Co-located unit tests (Jest `testRegex: .*\.spec\.ts$`)
- `test/`: E2E tests with `jest-e2e.json`
- `package.json` jest config: `rootDir: src`

## Naming Conventions

### Frontend Files

- **Page components:** `{Name}Page.tsx` in `pages/{Name}Page/ui/{Name}Page/`
- **Lazy wrappers:** `{Name}Page.async.ts` using `React.lazy()`
- **SCSS modules:** `{Component}.module.scss` co-located with component
- **API slices:** `{entity}Api.ts` in `entities/{Entity}/api/`
- **Redux slices:** `{name}Slice.ts` in `entities/{Entity}/model/slices/` or `features/{Feature}/model/slices/`
- **Selectors:** `{name}Selectors.ts` in `model/selectors/`
- **Types:** `{entity}.ts` or `{name}Schema.ts` in `model/types/`
- **Barrel exports:** `index.ts` at slice root — public API only
- **Stories:** `{Component}.stories.tsx` co-located with UI component

### Frontend Directories

- **FSD layers:** lowercase plural (`pages`, `features`, `entities`, `widgets`, `shared`)
- **Slice names:** PascalCase matching domain (`Assistants`, `OperatorAnalytics`, `KnowledgeBases`)
- **UI segments:** `ui/{ComponentName}/` with component file inside

### Backend Files

- **Module files:** `{domain}.module.ts`, `{domain}.controller.ts`, `{domain}.service.ts`, `{domain}.model.ts`
- **DTOs:** `{action}.dto.ts` or `{entity}.dto.ts` in `dto/` subfolder
- **Guards:** `{name}.guard.ts` in module or `auth/`
- **Tasks (cron):** `{name}.task.ts` (e.g. `operator-stuck-reaper.task.ts`)
- **Unit tests:** `{name}.spec.ts` co-located with source
- **Providers:** `{name}.provider.ts` in `providers/` subfolder

### Backend Directories

- **Module folders:** kebab-case (`operator-analytics/`, `ai-tools-handlers/`, `pbx-servers/`)
- **Class names:** PascalCase matching file (`AssistantsService`, `OperatorAnalyticsController`)

## Where to Add New Code

### Frontend — New Feature (user-facing flow)

- Primary UI: `src/features/{FeatureName}/ui/`
- Feature barrel: `src/features/{FeatureName}/index.ts`
- Page wiring: `src/pages/{Name}Page/ui/{Name}Page/{Name}Page.tsx`
- Route: add entry in `src/app/providers/router/config/routeConfig.tsx` + path helper in `src/shared/const/router.ts`
- i18n: `public/locales/en/` and `public/locales/ru/`
- Scaffold: `npm run generate:slice pages {Name}Page` or `features {FeatureName}` (`scripts/createSlice/index.js`)

### Frontend — New Domain Entity

- Slice root: `src/entities/{EntityName}/`
- API: `src/entities/{EntityName}/api/{entityName}Api.ts` — inject into `rtkApi`
- Types: `src/entities/{EntityName}/model/types/`
- List/card UI: `src/entities/{EntityName}/ui/`
- Public exports: `src/entities/{EntityName}/index.ts`
- RTK tag: add to `tagTypes` in `src/shared/api/rtkApi.ts`
- Scaffold: `npm run generate:slice entities {EntityName}`

### Frontend — New UI Component

- New design system: `src/shared/ui/redesign-v3/{Component}/`
- Export from: `src/shared/ui/redesign-v3/index.ts`
- Story: `{Component}.stories.tsx` alongside component
- Do not add to `shared/ui/deprecated/` or `redesigned/` unless explicitly migrating existing UI

### Frontend — New Widget (layout block)

- Location: `src/widgets/{WidgetName}/ui/{WidgetName}/`
- Barrel: `src/widgets/{WidgetName}/index.ts`
- Use in: `pages/` or `app/App.tsx`

### Frontend — Utilities / Hooks

- Shared hooks: `src/shared/lib/hooks/{hookName}/`
- Domain-specific hooks: `src/entities/{Entity}/lib/hooks/`
- Pure functions: `src/shared/lib/functions/`

### Frontend — Tests

- Unit: co-locate `{file}.test.ts(x)` next to source
- Storybook visual: `{Component}.stories.tsx` + Loki
- E2E: `cypress/e2e/`

### Backend — New REST Module

- Module folder: `aiPBX_backend/src/{module-name}/`
- Files: `{module-name}.module.ts`, `.controller.ts`, `.service.ts`, `.model.ts`
- DTOs: `dto/create-{entity}.dto.ts`, `dto/get-{entity}.dto.ts`
- Register: add to `imports` in `src/app.module.ts`
- Auth: `@Roles('ADMIN','USER')` + `@UseGuards(RolesGuard)` on controller methods
- Swagger: `@ApiOperation`, `@ApiResponse` decorators
- Export OpenAPI: `npm run swagger:export` → update frontend `generate:api-types`

### Backend — New Scheduled Job

- Task file: `src/{module}/{name}.task.ts`
- Register as provider in module's `@Module({ providers: [...] })`
- Use `@Cron()` from `@nestjs/schedule`
- Examples: `src/billing/billing-runway.task.ts`, `src/operator-analytics/operator-stuck-reaper.task.ts`

### Backend — New WebSocket Event

- Gateway: extend `src/ws-server/ws-server.gateway.ts` or emit via `EventEmitter2`
- Consumer: service in `playground/`, `open-ai/`, etc.
- Frontend: hook in `src/shared/lib/hooks/` or feature-specific hook

### Backend — Telephony / Voice Changes

- Entry: `src/ari/ari.service.ts`
- Pipelines: `src/open-ai/` (realtime), `src/non-realtime/` (non-realtime)
- Tools: `src/ai-tools-handlers/`
- Billing hook: `src/billing/` + `src/ai-cdr/`
- Requires: explicit phase per `.planning/PROJECT.md`; manual telephony checklist

### Backend — Tests

- Unit: `{service}.spec.ts` co-located in module folder
- E2E: `test/{feature}.e2e-spec.ts`

### Cross-Repo API Change

1. Backend DTO in `aiPBX_backend/src/{module}/dto/`
2. Backend unit test `{service}.spec.ts`
3. Frontend types in `src/entities/{Entity}/model/types/`
4. Frontend RTK endpoint in `src/entities/{Entity}/api/`
5. Regenerate: `npm run swagger:export` (backend) → `npm run generate:api-types` (frontend)

## Special Directories

**`src/shared/ui/deprecated/`:**
- Purpose: Frozen legacy components
- Generated: No
- Committed: Yes
- Rule: Do not add new code

**`src/shared/ui/redesigned/`:**
- Purpose: Active legacy design system (pre-v3)
- Generated: No
- Committed: Yes
- Rule: Use only when matching existing pages; prefer `redesign-v3` for new work

**`src/shared/ui/redesign-v3/`:**
- Purpose: Current design system for all new UI
- Generated: No
- Committed: Yes

**`src/shared/api/generated/`:**
- Purpose: OpenAPI TypeScript types
- Generated: Yes (`npm run generate:api-types`)
- Committed: Yes (regenerate after backend API changes)

**`aiPBX_backend/src/vpbx_users/`:**
- Purpose: Legacy VPBX user model
- Generated: No
- Committed: Yes
- Note: Orphan module — not imported in `app.module.ts`

**`aiPBX_backend/src/ami/`, `vosk-server/`:**
- Purpose: Disabled legacy telephony/STT integrations
- Generated: No
- Committed: Yes
- Note: Commented out in `app.module.ts`

**`.planning/`:**
- Purpose: GSD agent workflow, roadmap, intel, codebase maps
- Generated: Partially by agents
- Committed: Yes

**`public/locales/`:**
- Purpose: i18n JSON namespaces
- Generated: No
- Committed: Yes
- Minimum: `en` + `ru` for all user-facing strings

---

*Structure analysis: 2026-06-24*

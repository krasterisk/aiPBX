# Technology Stack

**Analysis Date:** 2026-06-24

## Languages

**Primary:**
- TypeScript 4.9.5 (frontend, `package.json`) — all application code in `src/`, `config/`, `scripts/`
- TypeScript 5.7.3 (backend, `aiPBX_backend/package.json`) — all NestJS modules in `aiPBX_backend/src/`

**Secondary:**
- JavaScript — build/config scripts (`ecosystem.config.js`, `babel.config.json`, `.eslintrc.js`, GitHub Actions workflows)
- SCSS — component and global styles under `src/**/*.scss`, linted via Stylelint
- SQL — Sequelize migrations and raw queries in `aiPBX_backend/src/config/database.config.ts`, knowledge-base vector queries in `aiPBX_backend/src/knowledge/knowledge.service.ts`

## Runtime

**Environment:**
- Node.js 22 (CI: `.github/workflows/deploy.yml` in both repos use `node-version: 22`)
- Browser (frontend SPA) — Webpack target `es5` (`tsconfig.json`)

**Package Manager:**
- npm (both repos)
- Lockfile: `package-lock.json` present in both `aiPBX/` and `aiPBX_backend/`

## Frameworks

**Core:**
- React 18.2.0 + React DOM — SPA shell (`src/index.tsx`, `src/app/App.tsx`)
- Feature-Sliced Design — layered imports `app → pages → widgets → features → entities → shared` (see `.cursor/rules/frontend-fsd.mdc`)
- NestJS 11 (`@nestjs/core` ^11.0.10) — HTTP API, WebSockets, scheduling, DI (`aiPBX_backend/src/main.ts`, `aiPBX_backend/src/app.module.ts`)
- Express 5 (via `@nestjs/platform-express`) — underlying HTTP server with raw-body support for payment webhooks (`aiPBX_backend/src/main.ts`)

**Testing:**
- Jest 29.4.2 + `@testing-library/react` + jsdom (frontend, `config/jest/jest.config.ts`)
- Jest 29.7.0 + Supertest (backend, `aiPBX_backend/package.json` jest config)
- Cypress 12.12.0 — E2E (`cypress.config.ts`, `npm run test:e2e`)
- Storybook 7 + Loki — component docs and visual regression (`config/storybook/`, `npm run storybook`, `npm run test:ui`)

**Build/Dev:**
- Webpack 5 — **primary** production and dev server (`webpack.config.ts`, `npm run start:dev`, `npm run build:prod`)
- Vite 4 — optional alternate dev entry (`vite.config.ts`, `npm run start:vite`; not used for production)
- `@nestjs/cli` 11 — backend compile (`npm run build` → `dist/`)
- Babel 7 — Webpack/Storybook transpilation (`babel.config.json`)
- Sass 1.57 — SCSS compilation via `sass-loader`

## Key Dependencies

**Critical (frontend):**
- `@reduxjs/toolkit` ^1.9.5 + `react-redux` — global state and RTK Query API layer (`src/shared/api/rtkApi.ts`, `src/app/providers/StoreProvider/`)
- `react-router-dom` ^6.8.0 — client routing (`src/index.tsx`)
- `axios` ^1.8.4 — legacy HTTP client (`src/shared/api/api.ts`)
- `socket.io-client` ^4.8.1 — playground and realtime event streams (`src/features/PlaygroundSession/model/usePlaygroundSession.ts`)
- `i18next` + `react-i18next` + `i18next-http-backend` — i18n with JSON namespaces in `public/locales/` (`src/shared/config/i18n/i18n.ts`)
- `@mui/material` ^7.3.0 + `@emotion/react` — UI components (legacy areas; new UI targets `src/shared/ui/redesign-v3/`)
- `openapi-typescript` — generates `src/shared/api/generated/schema.d.ts` from `../aiPBX_backend/openapi.json`

**Critical (backend):**
- `@nestjs/sequelize` + `sequelize` ^6.37.6 + `sequelize-typescript` — ORM (`aiPBX_backend/src/config/database.config.ts`)
- `pg` ^8.18.0 + `mysql2` ^3.12.0 — database drivers (dialect selected by `DB_DIALECT`)
- `@nestjs/jwt` + `bcryptjs` — auth tokens and password hashing (`aiPBX_backend/src/auth/`)
- `ari-client` ^2.2.0 + `asterisk-manager` — Asterisk telephony integration (`aiPBX_backend/src/ari/`)
- `openai` ^6.22.0 — chat completions, realtime WebSocket proxy (`aiPBX_backend/src/open-ai/`)
- `stripe` ^20.3.1 — payment intents and webhooks (`aiPBX_backend/src/payments/payments.service.ts`)
- `@nestjs/platform-socket.io` + `socket.io` — WebSocket gateway on port 3033 (`aiPBX_backend/src/ws-server/ws-server.gateway.ts`)
- `@nestjs/schedule` — cron tasks (billing runway, operator retention, SBIS closing)
- `@nestjs/throttler` — global rate limit 100 req/min (`aiPBX_backend/src/app.module.ts`)
- `class-validator` + `class-transformer` — DTO validation (`aiPBX_backend/src/main.ts` ValidationPipe)
- `@nestjs/swagger` — OpenAPI docs at `/api/docs` (non-production)

**Infrastructure / media:**
- `vosk-koffi` — local STT (module present but commented out in `app.module.ts`)
- `werift` + `sip.js` — SIP/WebRTC plumbing for trunks and voice paths
- `sharp`, `pdfkit`, `pdf-parse`, `mammoth`, `cheerio` — document processing (knowledge bases, accounting PDFs)
- `@ricky0123/vad-node` — voice activity detection
- `zod` ^4.4.3 — schema validation in operator analytics

## Configuration

**Environment:**
- Frontend: `dotenv` loads `.env.local` then `.env` in `webpack.config.ts`; compile-time defines injected as `__API__`, `__WS__`, `__STRIPE_PUBLISHABLE_KEY__`, etc. (`src/app/types/global.d.ts`)
- Backend: `@nestjs/config` with layered env files via `resolveEnvFilePaths()` in `aiPBX_backend/src/config/env-files.ts` (`.env`, `.development.env`, `.production.env`)
- Canonical env reference: `aiPBX_backend/.env.example` (documents both frontend Docker build args and backend vars)
- `.env` / `.env.local` / `.env.production` files exist on deploy hosts — **never commit secrets**

**Build:**
- Frontend Webpack: `webpack.config.ts` → `config/build/buildWebpackConfig.ts`, `config/build/buildPlugins.ts`, `config/build/types/config.ts`
- Frontend TypeScript: `tsconfig.json` — path alias `@/*` → `src/*`
- Backend TypeScript: `tsconfig.json`, `tsconfig.build.json`, `nest-cli.json`
- Frontend lint/format: `.eslintrc.js`, `.stylelintrc.json`, Prettier 2.8.8
- Backend lint/format: `eslint.config.js` (flat config), Prettier 3.5.1

**API contract:**
- Backend exports OpenAPI via `npm run swagger:export` → `aiPBX_backend/openapi.json`
- Frontend regenerates types: `npm run generate:api-types`

## Platform Requirements

**Development:**
- Node.js 22 recommended (matches CI)
- Frontend: `npm ci && npm run start:dev` (Webpack dev server, default port from `PORT` env or 3000)
- Backend: `npm ci && npm run start:dev` (Nest watch mode)
- Sibling repo layout: `aiPBX/` and `aiPBX_backend/` at same parent directory (required for `generate:api-types` path)
- Optional: Asterisk PBX, PostgreSQL, GPU inference stack (Ollama, Whisper, TTS) for full telephony/AI features

**Production:**
- Three production targets: `aipbxnet_production`, `aipbxorg_production`, `aipbxru_production` (GitHub Actions matrix)
- Deploy trigger: commit message tag `[deploy all]` or `[deploy:1|2|3]` on `master` branch
- Frontend: Docker Compose build on server (`/app/docker-compose.production.yml`, workflow in `aiPBX/.github/workflows/deploy.yml`)
- Backend: SSH deploy + PM2 (`aiPBX_backend/ecosystem.config.js`, workflow in `aiPBX_backend/.github/workflows/deploy.yml`)
- Reverse proxy (nginx) serves frontend static build and proxies `/api` and `/static` to NestJS
- `vercel.json` exists in backend repo — legacy/alternate deploy config, not primary production path

---

*Stack analysis: 2026-06-24*

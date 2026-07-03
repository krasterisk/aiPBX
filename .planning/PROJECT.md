# aiPBX — Full-Stack Project Context

**Product:** Cloud AI PBX / voice assistant platform with speech analytics  
**Company:** Krasterisk LTD  
**Production domains:** aipbx.ru (RUB, Robokassa, SBIS) · aipbx.net · aipbx.org (Stripe)  
**Versions:** Frontend 3.5.3 · Backend 2.3.3  
**Team:** Solo founder, primary market RU B2B (call centers, SMB telephony, Asterisk integrators)

## Repositories

| Repo | Path | Stack |
|------|------|-------|
| Frontend | `c:/Users/Professional/WebstormProjects/aiPBX` | React 18, FSD, RTK Query, Webpack 5 |
| Backend | `c:/Users/Professional/WebstormProjects/aiPBX_backend` | NestJS 11, Sequelize, PostgreSQL, Asterisk ARI |

**API contract:** REST `/api/*` + Socket.IO `:3033`. Types duplicated by convention (no shared package).

## What We Sell Today (RU B2B)

| Product | Value proposition | Readiness |
|---------|-------------------|-----------|
| Voice AI assistant | LLM-powered phone bot via SIP/WebRTC widget | Production |
| Operator Analytics | STT + LLM analysis of call recordings, custom metrics | Production |
| SBIS billing | Invoices, EDO, monthly UPD for legal entities | Production (RU killer feature) |
| Robokassa payments | RUB prepaid balance top-up | Production |
| MCP integrations | Bitrix24, Composio (Gmail, Slack, 250+ apps) | Beta |
| Knowledge Bases | RAG for assistants during calls | Production |
| Dashboard Builder | Custom widgets per analytics project | Partial |

## Architecture Overview

```
Internet → Cloudflare → Nginx → Frontend (static SPA)
                              → Backend NestJS :5005
                                  ├── WebSocket :3033 (playground, events)
                                  ├── UDP RTP :3032 (Asterisk audio)
                                  └── PostgreSQL :5432
                              → GPU services (Whisper STT, Silero/OmniVoice TTS)
```

Voice pipelines:
- **Realtime:** Asterisk → RTP → OpenAI/Qwen/Yandex Realtime WebSocket
- **Non-realtime:** Silero VAD → Whisper STT → Ollama/OpenAI LLM → Silero/OmniVoice TTS

## Frontend Structure (FSD)

```
src/
├── app/       — providers (router, store, theme, error boundary)
├── pages/     — 38 route-level pages
├── widgets/   — Navbar, Menubar, Sidebar, DashboardLayout
├── features/  — 29 feature slices (forms, sessions, dashboards)
├── entities/  — 25 domain entities (API + types + UI)
└── shared/    — api, lib, config, ui (deprecated/redesigned/redesign-v3)
```

**UI rule for agents:** new UI only in `shared/ui/redesign-v3/`.

## Backend Structure

~40 NestJS modules in `src/`. Core: `AriModule` (telephony), `OpenAiModule` + `NonRealtimeModule` (voice AI), `OperatorAnalyticsModule`, `BillingModule`, `AccountingModule` (SBIS).

Disabled modules: `AmiModule`, `VoskServerModule` (commented in `app.module.ts`). Orphan: `VpbxUsersModule`.

## Documentation Layers

| Layer | Location | Audience |
|-------|----------|----------|
| GSD planning | `.planning/` | Agents + founder |
| Intel | `.planning/intel/` | Agents (single source of truth) |
| Dev docs | `docs/` (FE), `docs/` + `.docs/` (BE) | Developers |
| User docs | `public/docs/` (ru/en) | End users in-app |
| Specs/TZ archive | `.idea/` (both repos) | Historical — migrate to intel |
| Deploy | `.agent/workflows/deploy.md` | Ops |

## Agent Rules

1. Any API change → backend DTO + frontend entity types + unit test
2. Do not touch `billing/`, `ari/`, `accounting/` without explicit phase
3. New UI in `redesign-v3` only
4. i18n: ru + en minimum for user-facing strings
5. Definition of Done: lint passes, unit test, manual telephony checklist for voice changes

## Current Focus

Phase 0: Knowledge consolidation + engineering foundation (CI tests, secrets hygiene, intel files).  
Phase 1 (done): Dashboard Insights Upgrade (REQ-01–10).  
Next product phase: onboarding conversion + OA Phase 2 (REQ-11).

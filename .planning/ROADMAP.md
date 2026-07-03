# Roadmap

**Project:** aiPBX full-stack (solo founder, RU B2B)  

**Planning root:** `aiPBX/.planning/` (covers both repos)  

**Codebase map:** `.planning/codebase/` — canonical for implementation truth  

**Intel:** `.planning/intel/` — product inventory (FEATURES, API-MAP, DOCS-INDEX); superseded by `codebase/` where they conflict (see `codebase/RECONCILIATION.md`)

---

## Phase 0: Codebase Map — DONE

**Goal:** GSD-structured codebase understanding for both repos.

**Deliverables:**

- [x] `codebase/STACK.md` — technologies and dependencies

- [x] `codebase/INTEGRATIONS.md` — external services

- [x] `codebase/ARCHITECTURE.md` — system design

- [x] `codebase/STRUCTURE.md` — directory layout

- [x] `codebase/CONVENTIONS.md` — code style

- [x] `codebase/TESTING.md` — test patterns

- [x] `codebase/CONCERNS.md` — tech debt

- [x] `codebase/RECONCILIATION.md` — intel ↔ codebase deltas

**Status:** Executed 2026-06-24 (GSD restart)

**Legacy Phase 0 intel** (manual, 2026-06-24): `intel/*`, GAPS.md, PROJECT.md — retained for product context.

---

## Phase 0b: Engineering Foundation — DONE

**Goal:** Safe agent execution — CI gates, secrets hygiene, observability, OpenAPI codegen.

**GAPs:** GAP-01, GAP-02, GAP-03, GAP-04, GAP-05, GAP-06

**Context:** `.planning/phases/00b-engineering-foundation/00b-CONTEXT.md`  

**Research:** `.planning/phases/00b-engineering-foundation/00b-RESEARCH.md`

| Plan | Wave | Depends on | Scope |

|------|------|------------|-------|

| 00b-01 | 1 | — | CI verification + fix OA unit tests (GAP-01, GAP-02) |

| 00b-02 | 1 | — | Secrets hygiene + `.env.example` (GAP-03, GAP-04) |

| 00b-03 | 2 | 00b-01, 00b-02 | Sentry verify + OpenAPI DTO + CI codegen + STATE (GAP-05, GAP-06) |

**Cross-cutting constraints:**

- Do not revert manual Sentry/CI work — verify and complete

- Both repos: `aiPBX` + `aiPBX_backend`

- No telephony/billing/ari changes

**Status:** Executed 2026-06-24

---

## Phase 1: Dashboard Insights Upgrade — DONE

**Goal:** Structured, grounded, tenant-safe AI insights end-to-end.

**Requirements:** REQ-01 through REQ-10 (see `REQUIREMENTS.md`)  

**Executed:** 2026-06-19 (3 plans, 3 waves)  

**Repos:** aiPBX + aiPBX_backend

| Plan | Wave | Status |

|------|------|--------|

| 01-01 | 1 | Done — schema, facts builder, prompt |

| 01-02 | 2 | Done — service unification, tests |

| 01-03 | 3 | Done — frontend AiInsightsBanner + i18n |

**Deferred:** REQ-11 → Phase 3

---

## Phase 2: Onboarding Conversion — DONE

**Goal:** New user reaches first successful call/analysis in ≤15 minutes — **both products**.

**GAPs:** GAP-10, GAP-16, GAP-14

| Task | Impact |

|------|--------|

| Dual-product onboarding fork (Assistants / Speech Analytics) | H |

| Assistants: Playground call → trunk/widget next steps | H |

| Analytics: ProjectWizard onboarding → first analysis → dashboard tour | H |

| GA4 / Яндекс.Метрика funnel goals (both paths) | H |

| Docs screenshots (real captures or UI mocks) | M |

**Context:** `.planning/phases/02-onboarding-conversion/02-CONTEXT.md`  
**Research:** `.planning/phases/02-onboarding-conversion/02-RESEARCH.md`  
**Validation:** `.planning/phases/02-onboarding-conversion/02-VALIDATION.md`  

| Plan | Wave | Depends on | Scope | Status |
|------|------|------------|-------|--------|
| 02-01 | 1 | — | Product fork, state, analytics helper, re-entry | Done |
| 02-02 | 2 | 02-01 | Assistants: SimpleExample, Playground success, trunk/widget | Done |
| 02-03 | 2 | 02-01 | Analytics: project wizard, upload, dashboard tour | Done |
| 02-04 | 3 | 02-02, 02-03 | Screenshots, funnel docs, tests, STATE | Done |

**Status:** Executed 2026-06-25 (4 plans, waves 1–3)

---

## Phase 3: Operator Analytics Phase 2

**Goal:** Complete OA product — drill-down, builder, custom metrics.

**GAPs:** GAP-11, GAP-12, GAP-13, GAP-17  

**Requirements:** REQ-11 (drill-down, Redis cache, offline eval)

| Task | Impact |

|------|--------|

| `aggregatedCustomMetrics` backend endpoint | H |

| Dashboard Builder widgets completion | H |

| Insights drill-down to CDR | H |

| Usage billing table in reports UI | M |

| Redis insights cache | M |

---

## Phase 4: Go-to-Market (RU B2B)

**Goal:** Organic traffic + conversion for aipbx.ru.

**GAPs:** GAP-15, GAP-40–46

| Task | Impact |

|------|--------|

| Prerender/SSR for landing pages | H |

| sitemap.xml, robots.txt, per-page meta (ru) | H |

| Demo call CTA on landing | H |

| Blog/case studies (agent drafts, founder publishes) | H |

| Telegram channel setup | M |

| Partner outreach to Asterisk integrators | H (founder-led) |

---

## Phase 5: UI Consolidation

**Goal:** Single design system, reduce agent confusion.

**GAPs:** GAP-28, GAP-27

| Task | Effort |

|------|--------|

| Migrate active pages to redesign-v3 | L |

| Deprecate `shared/ui/deprecated/` | M |

| Remove Vite or make it primary (decision needed) | M |

---

## Phase 6: Platform Hardening

**GAPs:** GAP-20–30

| Task | Priority |

|------|----------|

| Widget audio buffer fix (GAP-20) | P2 |

| Interrupt response UI (GAP-21) | P2 |

| E2E smoke tests in CI | P2 |

| Enable ValidationPipe on all controllers | P2 |

| Wire or remove VpbxUsersModule | P3 |

---

## Phase 7: Helpdesk — AI-first admin ticket system (Krasterisk)

**Goal:** Административный модуль учёта и обработки заявок клиентов (helpdesk) во фронтенде и бэкенде, с приёмом обращений через голосовых ассистентов/чат-ботов, интеграцией с базой клиентов alfawebhook и LLM-контекстом для быстрого решения проблем.

**GAPs:** GAP-25 (Admin page stub), new capability (no prior GAP)

**Depends on:** Phase 0b (complete); existing `assistants/`, `ai-tools/`, `ai-tools-handlers/`, `mcp-client/`, `api-keys/` modules

**Context:** `.planning/phases/07-helpdesk-admin-ticket-system-with-ai-intake-alfawebhook-clie/07-CONTEXT.md`

**Repos:** `aiPBX` (admin UI, FSD) + `aiPBX_backend` (NestJS module, PostgreSQL)

### Scope

| Area | Deliverable |
|------|-------------|
| Backend DB | PostgreSQL: tickets, messages, status history, client links, LLM context notes |
| Backend API | `HelpdeskModule` — CRUD (admin), AI tool endpoints (API key auth) |
| Client lookup | REST API alfawebhook `GET /api/clients` по INN/названию; облачные клиенты — баланс через `pbxUrl` |
| AI intake | Webhook tools + built-in handlers (identify client, get info, create ticket, search LLM context) |
| LLM notes | Per-client rolling context (история обращений, примечания, snapshot) — injectable в промпт ассистента |
| Frontend | Admin раздел: список заявок, карточка, фильтры, примечания, LLM-контекст (redesign-v3) |
| Standalone doc | `.planning/scenarios/krasterisk-helpdesk-voice-assistant.md` — промпт, настройка ассистента, webhooks, чеклист |
| Standalone script | `scripts/pbx-remote-handler/` — универсальный CLI: AMI, SIP registrations, DB (не часть модуля) |

### Out of scope (this phase module)

- Прямое подключение к MySQL alfawebhook (только REST API)
- Изменения `billing/`, `ari/`, `accounting/` без явной задачи в плане
- Production deploy голосового ассистента Крастериск (описывается в standalone-сценарии)

### Suggested plan breakdown (for `/gsd-plan-phase 7`)

| Plan | Wave | Scope |
|------|------|-------|
| 07-01 | 1 | Backend: Sequelize models, migrations, admin CRUD API, AlfawebhookClient read |
| 07-02 | 2 | AI tools endpoints, LLM context service, ticket auto-create from voice/chat |
| 07-03 | 2 | Frontend: entity + admin pages (ticket list, detail, notes) |
| 07-04 | 3 | Standalone: Krasterisk voice scenario doc + pbx-remote-handler CLI skeleton |

**Status:** Executed (2026-07-03) — 4/4 plans complete; see `07-01`…`07-04-SUMMARY.md`

**Plans:** 4/4

| Plan | Wave | Depends on | Scope |
|------|------|------------|-------|
| 07-01 | 1 | — | Backend: models, migration, admin CRUD, alfawebhook search |
| 07-02 | 2 | 07-01 | AI tools, LLM context, notifications, PBX agent proxy |
| 07-03 | 2 | 07-01 | Frontend: entity, list (table+kanban), detail, routes |
| 07-04 | 3 | 07-02, 07-03 | Voice scenario doc + pbx-remote-handler CLI |

### Phase 8: User docs overhaul — menu-by-menu актуализация

**Goal:** Полностью актуализировать пользовательскую документацию `public/docs/` (ru + en): пройти каждый пункт меню (кроме «Управление»), описать реальный функционал простым языком, дополнить разделы по аналитике, обновить макеты страниц.

**GAPs:** GAP-14 (docs screenshots), product docs debt (нет разделов: Звонки, Базы знаний, OA Проекты/API, SIP Trunks)

**Depends on:** Phase 2 (screenshot pipeline), Phase 3 (актуальная аналитика для описания)

**Context:** `.planning/phases/08-user-docs-overhaul-menu-by-menu-public-docs-ru-en/08-CONTEXT.md`

**Repos:** `aiPBX` only (`public/docs/`, `scripts/capture-docs-screenshots.ts`, `DocumentationLayout`)

### Scope — покрытие по меню (без «Управление»)

| Меню | Подпункты | Документ / действие |
|------|-----------|---------------------|
| Дашборды | Сводный, Аналитика ботов, Аналитика звонков | Расширить `06-dashboards.md` — три экрана, метрики, AI insights, drill-down |
| Звонки | — | **Новый** `09-calls.md` — журнал, фильтры, карточка звонка, связь с аналитикой |
| AI Боты | Ассистенты | Актуализировать `02-assistants.md` |
| | Песочница | Актуализировать `05-playground.md` |
| | Функции | Актуализировать `03-tools.md` |
| | MCP Серверы | Актуализировать `04-mcp-servers.md` |
| | Базы знаний | **Новый** `10-knowledge-bases.md` — RAG, загрузка, привязка к ассистенту |
| | Публикация → SIPs, SIP Trunks, Виджеты | Расширить `07-publish.md` (отдельно транки и виджеты) |
| Аналитика | Проекты, API | **Новый** `11-operator-analytics.md` — проекты, метрики, загрузка, API-токены |
| Оплата | — | Актуализировать `08-payments.md` (Robokassa, SBIS, баланс) |
| Пользователи | (owner, не admin) | Добавить в `01-getting-started.md` или отдельный подраздел |

**Исключено:** раздел «Управление» (пользователи admin, модели, цены, организации, helpdesk, PBX, AI чаты).

### Качество контента

- Язык для новичка: пошаговые сценарии «что нажать → что увидите → что дальше»
- Без шаблонных AI-фраз и длинных тире (—); живой русский/английский
- Скриншоты: HTML-макеты реальных страниц (`form-mockup` + `scripts/capture-docs-screenshots.ts`), не stock-фото
- Синхронизация `ru/` и `en/`; обновить `README.md` оглавление в обоих языках
- Перекрёстные ссылки между разделами (ассистент → песочница → публикация → звонки → дашборд)

### Suggested plan breakdown (for `/gsd-plan-phase 8`)

| Plan | Wave | Depends on | Scope |
|------|------|------------|-------|
| 08-01 | 1 | — | Doc nav mirror menubar, i18n, README, stubs, legacy cleanup |
| 08-02 | 2 | 08-01 | AI Боты block + KB + publish + screenshots |
| 08-03 | 2 | 08-01 | Dashboards + Calls + Operator Analytics + API embed |
| 08-04 | 3 | 08-02, 08-03 | Payments, de/zh parity, DOCS-INDEX, GAP-14 |

**Status:** Executed (2026-07-03) — 4/4 plans complete; see `08-01`…`08-04-SUMMARY.md`

**Plans:** 4/4

| Plan | Wave | Depends on | Scope |
|------|------|------------|-------|
| 08-01 | 1 | — | DOC_SECTIONS mirror menubar, docs.json 4 locales, README, remove root duplicates |
| 08-02 | 2 | 08-01 | Assistants, tools, MCP, playground, KB, publish + PNG mocks |
| 08-03 | 2 | 08-01 | 06-dashboards, 09-calls, 11-operator-analytics + API reference |
| 08-04 | 3 | 08-02, 08-03 | 08-payments, locale audit, tone pass, DOCS-INDEX, GAP-14 |

Plans:

- [x] 08-01-PLAN.md — nav + i18n foundation ✓
- [x] 08-02-PLAN.md — AI Bots documentation ✓
- [x] 08-03-PLAN.md — Analytics + Calls documentation ✓
- [x] 08-04-PLAN.md — Payments + parity + closeout ✓

**Cross-cutting constraints:**

- Content tone: operator-first, integrator blocks in publish/analytics only (D-10)
- No admin docs; no em-dash / AI clichés in RU copy (D-12)
- Illustrations: form-mockup + HTML PNG mocks (D-07, D-08)

---

## Weekly agent cycle (from Phase 0b onward)

```

Mon: pick 1 GAP → /gsd-discuss-phase

Tue: /gsd-plan-phase → review plan

Wed–Fri: /gsd-execute-phase → review PRs

Fri: /gsd-verify-work → deploy by tag

```

Founder time: 60% sales/demos, 40% agent review.

# DOCS-INDEX — Documentation Registry

Last updated: 2026-06-24.  
**Rule for agents:** prefer `.planning/intel/` over `.idea/` archives. Use `.idea`/`.docs` only for implementation details not yet migrated.

## Legend

| Status | Meaning |
|--------|---------|
| **ACTIVE** | Current, use for development |
| **USER** | End-user facing in-app |
| **ARCHIVE** | Historical spec/plan — verify against code before trusting |
| **OPS** | Operations/deployment only |

---

## GSD Planning (ACTIVE — primary for agents)

| File | Status | Content |
|------|--------|---------|
| `.planning/PROJECT.md` | ACTIVE | Full-stack context, agent rules |
| `.planning/ROADMAP.md` | ACTIVE | Phase roadmap |
| `.planning/GAPS.md` | ACTIVE | Prioritized backlog |
| `.planning/REQUIREMENTS.md` | ACTIVE | REQ-01–11 (Insights phase) |
| `.planning/STATE.md` | ACTIVE | Current execution state |
| `.planning/intel/FEATURES.md` | ACTIVE | Feature inventory |
| `.planning/intel/ARCHITECTURE.md` | ACTIVE | System design |
| `.planning/intel/API-MAP.md` | ACTIVE | FE↔BE contract |
| `.planning/intel/RISKS.md` | ACTIVE | Security/ops risks |
| `.planning/intel/DOCS-INDEX.md` | ACTIVE | This file |
| `.planning/phases/01-dashboard-insights-upgrade/*` | ARCHIVE | Phase 1 executed 2026-06-19 |

---

## Frontend `docs/` (ACTIVE — dev + design)

Path: `aiPBX/docs/` — 14 files

| File | Content |
|------|---------|
| `README.md` | Platform overview, glossary |
| `01-getting-started.md` | Quick start |
| `02-assistants.md` | Assistant guide |
| `03-tools.md` | Function calling |
| `04-mcp-servers.md` | MCP / Composio |
| `05-playground.md` | Sandbox testing |
| `06-dashboards.md` | Dashboard guide |
| `07-publish.md` | SIP, widgets, PBX |
| `08-payments.md` | Billing guide |
| `design-system.md` | Glassmorphism design system |
| `DESIGN_SYSTEM_QUICKSTART.md` | SCSS mixin quickstart |
| `DESIGN_SYSTEM_SUMMARY.md` | 380+ vars, 60+ mixins |
| `color-palette.md` | Light/dark palette |
| `theme-variables-guide.md` | CSS variable reference |

---

## Frontend `public/docs/` (USER — in-app documentation)

Path: `aiPBX/public/docs/` — 29 files

| Path | Content |
|------|---------|
| `README.md` | TOC (legacy root) |
| `01–08.md` | Root copies (legacy) |
| `en/README.md`, `en/01–08.md` | English user docs |
| `ru/README.md`, `ru/01–08.md` | Russian user docs |
| `screenshots/README.md` | **Placeholders only** — GAP-14 |

Displayed at `/docs` via `DocsPage`. Mirrors `docs/` content without design-system files.

---

## Frontend `.idea/` (ARCHIVE — specs & infra)

Path: `aiPBX/.idea/` — 21 markdown + IDE XML

### Feature specs (verify implementation status in code)

| File | Topic | Likely status |
|------|-------|---------------|
| `non-realtime-frontend-spec.md` | Pipeline mode UI | Done |
| `omnivoice-frontend-spec.md` | OmniVoice/Gemma4 | Done — see report |
| `omnivoice-frontend-implementation-report.md` | Implementation report | Done |
| `knowledge-bases-frontend-spec.md` | KB UI | Done |
| `knowledge-base-tool-integration.md` | KB ↔ Tool binding | Done |
| `chats-frontend-spec.md` | Helpdesk chats UI | Done |
| `batch-frontend-spec.md` | Batch upload UI | Done |
| `robokassa-frontend-prompt.md` | Robokassa UX | Done |
| `frontend_usage_prompt.md` | Usage table in reports | **Not done** GAP-17 |
| `frontend_interrupt_response_spec.md` | VAD interrupt UI | **Not done** GAP-21 |
| `frontend_ai_insights_prompt.md` | AiInsightsBanner | Done (Phase 1) |
| `ia_insights_plan` | Insights without project | Superseded by Phase 1 |

### Architecture & roadmap

| File | Topic |
|------|-------|
| `dashboards_architecture.md` | FSD dashboard structure |
| `dashboard_builder_roadmap.md` | Widget builder roadmap |
| `dynamic-analytics-plan copy.md` | Project-centric OA v2 |
| `implementation_plan.md` | Dashboard/preview/insights integration |
| `public_api_docs.md.resolved` | Public OA API reference |

### Infrastructure

| File | Topic |
|------|-------|
| `vps-setup-guide.md` | VPS setup aipbx.ru |
| `yandex-cloud-cdn-setup.md` | Yandex CDN |
| `yandex-cdn-deploy-plan.md` | CDN deploy plan |
| `remove-cdn-plan.md` | CDN removal plan |

### IDE config

| File | Purpose |
|------|---------|
| `jsLinters/eslint.xml` | ESLint fix-on-save |
| `inspectionProfiles/Project_Default.xml` | ESLint WARNING, Stylelint ERROR |
| `i18nSettings.xml` | JSON localization |

---

## Backend `docs/` (ACTIVE — ops & billing)

Path: `aiPBX_backend/docs/` — 4 files

| File | Content |
|------|---------|
| `SBIS_EDO_FIELDS.md` | EDO field mapping, status codes |
| `BILLING_LEGAL_ENTITIES.md` | USD ledger, FX, UPD closing |
| `OPERATOR_ANALYTICS_ENV.md` | All OPERATOR_* env vars |
| `MIGRATION_AIPBXNET.md` | aipbx.net migration runbook |

---

## Backend `.docs/` (ACTIVE — architecture & integration)

Path: `aiPBX_backend/.docs/` — 11 files

| File | Content | Status |
|------|---------|--------|
| `EVENT-ROUTING-ARCHITECTURE.md` | Playground vs ARI events | ACTIVE |
| `PLAYGROUND-EVENT-ROUTING.md` | Implementation details | ACTIVE |
| `PLAYGROUND-EVENT-ROUTING-SUMMARY.md` | Changed files list | ARCHIVE |
| `EVENT-ROUTING-TEST-CHECKLIST.md` | QA checklist | ACTIVE |
| `TESTING-CHECKLIST.md` | Playground v1.2 tests | ARCHIVE |
| `QUICKFIX-CHANGELOG.md` | cdrHangup fix | ARCHIVE |
| `MCP_INTEGRATION.md` | Ephemeral MCP in chat | ACTIVE |
| `API_KEYS.md` | API key creation/scopes | ACTIVE |
| `composio-integration-plan.md` | Composio plan | Done |
| `robokassa-integration.md` | Robokassa backend design | ACTIVE |
| `frontend_refactoring_prompt.md` | Billing breakdown UI | **Not done** GAP-17 |

---

## Backend `.idea/` (ARCHIVE — overlaps with FE `.idea`)

Path: `aiPBX_backend/.idea/` — 19 markdown + IDE XML

| File | Content | Duplicates FE? |
|------|---------|----------------|
| `deploy_architecture.md` | 3-server deploy matrix | No |
| `voice-pipeline-architecture.md` | Realtime vs non-realtime | No |
| `non-realtime-pipeline-plan.md` | Non-realtime implementation | No |
| `non-realtime-frontend-spec.md` | FE pipeline UI | Yes (FE `.idea`) |
| `whisper-migration-plan.md` | Whisper HTTP migration | No |
| `knowledge-base-architecture.md` | RAG evaluation | No |
| `knowledge-base-implementation.md` | KB implementation walkthrough | No |
| `knowledge-base-tool-integration.md` | KB ↔ Tool | Yes |
| `knowledge-bases-frontend-spec.md` | KB UI spec | Yes |
| `chats-frontend-spec.md` | Chats UI spec | Yes |
| `batch-frontend-spec.md` | Batch upload spec | Yes |
| `dashboard_builder_roadmap.md` | Builder roadmap | Yes |
| `dynamic-analytics-plan copy.md` | OA v2 architecture | Yes |
| `implementation_plan.md` | Dashboard integration | Yes |
| `domain-migration-plan.md` | Domain swap plan | No |
| `backend-tts-walkthrough.md` | TTS voice upload done | No |
| `tts_voice_upload_plan.md` | TTS upload plan | No |
| `telegram-proxy-instruction.md` | TELEGRAM_PROXY socks5 | No |
| `robokassa-frontend-prompt.md` | Robokassa FE | Yes |

---

## Other documentation

| File | Location | Content |
|------|----------|---------|
| `deploy.md` | `aiPBX/.agent/workflows/` | Full production deploy guide (~1000 lines) OPS |
| `implementation_plan.md` | `aiPBX/.agent/` | Assistant form refactor (PipelineCard, VadSettings) ARCHIVE |
| `.env.example` | `aiPBX_backend/` | All env vars, feature flags ACTIVE |
| `README.md` | `aiPBX/` | Minimal, outdated GAP-52 |
| `README.md` | `aiPBX_backend/` | One line only |

---

## Duplication map (consolidate over time)

These topics exist in 2–3 places — intel files are canonical:

| Topic | Canonical | Also in |
|-------|-----------|---------|
| Feature list | `intel/FEATURES.md` | menubar, routeConfig |
| API contract | `intel/API-MAP.md` | entity *Api.ts files |
| Voice pipeline | `intel/ARCHITECTURE.md` | BE `.idea/voice-pipeline-architecture.md` |
| Dashboard builder | `GAPS.md` GAP-13 | FE+BE `.idea/dashboard_builder_roadmap.md` |
| Deploy | `.agent/workflows/deploy.md` | BE `.idea/deploy_architecture.md` |
| Operator analytics env | BE `docs/OPERATOR_ANALYTICS_ENV.md` | `.env.example` |
| Insights requirements | `.planning/REQUIREMENTS.md` | Phase 1 plans |

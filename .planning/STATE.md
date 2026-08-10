---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 11
current_plan: 3
status: in_progress
stopped_at: Completed 11-02-PLAN.md
last_updated: "2026-08-10T09:45:00.000Z"
last_activity: 2026-08-10
progress:
  total_phases: 11
  completed_phases: 10
  total_plans: 47
  completed_plans: 34
---

# Project State

**Project:** aiPBX (full-stack)  

**Status:** Executing Phase 11

**Current Phase:** 11

**Current Plan:** 3

**Last Activity:** 2026-08-10

**Stopped At:** Completed 11-02-PLAN.md

## Accumulated Context

### Decisions

- [GAP-34]: Critical alerts use project.alertConfig (inherit recipients from digest by default); Email+Telegram via OperatorAlertService; product path independent of OPERATOR_ANOMALY_ENABLED; POST …/alerts/test with 5‑min cooldown; domain-aware bots via getAipbxTelegramBot (RU=@AIPBXRUbot)
- [GAP-33]: Analytics digest uses project.digestConfig + hourly cron; charts via SVG→sharp PNG; manual send allowed even if schedule disabled
- [GAP-35]: callTaxonomy auto-tags via LLM closed-set `topic_tag_ids` in analysis schema (PROMPT_VERSION 2026-08-05.1); D-18 keyword matching superseded; aliases = optional prompt hints; description preferred; manual PATCH + regenerate merge unchanged
- [Phase 10]: Tag panel stack entry carries full TagStat so card and panel D-16 figures stay aligned
- [Phase 10]: Topics not-configured empty state links to getRouteAnalyticsProjects() route constant
- [Phase 10]: Re-analysis deletes operator_call_tags where source=auto only; manual PATCH replaces full tag set
- [Phase 10]: Taxonomy writes skip currentSchemaVersion bump; validated via TagDefinitionDto + service validateCallTaxonomy
- [Phase 10]: operator_call_tags table dual-dialect with channelId+tagId uniqueness; tags never in operator_metric_values
- [Phase 10]: operatorNameExact short-circuits substring operatorName in buildDashboardCdrWhere
- [Phase 09]: Prerender via @prerenderer/webpack-plugin + seo-render-ready (not react-snap)
- [Phase 09]: Docker EU builder uses apt chromium + PUPPETEER_EXECUTABLE_PATH; SITE_URL/GA4/Ads as build ARGs
- SITE_URL defaults to https://aipbx.net at build time; never window.location.origin (D-02/D-03)
- Ads IDs empty-string default locally; real values documented in .env.example as public client IDs
- .env.example force-added despite .env.* gitignore so plan artifact is tracked
- [Phase 09]: lastmod set to 2026-07-21 (execution day) rather than patch 2026-07-20
- [Phase 09]: OG card via System.Drawing branded template matching logo cyan/violet (exact 1200x630)
- [Phase 09]: Consent Mode v2 documented as P1 founder decision; no CMP in 09-08
- [Phase 09]: Ads draft optimizes to signup_complete label -B6_CK72wtMcEIyDxKA-; other events observation-only
- [Phase 09]: Campaign launch gated on 09-07 prerender verify for Quality Score
- [Phase 09]: Canonical/og/hreflang from __SITE_URL__; RU alternate on aipbx.ru (D-01/D-02)
- [Phase 09]: useSeoRenderReady dispatches seo-render-ready for prerender gate
- [Phase 09]: Ads config runs in a separate guarded block after GA4 init (requires window.gtag)
- [Phase 09]: fireAdsConversion never dual-dispatches to Metrika; no PII in conversion params
- [Phase 09]: SEO patch applied as baseline not verbatim — RU meta preserved in ru/main.json
- [Phase 09]: index.html Organization JSON-LD site-wide; per-page SoftwareApplication via usePageMeta
- [Phase 09]: HtmlWebpackPlugin siteUrl from 09-01 chain for index.html canonical/OG
- [Phase 09]: No gtag in index.html — analytics remains initAnalytics (09-03)
- [Phase 09]: payment_success on BillingPage verified success (alternate-return-route), not PaymentPage
- [Phase 09]: first_call emitted alongside playground_call_success
- [Phase 09]: signup Ads conversion only on google/telegram/email-activation success
- [Phase ?]: Evidence endpoint has no response cache in wave 1
- [Phase ?]: operatorNameExact short-circuits substring operatorName in buildDashboardCdrWhere
- [Phase ?]: SidePanel backLabel prop keeps shell OA-agnostic while showing visible back context
- [Phase ?]: PanelEntry tag variant includes tagName for title and back label resolution
- [Phase ?]: D-25 wins: AiInsightsBanner renders after Stats row
- [Phase ?]: String() project id comparison fixes deep-link without type ripple
- [Phase ?]: OperatorPanelBody expand mode kept for isolated tests; dashboard pushes operatorMetric via onSelectMetric
- [Phase ?]: TagStat type ships D-16 fields for 10-08 theme panel
- [Phase 10]: tagStats aggregated in getDashboard from _topics.tags with single findByPk reuse; omitted without taxonomy, [] when no matches
- [Phase ?]: CallTagChips in entities/Report; tag edit on call card only; export formula guard scoped to Теги column
- [Phase ?]: Connecting timeout fixed at 18s per UI-SPEC (D-41)
- [Phase ?]: Playground mobile uses matchMedia max-width 899px not useDevice alone
- [Phase ?]: Setup/Debug remain stub drawers until 11-02/11-03
- [Phase ?]: Canonical Playground write path is entity assistantForm + useUpdateAssistant; playgroundAssistantForm removed
- [Phase ?]: Feature→feature AssistantSettingsForm import uses documented layer-imports eslint-disable (A5)

### Roadmap Evolution

- **2026-08-07:** Phase 11 added — Playground UX redesign for voice assistant testing: keep functionality, rethink IA/hierarchy so testing flow is simple and readable (current page oversaturated / hard to scan)
- **2026-07-29:** Phase 10 context gathered via `/gsd-discuss-phase 10` — side-panel operator/topic drill-down, remove Usage+volume charts from fixed OA, project taxonomy tags + Themes section (D-01…D-30 in `10-CONTEXT.md`)
- **2026-07-29:** Phase 10 added — Speech analytics UX overhaul: OperatorDashboard refactor, remove analytics costs section, operator rating drill-down (metrics → scores → calls), call tagging + topic/tag reports with record-level drill-down; closes/extends GAP-11 drill-down debt
- **2026-07-21:** Phase 9 plan 09-07 executed — `@prerenderer/webpack-plugin` prerender + verify-prerender + Docker Chromium for EU (D-04)
- **2026-07-21:** Phase 9 plan 09-05 executed — GA4 funnel (signup_complete/page_view/first_call/payment_success) + Ads signup conversion (D-06/D-07)
- **2026-07-21:** Phase 9 plan 09-04 executed — i18n landing meta/JSON-LD/METRICS + demo CTA + index.html base meta (D-01/D-08/D-09)
- **2026-07-21:** Phase 9 plan 09-03 executed — initAnalytics Ads config + fireAdsConversion + mock-gtag tests (D-06/D-07)
- **2026-07-21:** Phase 9 plan 09-02 executed — usePageMeta SITE_URL canonical/hreflang/JSON-LD + useSeoRenderReady + jsdom tests (D-01/D-02)
- **2026-07-21:** Phase 9 plan 09-08 executed — `09-SEO-AUDIT.md` (D-11) + `09-ADS-ASSETS.md` (D-10) EN Search draft
- **2026-07-21:** Phase 9 plan 09-01 executed — `__SITE_URL__` / `__GOOGLE_ADS_ID__` / `__ADS_SIGNUP_LABEL__` DefinePlugin chain + Jest globals + `.env.example`
- **2026-07-21:** Phase 9 added — Landing SEO + Google Ads (aipbx.net): apply `scripts/aipbx_seo.patch`, meta/OG/JSON-LD, react-snap prerender, GA4+Ads conversion, Search Console; closes GAP-15/40/16 for .net EN market (parallel to Phase 4 RU GTM)
- **2026-07-03:** Phase 8 executed — user docs overhaul: menubar-aligned `/docs` nav, ru/en/de/zh, 09-11 new sections, 14 screenshot mocks, GAP-14
- **2026-07-03:** Phase 8 context gathered via `/gsd-discuss-phase 8` — mirror menubar in docs nav, ru/en/de/zh, hybrid illustrations, layered audience, embedded OA API reference, remove legacy root md duplicates
- **2026-07-03:** Phase 8 added — User docs overhaul: menu-by-menu актуализация `public/docs` (ru+en), аналитика, макеты страниц; без раздела «Управление»
- **2026-07-03:** Phase 7 added — Helpdesk: AI-first admin ticket system (Krasterisk), alfawebhook client lookup via REST, LLM context notes, voice assistant scenario doc, pbx-remote-handler CLI
- **2026-07-03:** Phase 7 context gathered via `/gsd-discuss-phase 7` — 34 implementation decisions locked in `07-CONTEXT.md`

## GSD Restart (2026-06-24)

| Event | Status |

|-------|--------|

| `/gsd-map-codebase` (7 docs + RECONCILIATION) | Complete |

| Manual `intel/` superseded for code facts | `codebase/` canonical where conflict |

| `/gsd-discuss-phase 0b` (assumptions --auto) | Complete → `00b-CONTEXT.md` |

| `/gsd-plan-phase 0b` | Complete — 3 plans, 2 waves |

| `/gsd-discuss-phase 2` | **Complete** — 2026-06-24 → `02-CONTEXT.md` |
| `/gsd-plan-phase 2` | **Complete** — 4 plans (02-01–04), waves 1–3 |

### Codebase map (canonical for implementation)

| File | Lines (approx) | Purpose |

|------|----------------|---------|

| `codebase/STACK.md` | 117 | Dual-repo stack |

| `codebase/INTEGRATIONS.md` | 170 | External services |

| `codebase/ARCHITECTURE.md` | 326 | System design |

| `codebase/STRUCTURE.md` | 375 | Directory layout |

| `codebase/CONVENTIONS.md` | 320 | Code style |

| `codebase/TESTING.md` | 560 | Test patterns |

| `codebase/CONCERNS.md` | 328 | Tech debt |

| `codebase/RECONCILIATION.md` | — | intel ↔ codebase deltas |

### Intel (retained for product inventory)

`intel/FEATURES.md`, `API-MAP.md`, `DOCS-INDEX.md`, `RISKS.md`, `GTM-CONTENT-PLAN.md` — still valid for feature/API/docs context; code-verified facts defer to `codebase/`.

## Phase 0 — Knowledge Consolidation

| Field | Value |

|-------|-------|

| Status | Superseded by GSD codebase map (2026-06-24) |

| Legacy deliverables | `intel/` + GAPS + PROJECT + ROADMAP |

## Phase 0b — Engineering Foundation

| Field | Value |

|-------|-------|

| Status | **Executed** — 2026-06-24 |

| Plans | 00b-01 ✅ CI gates + green tests, 00b-02 ✅ secrets/env, 00b-03 ✅ Sentry docs + OpenAPI pipeline |
| Verification | FE `lint:ts` + `test:unit` green; BE `npm test` 589/589; `openapi:export` + `generate:api-types` wired in CI |
| Next | Phase 2 per ROADMAP.md (onboarding) or user-selected phase |

## Phase 2 — Onboarding Conversion

| Field | Value |
|-------|-------|
| Status | **Executed** — 2026-06-25 |
| Plans | 02-01 ✅ fork shell, 02-02 ✅ assistants path, 02-03 ✅ analytics path, 02-04 ✅ screenshots + funnel docs + tests |
| Context | `.planning/phases/02-onboarding-conversion/02-CONTEXT.md` |
| Research | `.planning/phases/02-onboarding-conversion/02-RESEARCH.md` |
| Validation | `.planning/phases/02-onboarding-conversion/02-VALIDATION.md` |
| Verification | FE `test:unit` green (Onboarding tests); docs screenshots in `public/docs/screenshots/`; funnel doc `docs/ONBOARDING_ANALYTICS.md` |
| Next | Phase 3 per ROADMAP.md (Operator Analytics Phase 2) |

## Phase 9 — Landing SEO + Google Ads (aipbx.net)

| Field | Value |
|-------|-------|
| Status | **Executed** — 2026-07-21 (8/8 plans) |
| Directory | `.planning/phases/09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso/` |
| Plans | 09-01 ✅ build-constant chain; 09-02 ✅ usePageMeta SEO head; 09-03 ✅ Ads initAnalytics + fireAdsConversion; 09-04 ✅ landing i18n meta/CRO; 09-05 ✅ GA4 funnel + Ads conversion; 09-06 ✅ sitemap/OG; 09-08 ✅ SEO audit + Ads assets; 09-07 ✅ prerender + verify gate |
| Next | Founder: Rich Results + OG debugger after [deploy:1]; phase verify/UAT |

## Phase 7 — Helpdesk (AI-first admin ticket system)

| Field | Value |
|-------|-------|
| Status | **Executed** — 2026-07-03 (4/4 plans) |
| Directory | `.planning/phases/07-helpdesk-admin-ticket-system-with-ai-intake-alfawebhook-clie/` |
| Plans | 07-01 ✅ schema+CRUD, 07-02 ✅ AI tools+notifications+PBX proxy, 07-03 ✅ admin UI, 07-04 ✅ voice scenario doc + pbx-remote-handler |
| Context | `07-CONTEXT.md` (34 decisions) |
| Voice setup | `.planning/scenarios/krasterisk-helpdesk-voice-assistant.md` |
| PBX agent CLI | `scripts/pbx-remote-handler/` |
| Next | Manual: apply DB migration, openapi export, configure helpdesk_settings + pbx_connections |

## Phase 1 — Dashboard Insights Upgrade

| Field | Value |

|-------|-------|

| Status | Executed |

| Date | 2026-06-19 |

| Plans | 3/3 |

## Performance Metrics

| Phase | Plan | Duration | Notes |
|-------|------|----------|-------|
| Phase 09 P06 | 8min | 2 tasks | 3 files |
| Phase 09 P08 | 12min | 2 tasks | 2 files |
| Phase 09 P02 | 12min | 2 tasks | 3 files |
| Phase 09 P03 | 8min | 2 tasks | 2 files |
| Phase 09 P04 | 11min | 3 tasks | 7 files |
| Phase 09 P05 | 35min | 5 tasks | 7 files |
| Phase 09 P07 | 45min | 3 tasks | 9 files |
**Per-Plan Metrics:**

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t P01 | 28 | 3 tasks | 10 files |
| Phase 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t P02 | 45min | 2 tasks | 8 files |
| Phase 10 P04 | 45 | 3 tasks | 5 files |
| Phase 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t P06 | 90min | 3 tasks | 14 files |
| Phase 10-09 P09 | 55min | 3 tasks | 13 files |
| Phase 11 P01 | 45min | 3 tasks | 20 files |
| Phase 11 P02 | 24min | 3 tasks | 25 files |

## Session

**Last session:** 2026-08-10T09:42:12.455Z
**Stopped at:** Completed 10-01-PLAN.md
**Resume file:** None

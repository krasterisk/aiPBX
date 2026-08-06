# GAPS — Product & Engineering Backlog

Prioritized for solo founder, RU B2B market.  
**Impact:** H = high sales impact · M = medium · L = low  
**Effort:** S = days · M = 1–2 weeks · L = 3+ weeks

## P0 — Blocks agent safety / production confidence

| ID | Gap | Repo | Impact | Effort | Evidence |
|----|-----|------|--------|--------|----------|
| GAP-01 | No test CI on push | both | — | S | `.github/workflows/deploy.yml` runs lint only |
| GAP-02 | 5 failing OA unit tests | BE | — | S | `operator-analytics.service.spec.ts` |
| GAP-03 | Secrets in `package.json` scripts | FE | — | S | Stripe keys, internal IP hardcoded |
| GAP-04 | No `.env.example` on frontend | FE | — | S | Onboarding friction |
| GAP-05 | No frontend APM (Sentry) | FE | M | S | `ErrorBoundary` logs to console only |
| GAP-06 | FE/BE types duplicated, no OpenAPI codegen | both | M | M | No shared types package |

## P1 — High sales impact (RU B2B)

| ID | Gap | Repo | Impact | Effort | Evidence |
|----|-----|------|--------|--------|----------|
| GAP-10 | Onboarding: «first call in 15 min» flow untested | FE | H | M | `features/Onboarding`, no conversion metrics |
| GAP-11 | Operator Analytics Phase 2 (REQ-11) | both | H | L | drill-down, Redis cache, offline eval deferred |
| GAP-12 | `aggregatedCustomMetrics` backend TODO | both | H | M | `useWidgetData.ts` TODO |
| GAP-13 | Dashboard Builder incomplete | FE | H | L | `.idea/dashboard_builder_roadmap.md` |
| GAP-14 | Docs screenshots are placeholders | FE | M | S | `public/docs/screenshots/` |
| GAP-15 | SEO: SPA with single `<title>` | FE | H | M | No sitemap, no per-page meta |
| GAP-16 | No conversion funnel analytics | FE | H | S | No GA4/Метрика goals |
| GAP-17 | Usage billing table in reports UI | FE | M | S | `.idea/frontend_usage_prompt.md` |

## P2 — Product completeness

| ID | Gap | Repo | Impact | Effort | Evidence |
|----|-----|------|--------|--------|----------|
| GAP-20 | Widget: stop audio buffer on hangup | BE | M | S | `widget-webrtc.service.ts` TODO |
| GAP-21 | Interrupt response UI (VAD) | FE | M | M | `.idea/frontend_interrupt_response_spec.md` |
| GAP-22 | AMI module disabled | BE | L | M | `AmiModule` commented out |
| GAP-23 | VpbxUsersModule orphan | BE | L | S | Not imported in `app.module.ts` |
| GAP-24 | ValidationPipe disabled on some controllers | BE | M | S | Commented `@UsePipes` |
| GAP-25 | Admin page is stub | FE | L | S | `AdminPage` placeholder |
| GAP-26 | `legal-hash.ts` build script missing | FE | L | S | `legal/versions.ts` TODO |
| GAP-27 | Dual bundler Webpack + Vite | FE | L | M | Webpack primary, Vite experimental |
| GAP-28 | 3 UI generations coexist | FE | M | L | deprecated/redesigned/redesign-v3 |
| GAP-29 | E2E tests minimal (~5 Cypress specs) | FE | M | M | No CI e2e |
| GAP-30 | No backend e2e tests | BE | M | M | `jest-e2e.json` exists, no specs |
| GAP-31 | Call export: formula-safe values for pre-existing columns | FE | M | S | Phase 10-09 scoped formula guard to «Теги» column only; keywords/summary/transcript still unescaped |
| GAP-32 | Operator evidence sample-size tuning | BE | L | S | `OPERATOR_EVIDENCE_MAX_CALLS` env knob + per-metric evidence count; defaults from 10-01 may need UAT tuning |
| GAP-33 | Operator analytics email/Telegram digest | both | H | M | Project `digestConfig` + cron + SVG→PNG charts; apply migration `2026-08-04-operator-project-digest.sql` |
| GAP-34 | Critical analytics alerts (CSAT/negativity/budget) | both | H | M | Project `alertConfig` + Email/Telegram + Notifications UX; apply migration `2026-08-04-operator-project-alert.sql` |
| GAP-35 | LLM closed-set callTaxonomy tagging | both | H | M | Done: `topic_tag_ids` in analysis schema; TaxonomyEditor name+description+optional hints; Phase 10 D-18 superseded |

## P3 — GTM / growth (RU B2B)

| ID | Gap | Impact | Effort |
|----|-----|--------|--------|
| GAP-40 | Prerender/SSR for landing pages | H | M |
| GAP-41 | Russian SEO content (blog/cases) | H | M |
| GAP-42 | Demo call CTA on landing | H | S |
| GAP-43 | Telegram channel + lead bot | M | S |
| GAP-44 | Partner program for Asterisk integrators | H | L |
| GAP-45 | Case studies with real metrics | H | M |
| GAP-46 | Free trial / freemium tier | H | M |

## Documentation debt

| ID | Gap | Action |
|----|-----|--------|
| GAP-50 | ~90 md files across 5 folders, many duplicates | Consolidated in `.planning/intel/DOCS-INDEX.md` |
| GAP-51 | `.planning` only on frontend | Backend phases tracked in shared ROADMAP |
| GAP-52 | Root README outdated | Update with correct scripts |

## Suggested phase mapping

| Phase | GAPs |
|-------|------|
| Phase 0 (current) | GAP-50, GAP-51 — intel consolidation |
| Phase 0b Engineering Foundation | GAP-01–06 |
| Phase 2 Onboarding | GAP-10, GAP-16 |
| Phase 3 OA Phase 2 | GAP-11, GAP-12, GAP-13 |
| Phase 4 GTM | GAP-15, GAP-40–46 |
| Phase 5 UI consolidation | GAP-28 |

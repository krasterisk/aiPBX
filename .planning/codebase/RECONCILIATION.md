# Intel ↔ Codebase Map Reconciliation

**Date:** 2026-06-24  
**Purpose:** Document deltas between manual `.planning/intel/` (Phase 0 bypass) and GSD canonical `.planning/codebase/` (Phase 0 map).

## Canonical source going forward

| Domain | Canonical | Superseded when conflict |
|--------|-----------|--------------------------|
| Stack, integrations, conventions, testing, structure, concerns | `.planning/codebase/*.md` | `.planning/intel/` |
| Feature matrix, API endpoint map, docs index, GTM plan | `.planning/intel/*.md` | Keep until migrated to codebase or phases |
| Risks (telephony/billing) | `.planning/intel/RISKS.md` | Cross-check with `codebase/CONCERNS.md`; CONCERNS wins for code-verified items |
| Backlog priorities | `.planning/GAPS.md` | Always canonical |

**Rule:** Downstream agents read `codebase/` first for implementation truth; `intel/` for product/feature inventory until explicitly reconciled.

---

## Documents: intel-only (no codebase equivalent)

| File | Content | Action |
|------|---------|--------|
| `intel/FEATURES.md` | 38 pages, 25 entities, feature status matrix | Keep — product inventory; not replaced by codebase map |
| `intel/API-MAP.md` | FE↔BE endpoint mapping | Keep — contract reference; regenerate via `intel api-surface` when enabled |
| `intel/DOCS-INDEX.md` | 90+ docs indexed | Keep — navigation aid |
| `intel/GTM-CONTENT-PLAN.md` | RU B2B content plan | Keep — Phase 4 input |

## Documents: codebase-only (new)

| File | Content |
|------|---------|
| `codebase/STACK.md` | Dual-repo stack, versions, build config |
| `codebase/INTEGRATIONS.md` | External services, env vars, webhooks |
| `codebase/CONVENTIONS.md` | FSD rules, ESLint, naming, import patterns |
| `codebase/TESTING.md` | Jest/Cypress/Loki patterns, CI commands, coverage gaps |
| `codebase/STRUCTURE.md` | Directory layout, where to add code |
| `codebase/CONCERNS.md` | Code-verified debt with file paths |

## Overlapping topics

### Architecture

| Topic | intel/ARCHITECTURE.md | codebase/ARCHITECTURE.md | Resolution |
|-------|----------------------|--------------------------|------------|
| Deploy topology | Cloudflare → Nginx → FE/BE | Same, with file refs | **Aligned** |
| Voice pipelines | Realtime/non-realtime/playground | Same + entry file paths | **codebase/** adds paths; intel narrative still valid |
| FSD layers | High-level | Detailed with violation list | **codebase/** for agents |
| NestJS modules | Module list | Module list + orphan/disabled notes | **codebase/** supersedes module status |

### GAP status (intel/GAPS vs codebase/CONCERNS)

| GAP | intel claim (2026-06-24) | Codebase verification (2026-06-24) | Delta |
|-----|---------------------------|-------------------------------------|-------|
| GAP-01 | No test CI on push | FE `deploy.yml` runs `npm run test:unit`; BE runs `npm test` | **Partially done** — manual CI change; verify BE OA failures still block |
| GAP-02 | 5 failing OA unit tests | CONCERNS confirms `operator-analytics.service.spec.ts` | **Still open** |
| GAP-03 | Secrets in package.json | Webpack reads `.env`; package.json scripts clean | **Partially done** — verify no secrets in webpack CLI args |
| GAP-04 | No FE .env.example | Not present in repo | **Still open** |
| GAP-05 | No frontend Sentry | `initSentry.ts`, webpack `SENTRY_DSN` | **Partially done** — wiring exists; prod DSN + ErrorBoundary integration TBD |
| GAP-06 | No OpenAPI codegen | `generate:api-types` exists; types unused | **Still open** — adoption not codegen |

### Manual work bypassing GSD (document, do not revert)

| Change | Location | Phase 0b impact |
|--------|----------|-----------------|
| CI `test:unit` on FE | `.github/workflows/deploy.yml` | D-01: verify + extend to PR triggers if needed |
| Sentry FE init | `src/shared/config/sentry/initSentry.ts`, webpack | D-05: complete ErrorBoundary + env docs |
| Sentry BE init | `aiPBX_backend/src/main.ts` | D-05: `.env.example` + deploy secrets |
| SEO sitemap/robots | `public/sitemap.xml`, `public/robots.txt` | Out of Phase 0b (Phase 4 GAP-15) |
| `usePageMeta` hook | `src/shared/lib/seo/usePageMeta.ts` | Out of Phase 0b |
| Analytics init | `src/shared/config/analytics/initAnalytics.ts` | Phase 2 GAP-16 |
| Cursor rules | `.cursor/rules/*.mdc` | Keep; reference in CONTEXT canonical refs |
| Planning intel | `.planning/intel/*` | Superseded for code facts by `codebase/` |

---

## Recommended agent read order

1. `.planning/PROJECT.md` — vision, repos, agent rules
2. `.planning/codebase/` — implementation truth (this map)
3. `.planning/GAPS.md` — prioritized backlog
4. `.planning/intel/FEATURES.md` + `API-MAP.md` — product scope
5. `.planning/intel/RISKS.md` — before telephony/billing touches

---

*Reconciliation completed: 2026-06-24 — GSD restart*

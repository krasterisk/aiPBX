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

## Weekly agent cycle (from Phase 0b onward)

```

Mon: pick 1 GAP → /gsd-discuss-phase

Tue: /gsd-plan-phase → review plan

Wed–Fri: /gsd-execute-phase → review PRs

Fri: /gsd-verify-work → deploy by tag

```

Founder time: 60% sales/demos, 40% agent review.

---
phase: 10
slug: speech-analytics-ux-overhaul-operator-drill-down-call-tags-t
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-30
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Seeded from `10-RESEARCH.md` § Validation Architecture.

---

## Test Infrastructure

| Property | Value — Frontend (`aiPBX`) | Value — Backend (`aiPBX_backend`) |
|----------|---------------------------|-----------------------------------|
| **Framework** | Jest 29 + ts-jest, jsdom, @testing-library/react | Jest 29.7 + ts-jest, node |
| **Config file** | `config/jest/jest.config.ts` | `jest` block in `package.json` |
| **Quick run command** | `npx jest --config config/jest/jest.config.ts <path>` | `npx jest <path>` |
| **Full suite command** | `npm run test:unit` | `npm test` |
| **Lint gate** | `npm run lint:ts` | `npm run lint` |
| **Contract gate** | `npm run generate:api-types:check` | `npm run openapi:check` |
| **Estimated runtime** | ~30–90s affected paths; full suites longer | ~30–90s |

---

## Sampling Rate

- **After every task commit:** affected file's quick jest + lint for touched repo
- **After every plan wave:** `npm test` (BE) and `npm run test:unit` (FE); after DTO change also `openapi:check` then sync FE types
- **Before `/gsd-verify-work`:** both full suites + contract gates + i18n `ru`+`en` minimum
- **Max feedback latency:** prefer < 120s for quick path

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|---------|-----------------|-----------|-------------------|-------------|--------|
| 10-01 T1 | 10-01 | 1 | D-04, D-05, D-06, D-08 | T-10-01-01/02/03/07 | Evidence tenant-scoped, bounded, evidence-less metrics omitted, exact operator match | unit BE | `npx jest src/operator-analytics/operator-analytics.service.spec.ts -t "getOperatorEvidence"` | ✅ extend | ⬜ pending |
| 10-01 T2 | 10-01 | 1 | D-04 | T-10-01-07 | `operatorNameExact` equality on object-where and both raw-SQL dialects, exposed on the analysed-calls route | unit BE | `npx jest src/operator-analytics/lib/dashboard-aggregation.spec.ts src/operator-analytics/operator-analytics.service.spec.ts` | ✅ extend | ⬜ pending |
| 10-01 T3 | 10-01 | 1 | D-05, D-08 + R4 | T-10-01-04, T-10-01-09 | Assessment reader / per-metric cap; cross-tenant cache-key separation | unit BE | `npx jest src/operator-analytics/lib/operator-evidence.spec.ts src/operator-analytics/insights-cache.service.spec.ts` | ❌ new + ✅ extend | ⬜ pending |
| 10-02 T1 | 10-02 | 1 | D-01, D-30 | T-10-02-01/03 | Panel opens/closes three ways, back only when wired, labelled surface | unit FE | `npx jest --config config/jest/jest.config.ts src/shared/ui/redesign-v3/SidePanel` | ❌ new | ⬜ pending |
| 10-02 T2 | 10-02 | 1 | D-03, D-07 | T-10-02-02/04 | Pure push/pop/clear, no persistence, no mutation | unit FE | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/model/panelStack.test.ts` | ❌ new | ⬜ pending |
| 10-03 T1 | 10-03 | 2 | D-13, D-17 | T-10-03-01…06 | Taxonomy persists, validation caps, no version bump, unmigrated-column tolerance | unit BE | `npx jest src/operator-analytics/operator-analytics.service.spec.ts -t "taxonomy"` | ✅ extend | ⬜ pending |
| 10-03 T2 | 10-03 | 2 | D-19, D-22 | T-10-03-07 | Tag table columns, auto source default, dual-dialect migration consistency | unit BE | `npx jest src/operator-analytics/operator-call-tag.model.spec.ts` | ❌ new | ⬜ pending |
| 10-03 T3 | 10-03 | 2 | D-17, D-20, D-21 | T-10-03-03 | Taxonomy editor CRUD with confirmed deletion; single save path | unit FE | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/ui/ProjectWizard/TaxonomyEditor.test.tsx` | ❌ new | ⬜ pending |
| 10-04 T1 | 10-04 | 1 | D-09, D-10, D-11, D-24, D-25, D-26, D-28 | T-10-04-02/03/04 | Layout cleanup + IA order + both layout modes + tour anchors | unit FE | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx` | ❌ new | ⬜ pending |
| 10-04 T2 | 10-04 | 1 | D-09, D-12, D-27 | — | Usage section deleted; calendar component retained; section gap raised | unit FE | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/ui/OperatorDashboard` | ❌ new | ⬜ pending |
| 10-04 T3 | 10-04 | 1 | D-29 | T-10-04-01 | `projectId` String() normalisation at all three comparison sites | unit FE | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx` | ❌ new | ⬜ pending |
| 10-05 T1 | 10-05 | 3 | D-14, D-18, D-19 | T-10-05-02/05/10 | Boundary-aware, literal-safe, blank-safe matching; isolated dual write; no backfill | unit BE | `npx jest src/operator-analytics/lib/keyword-spotting.spec.ts` | ✅ extend | ⬜ pending |
| 10-05 T2 | 10-05 | 3 | D-14, D-20, D-22 | T-10-05-01/03/06/07 | Tag PATCH tenant assertion, taxonomy membership, audit; re-analysis deletes auto only | unit BE | `npx jest src/operator-analytics/operator-analytics.service.spec.ts` | ✅ extend | ⬜ pending |
| 10-05 T3 | 10-05 | 3 | D-19 | T-10-05-04/08 | Tenant-scoped `tagId` filter composable with 10-01's exact-operator filter; unchanged substring search | unit BE | `npx jest src/operator-analytics/operator-analytics.service.spec.ts -t "getCdrs"` | ✅ extend | ⬜ pending |
| 10-06 T1 | 10-06 | 3 | D-02, D-06, D-08 | T-10-06-01/02/05 | Evidence panel body: loading, error+retry, empty, capped, partial | unit FE | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/OperatorPanelBody.test.tsx` | ❌ new | ⬜ pending |
| 10-06 T2 | 10-06 | 3 | D-01, D-03, D-07 | T-10-06-03 | Row activation (both keys), single panel instance, focus return, no persisted stack | unit FE | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx` | ❌ new | ⬜ pending |
| 10-06 T3 | 10-06 | 3 | D-02, D-03, D-04 | T-10-06-04 | Metric → exact-operator call list → call; back restores originating entry | unit FE | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel` | ❌ new | ⬜ pending |
| 10-07 T1 | 10-07 | 4 | D-15, D-16, D-29 | T-10-07-01/03 | Per-theme aggregation inside dashboard response; project gate; empty-vs-absent | unit BE | `npx jest src/operator-analytics/lib/tag-stats.spec.ts` | ❌ new | ⬜ pending |
| 10-07 T2 | 10-07 | 4 | D-20 | T-10-07-03/04 | Deleted-theme name fallback; deterministic order + cap; no extra query | unit BE | `npx jest src/operator-analytics/lib/tag-stats.spec.ts src/operator-analytics/operator-analytics.service.spec.ts` | ❌ new + ✅ extend | ⬜ pending |
| 10-08 T1 | 10-08 | 5 | D-15, D-25, D-26, D-29 | T-10-08-01/06 | «Темы» cards, accessibility, placement in both layout modes, no-project gate | unit FE | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/ui/OperatorDashboard/TopicsSection src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx` | ❌ new | ⬜ pending |
| 10-08 T2 | 10-08 | 5 | D-16 | T-10-08-02/03/06 | Theme panel stat strip; server-side paging; server total; stacking | unit FE | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel` | ❌ new | ⬜ pending |
| 10-08 T3 | 10-08 | 5 | D-21 | T-10-08-04/05 | Two distinct empty states, settings link, loading skeletons, expand control | unit FE | `npx jest --config config/jest/jest.config.ts src/features/OperatorAnalytics/ui/OperatorDashboard/TopicsSection/TopicsSection.test.tsx` | ❌ new | ⬜ pending |
| 10-09 T1 | 10-09 | 5 | D-19, D-20 | T-10-09-02/07 | Chip cardinalities 0/1/many/overflow; snapshot-first name fallback | unit FE | `npx jest --config config/jest/jest.config.ts src/entities/Report/ui/CallTagChips/CallTagChips.test.tsx` | ❌ new | ⬜ pending |
| 10-09 T2 | 10-09 | 5 | D-14, D-22 | T-10-09-03/04/05 | Optimistic add/remove with revert; taxonomy-only picker; no new permission | unit FE | `npx jest --config config/jest/jest.config.ts src/entities/Report/ui/ReportShowAnalytics` | ✅ extend | ⬜ pending |
| 10-09 T3 | 10-09 | 5 | D-23 | T-10-09-01 | «Теги» column position + content; formula-safe values; existing columns intact | unit FE | `npx jest --config config/jest/jest.config.ts src/features/Calls/lib/callsExportSheet.test.ts` | ✅ extend | ⬜ pending |
| 10-10 T1 | 10-10 | 6 | C3 (i18n DoD) | T-10-10-02 | Four-locale key parity for all phase copy | unit FE | `npx jest --config config/jest/jest.config.ts src/shared/lib/i18n/reportsLocaleParity.test.ts` | ❌ new | ⬜ pending |
| 10-10 T2 | 10-10 | 6 | Contract | T-10-10-01/03 | openapi + schema.d.ts sync; API map + backlog updated | contract | BE `npm run openapi:check` + FE `npm run generate:api-types:check` | ✅ | ⬜ pending |
| 10-10 T3 | 10-10 | 6 | D-02, D-27, D-30 | — | Visual contract + one real end-to-end tagging round trip | manual | human verification checkpoint | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky. Every plan's first task is a `type="tracer"` task, so the tracer for each plan is the first row of that plan's group.*

---

## Wave 0 Requirements

**None.** The Wave 0 gaps identified above are covered by test-first tasks inside the plans that implement the corresponding behaviour, rather than by a separate scaffolding wave — every new spec file is created by the task that needs it (see the `File Exists` column):

- `lib/operator-evidence.spec.ts` → created by 10-01 T3 (aggregation contract locked after the tracer proves the path)
- `lib/tag-stats.spec.ts` → created by 10-07 T1
- `operator-call-tag.model.spec.ts` → created by 10-03 T2
- `OperatorDashboard.test.tsx` → created by 10-04 T1 **before** the layout changes it asserts, then extended by 10-04 T3, 10-06 T2 and 10-08 T1
- `DrilldownPanel/*.test.tsx` → created by 10-06 T1 and extended by 10-06 T3 and 10-08 T2
- `TopicsSection.test.tsx` → created by 10-08 T1 and extended by 10-08 T3
- `CallTagChips.test.tsx` → created by 10-09 T1
- `reportsLocaleParity.test.ts` → created by 10-10 T1

RTL conventions are taken from `ReportShowAnalytics.test.tsx` (translation mock returning the key, child-component mocks, entity-hook mocks) rather than a shared store wrapper, which the codebase does not have. No framework install is needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Panel fullscreen ≤600px / ~480–560px desktop | D-30 | CSS media; jsdom limited | Resize viewport; open operator panel |
| Manager-first density | D-27 | Subjective | Visual review of fixed OA layout |
| End-to-end auto-tagging | D-14, D-18 | Needs STT+LLM host | Analyze call with project taxonomy; confirm tags |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify — 29 of 30 tasks carry an automated command; the single exception is 10-10 T3, a `checkpoint:human-verify` task covering only CSS-media-query, grid-reflow, text-truncation and live-pipeline checks that are unobservable in jsdom
- [x] Sampling continuity: no 3 consecutive tasks without automated verify — every plan's tracer task and every subsequent task has one
- [x] Wave 0 covers all MISSING references — resolved by test-first tasks inside the owning plans instead of a separate wave; see the mapping above
- [x] No watch-mode flags — all commands are single-shot `npx jest <path>` or `npm run <check-script>`
- [x] Feedback latency acceptable for quick path — every task verify targets one spec file or one directory, not a full suite; full suites run once per wave per the strategy above
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved by planner — task IDs filled from `10-01-PLAN.md` … `10-10-PLAN.md`

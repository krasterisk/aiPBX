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
| — | — | 0 | D-18 | — | Keyword alias match safe | unit BE | `npx jest src/operator-analytics/lib/keyword-spotting.spec.ts` | ✅ extend | ⬜ pending |
| — | — | 0 | D-16, D-29 | — | Tag stats aggregation | unit BE | `npx jest src/operator-analytics/lib/tag-stats.spec.ts` | ❌ W0 | ⬜ pending |
| — | — | 0 | D-05, D-08 | T-10-PII | Evidence omit empty metrics; bound quotes | unit BE | `npx jest src/operator-analytics/lib/operator-evidence.spec.ts` | ❌ W0 | ⬜ pending |
| — | — | 0 | D-04 | — | operatorNameExact equality | unit BE | `npx jest src/operator-analytics/lib/dashboard-aggregation.spec.ts` | ✅ extend | ⬜ pending |
| — | — | 0 | D-14, D-20 | — | Regenerate deletes only auto tags | unit BE | `npx jest src/operator-analytics/operator-analytics.service.spec.ts` | ✅ extend | ⬜ pending |
| — | — | 0 | D-22 | T-10-IDOR | Tag PATCH tenant assertRecordAccess | unit BE | same service.spec | ✅ extend | ⬜ pending |
| — | — | 0 | R4 | T-10-TENANT | Cache keys include tenantUserId | unit BE | `npx jest src/operator-analytics/insights-cache.service.spec.ts` | ✅ extend | ⬜ pending |
| — | — | 0 | D-01, D-03 | — | Panel stack open/push/pop | unit FE | `…/DrilldownPanel/DrilldownPanel.test.tsx` | ❌ W0 | ⬜ pending |
| — | — | 0 | D-09–D-11, D-10, D-26 | — | Layout cleanup + Themes/Ranking with builder | unit FE | `…/OperatorDashboard.test.tsx` | ❌ W0 | ⬜ pending |
| — | — | 0 | D-21 | — | Empty taxonomy empty state | unit FE | `…/TopicsSection/TopicsSection.test.tsx` | ❌ W0 | ⬜ pending |
| — | — | 0 | D-23 | — | Tags column in CSV export | unit FE | `…/callsExportSheet.test.ts` | ✅ extend | ⬜ pending |
| — | — | — | Contract | — | openapi + schema.d.ts sync | contract | BE openapi:check + FE generate:api-types:check | ✅ | ⬜ pending |

*Planner must fill concrete Task IDs when PLAN.md files are written. Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `aiPBX_backend/src/operator-analytics/lib/tag-stats.spec.ts` — D-16/D-29
- [ ] `aiPBX_backend/src/operator-analytics/lib/operator-evidence.spec.ts` — D-05/D-08
- [ ] `aiPBX/src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx` — D-09/D-10/D-11/D-26 + projectId String() pitfall
- [ ] `aiPBX/src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/DrilldownPanel.test.tsx` — D-01/D-02/D-03
- [ ] `aiPBX/src/features/OperatorAnalytics/ui/OperatorDashboard/TopicsSection/TopicsSection.test.tsx` — D-15/D-21
- [ ] Confirm/reuse RTL store+i18n wrapper from `src/shared/lib/tests/` or closest patterns (`useWidgetData.test.ts`, `ReportShowAnalytics.test.tsx`)
- [ ] No framework install needed

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Panel fullscreen ≤600px / ~480–560px desktop | D-30 | CSS media; jsdom limited | Resize viewport; open operator panel |
| Manager-first density | D-27 | Subjective | Visual review of fixed OA layout |
| End-to-end auto-tagging | D-14, D-18 | Needs STT+LLM host | Analyze call with project taxonomy; confirm tags |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency acceptable for quick path
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

---
phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t
plan: 07
subsystem: api
tags: [nestjs, operator-analytics, tag-stats, getDashboard, jest]

requires:
  - phase: 10-03
    provides: callTaxonomy on project, TagDefinition type
  - phase: 10-05
    provides: _topics.tags and _topics.tag_names in analysis JSON
provides:
  - buildTagStats pure lib over loaded CDR records
  - tagStats block on getDashboard response (project-gated)
  - TagStat and OperatorDashboardResponse backend contract matching frontend 10-06
affects: [10-08, 10-10]

tech-stack:
  added: []
  patterns:
    - "In-memory tag aggregation from metrics._topics.tags — no tag table query"
    - "Single findByPk reused for customMetricsAggregated and tagStats"
    - "Omit tagStats without project/taxonomy; empty array when taxonomy but no matches"

key-files:
  created:
    - aiPBX_backend/src/operator-analytics/lib/tag-stats.ts
    - aiPBX_backend/src/operator-analytics/lib/tag-stats.spec.ts
  modified:
    - aiPBX_backend/src/operator-analytics/interfaces/operator-metrics.interface.ts
    - aiPBX_backend/src/operator-analytics/operator-analytics.service.ts
    - aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts

key-decisions:
  - "Sentiment on TagStat uses per-theme counts (positive/neutral/negative), not percentages"
  - "TAG_STATS_MAX_ENTRIES = 50 caps dashboard payload; tie-break by name via ru localeCompare"
  - "shareOfPeriodCalls and deltaVsPeriodAverage included as additive optional D-16 companions"

patterns-established:
  - "Pattern: buildTagStats mirrors buildAgentScorecards denom=scored||1 and parseFloat(x.toFixed(2))"
  - "Pattern: tagStats omitted vs [] distinguishes no-taxonomy from zero-matches (D-29/D-21 FE branch)"

requirements-completed: [D-15, D-16, D-19, D-29]

coverage:
  - id: D1
    description: Per-theme callsCount, averageScore, successRate, sentiment mix from loaded records
    requirement: D-16
    verification:
      - kind: unit
        ref: aiPBX_backend/src/operator-analytics/lib/tag-stats.spec.ts
        status: pass
    human_judgment: false
  - id: D2
    description: tagStats gated — omitted without project/taxonomy, empty when no matches
    requirement: D-29
    verification:
      - kind: unit
        ref: aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts#getDashboard tagStats gating
        status: pass
    human_judgment: false
  - id: D3
    description: Deleted-theme name fallback via taxonomy then snapshot then id
    requirement: D-20
    verification:
      - kind: unit
        ref: aiPBX_backend/src/operator-analytics/lib/tag-stats.spec.ts#name fallback
        status: pass
    human_judgment: false
  - id: D4
    description: Deterministic ordering, entry cap, unchanged repository invocation count
    verification:
      - kind: unit
        ref: aiPBX_backend/src/operator-analytics/lib/tag-stats.spec.ts#cap
        status: pass
      - kind: unit
        ref: aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts#no extra repository calls
        status: pass
    human_judgment: false

duration: 50min
completed: 2026-07-30
status: complete
---

# Phase 10 Plan 07: buildTagStats in getDashboard Summary

**Project-gated `tagStats` on the operator dashboard — D-16 call count, average score, success rate, and sentiment mix per theme, aggregated in-memory from `_topics.tags` with zero extra DB round-trips.**

## Performance

- **Duration:** ~50 min
- **Started:** 2026-07-30T07:39:00Z
- **Completed:** 2026-07-30T08:29:00Z
- **Tasks:** 2/2
- **Files modified:** 5 (backend)

## Accomplishments

- `buildTagStats(records, taxonomy)` pure lib reads `_topics.tags` / `_topics.tag_names` from already-loaded CDR analytics JSON.
- `getDashboard` returns `tagStats` only when a project with non-empty `callTaxonomy` is selected; omits the field otherwise; returns `[]` when taxonomy exists but no calls match.
- D-16 locked fields on every entry: `tagId`, `name`, `callsCount`, `averageScore`, `successRate`, `sentiment: { positive, neutral, negative }`.
- Name resolution: current taxonomy name → per-call snapshot → tag id (D-20 deleted themes stay readable).
- Ordered by `callsCount` desc with `ru` locale name tie-break; capped at 50 entries; optional `shareOfPeriodCalls` / `deltaVsPeriodAverage`.
- Service spec asserts repository invocation count unchanged with vs without taxonomy (Pitfall 8 guard).

## Task Commits

1. **Task 1: End-to-end dashboard theme statistics** — `808c437` (aiPBX_backend)
2. **Task 2: Deleted themes, ordering, cap, no extra query** — `808c437` (aiPBX_backend; same commit — task 2 extended the tracer slice in-place)

## Files Created/Modified

- `aiPBX_backend/src/operator-analytics/lib/tag-stats.ts` — pure aggregation + `TAG_STATS_MAX_ENTRIES`
- `aiPBX_backend/src/operator-analytics/lib/tag-stats.spec.ts` — aggregation, gating semantics, fallback, ordering, cap
- `aiPBX_backend/src/operator-analytics/interfaces/operator-metrics.interface.ts` — `TagStat`, `AgentScorecard`, `OperatorDashboardResponse`
- `aiPBX_backend/src/operator-analytics/operator-analytics.service.ts` — hoisted single `findByPk`, wired `buildTagStats`
- `aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts` — getDashboard tagStats gating + query-count guard

## Decisions Made

- Sentiment reported as integer counts per theme (UI can derive mix percentages).
- Tasks 1 and 2 landed in one commit because task 2 only added tests and refinements to the same tracer files.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Backend `npm run lint` reports pre-existing `@typescript-eslint/no-explicit-any` violations across operator-analytics files; no new lint regressions introduced in changed lines.
- `gsd-tools query state.advance-plan` could not parse STATE.md plan counters; STATE updated manually.

## User Setup Required

None

## Next Phase Readiness

- **10-08** can render «Темы» section from `tagStats` on the dashboard response.
- **10-10** should regenerate OpenAPI types so backend `TagStat` appears in generated schema.

## Self-Check: PASSED

- FOUND: `.planning/phases/10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t/10-07-SUMMARY.md`
- FOUND: backend commit `808c437`
- FOUND: `aiPBX_backend/src/operator-analytics/lib/tag-stats.ts`
- FOUND: `aiPBX_backend/src/operator-analytics/lib/tag-stats.spec.ts`

---
*Phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t*
*Completed: 2026-07-30*

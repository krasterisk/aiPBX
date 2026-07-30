---
phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t
plan: 06
subsystem: ui
tags: [react, rtk-query, operator-analytics, side-panel, drill-down, jest]

requires:
  - phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t
    provides: operator-evidence endpoint from 10-01
  - phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t
    provides: SidePanel + panelStack from 10-02
  - phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t
    provides: OperatorDashboard IA harness from 10-04
provides:
  - getOperatorEvidence RTK query plus operatorNameExact/theme on getOperatorCdrs
  - OperatorEvidence and TagStat types on Report entity
  - metricVisual hoisted lib for shared threshold colouring
  - DrilldownPanel router with OperatorPanelBody, OperatorMetricPanelBody, CallPanelBody
  - Activatable ranking rows and single dashboard-owned SidePanel stack
affects:
  - 10-08 tag panel body and theme call list
  - 10-09 manual tag-update mutation consumer

tech-stack:
  added: []
  patterns:
    - "Dashboard-owned PanelEntry[] stack — no URL, Redux, or sessionStorage"
    - "Operator evidence query skipped without operatorName; empty params stripped"
    - "CallPanelBody reuses ReportShowAnalytics as canonical per-call view"

key-files:
  created:
    - src/features/OperatorAnalytics/lib/metricVisual.ts
    - src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/DrilldownPanel.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/OperatorPanelBody.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/CallPanelBody.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/OperatorPanelBody.test.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/DrilldownPanel.test.tsx
  modified:
    - src/entities/Report/api/reportApi.ts
    - src/entities/Report/model/types/report.ts
    - src/entities/Report/index.ts
    - src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorScoreTable/OperatorScoreTable.tsx

key-decisions:
  - "OperatorPanelBody supports expand-without-onSelectMetric for isolated tests; dashboard passes onSelectMetric to push operatorMetric entries"
  - "TagStat type includes D-16 fields for 10-08 consumption"
  - "ReportShowAnalytics and Analytics exported from Report public API for CallPanelBody FSD compliance"

patterns-established:
  - "Metric call lists filter via operatorNameExact, never substring search"
  - "Evidence-less metrics omitted server-side only — no client-side duplicate filter"

requirements-completed: [D-01, D-02, D-03, D-06, D-08]

coverage:
  - id: D1
    description: Operator row opens SidePanel titled with operator name and period-scoped metrics
    requirement: D-01
    verification:
      - kind: unit
        ref: "OperatorDashboard.test.tsx#opens the panel with the operator name"
        status: pass
    human_judgment: false
  - id: D2
    description: Metric evidence shows quotes and rationales distinct from scores
    requirement: D-02
    verification:
      - kind: unit
        ref: "OperatorPanelBody.test.tsx#expanding a metric row reveals quotes"
        status: pass
    human_judgment: false
  - id: D3
    description: Call view pushes onto stack and back restores operator-metric context
    requirement: D-03
    verification:
      - kind: unit
        ref: "DrilldownPanel.test.tsx#opens call from evidence quote"
        status: pass
    human_judgment: false
  - id: D4
    description: Panel inherits dashboard startDate/endDate/projectId filters
    requirement: D-06
    verification:
      - kind: unit
        ref: "OperatorPanelBody.test.tsx#passes dashboard filters"
        status: pass
    human_judgment: false
  - id: D5
    description: Metrics without evidence absent from panel list
    requirement: D-08
    verification:
      - kind: unit
        ref: "OperatorPanelBody.test.tsx#renders only metrics returned by the backend"
        status: pass
    human_judgment: false
  - id: D6
    description: Quote clamp depth and long panel title truncation
    verification: []
    human_judgment: true
    rationale: "Visual truncation and 4-line quote clamp are CSS/backstop items deferred to phase UAT 10-10"

duration: 90min
completed: 2026-07-30
status: complete
---

# Phase 10 Plan 06: Operator Drill-Down Panel Summary

**RTK evidence query, hoisted metricVisual, and stacked SidePanel drill-down from ranking row through metrics, quotes, and full call analysis**

## Performance

- **Duration:** ~90 min
- **Started:** 2026-07-30T06:45:00Z
- **Completed:** 2026-07-30T08:15:00Z
- **Tasks:** 3
- **Files modified:** 14

## Accomplishments

- Added `getOperatorEvidence` RTK query with OperatorAnalytics cache tag, skip-without-operator guard, and empty-param stripping matching insights query conventions
- Extended `getOperatorCdrs` with `operatorNameExact` and `theme` parameters; added `OperatorEvidence*` and `TagStat` (D-16) types
- Hoisted `metricVisual`, `normalizeRate`, and default metric labels into `lib/metricVisual.ts` for shared panel/table colouring
- Built `DrilldownPanel` router with operator, operator-metric, and call bodies; loading/error-retry/empty/capped states per UI-SPEC
- Wired activatable keyboard ranking rows and single dashboard-owned `SidePanel` stack with focus return on close (both layout modes)

## Task Commits

1. **Task 1: End-to-end operator metrics with real quotes** — `48a0a799` (feat)
2. **Task 2: Panel host + clickable ranking rows** — `3bd6a7e8` (feat)
3. **Task 3: Metric → calls → full call chain** — `bc19b67f` (feat)

## Files Created/Modified

- `src/entities/Report/api/reportApi.ts` — evidence query + cdrs params
- `src/features/OperatorAnalytics/lib/metricVisual.ts` — shared metric presentation
- `src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/` — panel bodies, router, tests
- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx` — stack host
- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorScoreTable/OperatorScoreTable.tsx` — activatable rows

## Decisions Made

- OperatorPanelBody retains optional inline expand when `onSelectMetric` is omitted (isolated unit tests); dashboard always passes push handler
- Quote clamp uses `@include text-clamp(4)` once in SCSS — depth flagged for UAT manual review per plan

## Deviations from Plan

None — plan executed as written.

## Issues Encountered

- Text component appends `.Paragraph` to `data-testid`; wrapped quote/rationale blocks in explicit test-id divs
- i18next `count` interpolation requires numeric type, not string

## User Setup Required

None.

## Known Stubs

None — all panel states wired to RTK queries with explicit empty/error UI.

## Threat Flags

None beyond plan threat register (server text rendered as React children; no dangerouslySetInnerHTML added).

## Next Phase Readiness

- DrilldownPanel router ready for 10-08 `tag` entry body
- TagStat type and theme cdrs param ready for theme call list
- Manual UAT items: quote clamp depth, long operator name in panel title (10-10)

## Self-Check: PASSED

- FOUND: `.planning/phases/10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t/10-06-SUMMARY.md`
- FOUND: `src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/DrilldownPanel.tsx`
- FOUND: `src/features/OperatorAnalytics/lib/metricVisual.ts`
- FOUND: commit `48a0a799`
- FOUND: commit `3bd6a7e8`
- FOUND: commit `bc19b67f`

---
*Phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t*
*Completed: 2026-07-30*

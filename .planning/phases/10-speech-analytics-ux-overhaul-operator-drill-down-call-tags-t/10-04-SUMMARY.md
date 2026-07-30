---
phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t
plan: 04
subsystem: ui
tags: [react, jest, operator-analytics, dashboard, i18n]

requires:
  - phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t
    provides: SidePanel shell and panel stack from 10-02
provides:
  - OperatorDashboard.test.tsx RTL harness for IA, removals, tour anchors, project-id resolution
  - Reordered OperatorDashboard with stable section test ids
  - Deleted OperatorUsageSection component
  - String-normalized project id comparison in dashboard and hosting page
affects:
  - 10-06 drill-down panel host
  - 10-08 Topics section and D-29 visibility

tech-stack:
  added: []
  patterns:
    - "RTL layout tests assert document order via data-testid, not translated copy"
    - "Project id comparisons use String() on both sides for query-string deep links"

key-files:
  created:
    - src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx
  modified:
    - src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.module.scss
    - src/pages/DashboardCallRecordsPage/ui/DashboardCallRecordsPage/DashboardCallRecordsPage.tsx
  deleted:
    - src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorUsageSection/OperatorUsageSection.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorUsageSection/OperatorUsageSection.module.scss

key-decisions:
  - "D-25 wins over D-28: AiInsightsBanner moved below Stats row"
  - "Project chip row and excluded-low-quality notice stay above Stats (A-02)"
  - "String() normalization at comparison sites without changing OperatorProject.id type"

patterns-established:
  - "Each dashboard data section carries data-testid oa-section-* for layout tests"

requirements-completed: [D-09, D-10, D-11, D-12, D-24, D-25, D-26, D-27, D-28, D-29]

coverage:
  - id: D1
    description: "Single-scroll dashboard order stats → insights → mid-charts/builder → ranking"
    requirement: D-24
    verification:
      - kind: unit
        ref: "OperatorDashboard.test.tsx#renders stats, insights and ranking sections in document order"
        status: pass
    human_judgment: false
  - id: D2
    description: "Usage-cost section deleted from repo; volume charts removed from fixed layout"
    requirement: D-09
    verification:
      - kind: unit
        ref: "OperatorDashboard.test.tsx#does not render removed usage, dynamics or activity sections"
        status: pass
    human_judgment: false
  - id: D3
    description: "Cost StatCards retained on dashboard"
    requirement: D-10
    verification:
      - kind: unit
        ref: "OperatorDashboard.test.tsx#keeps both cost stat cards"
        status: pass
    human_judgment: false
  - id: D4
    description: "Builder grid replaces mid-charts when dashboardConfig present; ranking stays below"
    requirement: D-26
    verification:
      - kind: unit
        ref: "OperatorDashboard.test.tsx#shows builder grid instead of mid-charts when custom layout is configured"
        status: pass
    human_judgment: false
  - id: D5
    description: "Project deep link resolves active project via String() id comparison"
    requirement: D-29
    verification:
      - kind: unit
        ref: "OperatorDashboard.test.tsx#resolves active project when projectId is a string and list ids are numbers"
        status: pass
    human_judgment: false
  - id: D6
    description: "All four onboarding tour anchors still resolve after reorder"
    verification:
      - kind: unit
        ref: "OperatorDashboard.test.tsx#keeps all four onboarding tour anchors"
        status: pass
    human_judgment: false
  - id: D7
    description: "Manager-first section spacing raised to 24px top-level gap"
    requirement: D-27
    verification: []
    human_judgment: true
    rationale: "Gap token change is structural; visual density not verifiable in jsdom"

duration: 45min
completed: 2026-07-30
status: complete
---

# Phase 10 Plan 04: OperatorDashboard IA Cleanup Summary

**Dashboard reordered to stats → insights → mid-charts/builder → ranking; usage section and volume charts removed; cost cards kept; project deep links fixed via String() id comparison**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-07-30T05:59:00Z
- **Completed:** 2026-07-30T06:44:00Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Added first RTL render test for `OperatorDashboard` covering IA order, three removals, builder vs default layout, loading state, tour anchors, and project-id resolution
- Reordered dashboard: project chips → stats → AI insights → mid-charts or builder grid → operator ranking
- Removed `OperatorUsageSection`, «Динамика звонков» line chart, and «Активность» heatmap from fixed layout (HeatmapCalendar file retained for builder widget)
- Kept «Общая стоимость» and «Средняя стоимость» StatCards
- Raised top-level section gap from 16px to 24px
- Normalized project id comparison with `String()` in dashboard and `DashboardCallRecordsPage`

## Task Commits

1. **Task 1: End-to-end dashboard IA render test and reorder** - `efc20b49` (feat)
2. **Task 2: Delete orphaned usage-cost component** - `e6f9f90f` (chore)
3. **Task 3: Resolve active project regardless of id type** - `d9b47e87` (fix)

## Files Created/Modified

- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx` - RTL harness with 10 layout and project-id tests
- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx` - IA reorder, removals, test ids, String() lookup, 24px gap
- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.module.scss` - removed unused `.chartContainer`
- `src/pages/DashboardCallRecordsPage/ui/DashboardCallRecordsPage/DashboardCallRecordsPage.tsx` - String() project lookup for builder gate
- Deleted `OperatorUsageSection/` directory

## Decisions Made

- D-25 authoritative ordering: insights banner moved below stats (A-01)
- Chip row and excluded-quality notice remain above stats (A-02)
- String() comparison at three sites without changing `OperatorProject.id` declared type

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Dashboard IA is stable for 10-06 panel host and 10-08 «Темы» section
- Project deep-link resolution unblocks D-29 project-scoped sections
- RTL test harness ready for downstream plans to extend

## Self-Check: PASSED

- FOUND: `.planning/phases/10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t/10-04-SUMMARY.md`
- FOUND: `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx`
- FOUND: commit `efc20b49`
- FOUND: commit `e6f9f90f`
- FOUND: commit `d9b47e87`

---
*Phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t*
*Completed: 2026-07-30*

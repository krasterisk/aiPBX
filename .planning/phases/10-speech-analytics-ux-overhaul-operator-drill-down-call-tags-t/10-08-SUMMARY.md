---
phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t
plan: 08
subsystem: ui
tags: [react, operator-analytics, topics-section, tag-panel, drill-down, jest, i18n]

requires:
  - phase: 10-06
    provides: SidePanel stack, DrilldownPanel router, TagStat type, theme cdrs param
  - phase: 10-07
    provides: tagStats on getDashboard response
provides:
  - TopicsSection with project gate, two empty states, loading skeletons, expand control
  - TagPanelBody with D-16 stat strip and server-paginated theme call list
  - Dashboard placement between mid-charts/builder and ranking in both layout modes
affects: [10-10]

tech-stack:
  added: []
  patterns:
    - "TopicsSection reads tagStats from dashboard response only — no separate fetch"
    - "Empty states branch on callTaxonomy length vs tagStats length, never tagStats alone"
    - "Tag panel stack entry carries full TagStat; call list filters via theme param"

key-files:
  created:
    - src/features/OperatorAnalytics/ui/OperatorDashboard/TopicsSection/TopicsSection.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/TopicsSection/TopicsSection.module.scss
    - src/features/OperatorAnalytics/ui/OperatorDashboard/TopicsSection/TopicsSection.test.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/TopicsSection/index.ts
    - src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/TagPanelBody.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/TagPanelBody.module.scss
  modified:
    - src/entities/Report/model/types/report.ts
    - src/features/OperatorAnalytics/model/panelStack.ts
    - src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/DrilldownPanel.tsx
    - src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/DrilldownPanel.test.tsx
    - public/locales/ru/reports.json
    - public/locales/en/reports.json
    - public/locales/de/reports.json
    - public/locales/zh/reports.json

key-decisions:
  - "Panel tag entry stores full TagStat on stack so panel figures match cards without client recomputation"
  - "Not-configured empty state navigates to getRouteAnalyticsProjects() — in-app route constant per threat model"
  - "Optional shareOfPeriodCalls and deltaVsPeriodAverage render as secondary labels below D-16 strip"

patterns-established:
  - "Pattern: DISPLAY_THRESHOLD=8 with in-place expand; skeleton grid matches loaded card geometry"
  - "Pattern: TagPanelBody reuses operator panel loading/error/empty shapes and metricVisual threshold colouring"

requirements-completed: [D-15, D-16, D-21, D-25, D-26, D-29]

coverage:
  - id: D1
    description: Project-gated Topics section with clickable cards fed from dashboard tagStats
    requirement: D-15
    verification:
      - kind: unit
        ref: src/features/OperatorAnalytics/ui/OperatorDashboard/TopicsSection/TopicsSection.test.tsx
        status: pass
    human_judgment: false
  - id: D2
    description: Theme panel D-16 strip and server-paged call list with stack navigation
    requirement: D-16
    verification:
      - kind: unit
        ref: src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/DrilldownPanel.test.tsx#tag body
        status: pass
    human_judgment: false
  - id: D3
    description: No-taxonomy empty state links to project settings; zero-matches state distinct
    requirement: D-21
    verification:
      - kind: unit
        ref: src/features/OperatorAnalytics/ui/OperatorDashboard/TopicsSection/TopicsSection.test.tsx#empty
        status: pass
    human_judgment: false
  - id: D4
    description: Section placement below mid-charts/builder and above ranking; absent without project
    requirement: D-25
    verification:
      - kind: unit
        ref: src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx#topics
        status: pass
    human_judgment: false
  - id: D5
    description: Topics renders in custom builder layout mode above ranking
    requirement: D-26
    verification:
      - kind: unit
        ref: src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx#builder
        status: pass
    human_judgment: false
  - id: D6
    description: No-project gate renders no Topics section element
    requirement: D-29
    verification:
      - kind: unit
        ref: src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.test.tsx#no project
        status: pass
    human_judgment: false
  - id: D7
    description: Grid reflow at 3/8/30 themes and long name truncation in card/panel title
    verification: []
    human_judgment: true
    rationale: "Backstop items deferred to phase UAT 10-10 per UI-SPEC"

duration: 75min
completed: 2026-07-30
status: complete
---

# Phase 10 Plan 08: TopicsSection + TagPanelBody Summary

**Project-gated «Темы» dashboard section and theme drill-down panel with D-16 stat strip, distinct empty states, and server-paged call list on the existing SidePanel stack.**

## Performance

- **Duration:** ~75 min
- **Started:** 2026-07-30T08:14:00Z
- **Completed:** 2026-07-30T09:29:00Z
- **Tasks:** 3/3
- **Files modified:** 16

## Accomplishments

- Built `TopicsSection` presentational component: responsive card grid, mandatory subtitle, keyboard-accessible cards, loading skeletons, 8-card expand control, and two distinct empty states (no taxonomy → project settings link; zero matches → period/synonyms guidance).
- Wired section in `OperatorDashboard` between mid-charts or builder grid and operator ranking, gated on selected project (D-29).
- Added `TagPanelBody` with display-size call-count headline, 3-up D-16 stat strip from stack `TagStat`, server-paginated `getOperatorCdrs` filtered by `theme`, and call-row stack push.
- Extended `PanelEntry` tag kind to `{ kind: 'tag', stat: TagStat }` and `OperatorDashboardResponse.tagStats`.
- Added ru/en/de/zh i18n keys for all new user-visible strings.

## Task Commits

1. **Task 1: End-to-end dashboard theme cards** — `7a43f1e1`
2. **Task 2: TagPanelBody headline, stat strip, paged call list** — `2e0cf773`
3. **Task 3: Empty states, loading skeletons, expand control, i18n** — `29a46532`

## Deviations from Plan

None — plan executed as written.

## Issues Encountered

- `TagDefinition` uses `aliases` not `keywords` in test fixtures.
- `Text` component does not forward `data-testid`; wrapped call-count header in explicit test-id div (same pattern as 10-06).
- OperatorDashboard tests required `useNavigate` mock for TopicsSection empty-state link.

## User Setup Required

None.

## Known Stubs

None.

## Threat Flags

None beyond plan threat register (theme names as React children; settings link uses route constant).

## Next Phase Readiness

- **10-10** manual UAT: grid reflow at 3/8/30 themes, paging control appearance, long theme name truncation.

## Self-Check: PASSED

- FOUND: `.planning/phases/10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t/10-08-SUMMARY.md`
- FOUND: `src/features/OperatorAnalytics/ui/OperatorDashboard/TopicsSection/TopicsSection.tsx`
- FOUND: `src/features/OperatorAnalytics/ui/OperatorDashboard/DrilldownPanel/TagPanelBody.tsx`
- FOUND: commit `7a43f1e1`
- FOUND: commit `2e0cf773`
- FOUND: commit `29a46532`

---
*Phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t*
*Completed: 2026-07-30*

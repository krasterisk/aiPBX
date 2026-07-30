---
phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t
plan: 09
subsystem: ui
tags: [react, rtk-query, call-tags, export, jest, scss-modules]

requires:
  - phase: 10-05
    provides: PATCH /operator-analytics/:id/tags, _topics.tags/tag_names on analytics records
  - phase: 10-06
    provides: SidePanel call stack consuming ReportShowAnalytics
provides:
  - CallTagChips shared component (bounded journal + unbounded card + editable mode)
  - updateCallTags RTK mutation with cache invalidation
  - Journal row and call-card tag chip integrations with optimistic manual edit
  - «Теги» export column with spreadsheet formula guard
affects: [10-10]

tech-stack:
  added: []
  patterns:
    - "Snapshot-first tag name resolution: tag_names → callTaxonomy → tag id"
    - "Optimistic tag PATCH sends full tagIds set; revert + toast on failure"
    - "Export formula guard only on new Теги column (other columns deferred)"

key-files:
  created:
    - src/entities/Report/ui/CallTagChips/CallTagChips.tsx
    - src/entities/Report/ui/CallTagChips/CallTagChips.module.scss
    - src/entities/Report/ui/CallTagChips/CallTagChips.test.tsx
  modified:
    - src/entities/Report/api/reportApi.ts
    - src/entities/Report/ui/ReportShowAnalytics/ReportShowAnalytics.tsx
    - src/features/Calls/ui/CallsTable/CallsTable.tsx
    - src/features/Calls/lib/callsExportSheet.ts

key-decisions:
  - "CallTagChips lives in entities/Report so journal feature and call card share it without FSD violation"
  - "Tag edit toggle on call card only; journal rows remain read-only bounded chips"
  - "Formula-safe export guard scoped to Теги column; pre-existing columns recorded as backlog finding"

patterns-established:
  - "Pattern: resolveTagDisplayName(tagId, tag_names, taxonomy) shared by chips and export"
  - "Pattern: escapeSpreadsheetFormula prefixes leading formula chars with apostrophe"

requirements-completed: [D-14, D-19, D-22, D-23]

coverage:
  - id: D1
    description: CallTagChips renders zero/one/many/overflow cardinalities with snapshot-first names
    requirement: D-19
    verification:
      - kind: unit
        ref: src/entities/Report/ui/CallTagChips/CallTagChips.test.tsx
        status: pass
    human_judgment: false
  - id: D2
    description: Bounded chips in journal row; editable unbounded chips on call card with optimistic revert
    requirement: D-14
    verification:
      - kind: unit
        ref: src/entities/Report/ui/ReportShowAnalytics/ReportShowAnalytics.test.tsx#call tag chips
        status: pass
    human_judgment: false
  - id: D3
    description: «Теги» export column beside keywords with formula-safe values
    requirement: D-23
    verification:
      - kind: unit
        ref: src/features/Calls/lib/callsExportSheet.test.ts
        status: pass
    human_judgment: false
  - id: D4
    description: Chip truncation at 160px with full name in title attribute
    requirement: D-19
    verification: []
    human_judgment: true
    rationale: Truncation width and tooltip behaviour are visual backstops not verifiable in jsdom

duration: 55min
completed: 2026-07-30
status: complete
---

# Phase 10 Plan 09: Call Tag Chips Summary

**Shared CallTagChips on journal and call card with optimistic PATCH editing, plus a formula-safe «Теги» export column beside keywords.**

## Performance

- **Duration:** ~55 min
- **Started:** 2026-07-30T07:52:00Z
- **Completed:** 2026-07-30T08:47:00Z
- **Tasks:** 3/3
- **Files modified:** 13

## Accomplishments

- `CallTagChips` component: bounded (3+N) and unbounded modes, editable variant, snapshot-first name resolution, optional colour dot, 160px truncate with `title` backstop.
- Journal row shows bounded chips in the sentiment/analytics cell for operator records; call card shows unbounded chips with edit toggle, taxonomy-only picker, optimistic add/remove via `PATCH /operator-analytics/:channelId/tags`.
- Export gains «Теги» column immediately after `EXPORT_KEYWORDS` with comma-separated snapshot names and `escapeSpreadsheetFormula` guard.
- Pre-existing export columns (keywords, summary, transcript, etc.) still lack formula guards — recorded as backlog finding for a follow-up plan.

## Task Commits

1. **Task 1: CallTagChips component** — `b698cc83`
2. **Task 2: Journal + call card integration** — `bb2fa017`
3. **Task 3: Export Теги column** — `0517c399`
4. **Lint fixes** — `2aec3b09`

## Files Created/Modified

- `src/entities/Report/ui/CallTagChips/` — shared chip row (display + editable)
- `src/entities/Report/api/reportApi.ts` — `updateCallTags` mutation + `useUpdateCallTags`
- `src/entities/Report/ui/ReportShowAnalytics/ReportShowAnalytics.tsx` — tag section with edit mode
- `src/features/Calls/ui/CallsTable/CallsTable.tsx` — bounded chips in journal row
- `src/features/Calls/lib/callsExportSheet.ts` — «Теги» column + formula escape

## Decisions Made

- Passed `channelId` through `CallPanelBody` and `ReportExpandedPanel` so tag editing works in both expanded journal and drill-down panel (minimal wiring beyond plan file list).
- Used `react-toastify` for tag-save failure toast (existing app pattern per UI-SPEC).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] CallPanelBody channelId prop for panel tag editing**
- **Found during:** Task 2
- **Issue:** Plan listed only ReportShowAnalytics; drill-down CallPanelBody also renders the call card without channelId
- **Fix:** Pass `channelId` to ReportShowAnalytics from CallPanelBody and ReportExpandedPanel
- **Files modified:** CallPanelBody.tsx, ReportExpandedPanel.tsx
- **Committed in:** bb2fa017

## Backlog Findings

- **Formula safety on pre-existing export columns:** Keywords, summary, transcript, and assessment columns in `callsExportSheet.ts` can still emit values spreadsheets interpret as formulas. Guard was applied only to the new «Теги» column per plan scope; recommend a dedicated export-hardening GAP.

## Issues Encountered

None blocking. Full-repo `npm run lint:ts` reports pre-existing warnings elsewhere; changed files lint clean (warnings only on pre-existing lines).

## User Setup Required

None

## Next Phase Readiness

- **10-10** can add i18n keys (`+ Добавить тему`, `+{{count}}`, `Изменить темы`, `Готово`, `Теги`) across ru/en/de/zh and run manual UAT on chip truncation tooltips.

## Self-Check: PASSED

- FOUND: `.planning/phases/10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t/10-09-SUMMARY.md`
- FOUND: commit `b698cc83`
- FOUND: commit `bb2fa017`
- FOUND: commit `0517c399`

---
*Phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t*
*Completed: 2026-07-30*

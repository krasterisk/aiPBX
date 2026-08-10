---
phase: 11-playground-ux-redesign-for-voice-assistant-testing
plan: 02
subsystem: ui
tags: [playground, setup-sheet, autosave, assistant-form, mui, fsd]

requires:
  - phase: 11-playground-ux-redesign-for-voice-assistant-testing
    provides: Call-first PlaygroundSessionV2 shell with stub Setup drawer
provides:
  - Shared AssistantSettingsForm (exclusive Prompt/Parameters/VAD/Tools accordions)
  - SetupSheet MUI Drawer 420px / fullscreen mobile
  - useAutosaveAssistant dirty-aware updateAssistant gates
  - Single entity assistantForm write path (playgroundAssistantForm removed)
affects:
  - 11-03 Debug events sheet
  - 11-04 Assistants page migration to AssistantSettingsForm

tech-stack:
  added: []
  patterns:
    - "Exclusive MUI Accordion Setup sections; Prompt default open (D-31)"
    - "Autosave on Setup leave + before Start; fail keeps Setup + inline error (D-05/D-06)"
    - "Feature→feature AssistantSettingsForm import with documented layer-imports exception (A5)"

key-files:
  created:
    - src/features/AssistantSettingsForm/ui/AssistantSettingsForm/AssistantSettingsForm.tsx
    - src/features/AssistantSettingsForm/ui/AssistantSettingsForm/sections/PromptSection.tsx
    - src/features/AssistantSettingsForm/ui/AssistantSettingsForm/sections/ParametersSection.tsx
    - src/features/AssistantSettingsForm/ui/AssistantSettingsForm/sections/VadSection.tsx
    - src/features/AssistantSettingsForm/ui/AssistantSettingsForm/sections/ToolsSection.tsx
    - src/features/AssistantSettingsForm/model/setupAccordion.ts
    - src/features/AssistantSettingsForm/model/setupAccordion.test.ts
    - src/features/PlaygroundSession/ui/SetupSheet/SetupSheet.tsx
    - src/features/PlaygroundSession/model/useAutosaveAssistant.ts
    - src/features/PlaygroundSession/model/useAutosaveAssistant.test.ts
    - src/shared/ui/mui/Slider/index.ts
  modified:
    - src/features/PlaygroundSession/ui/PlaygroundSessionV2/PlaygroundSessionV2.tsx
    - src/app/providers/StoreProvider/config/store.ts
    - src/app/providers/StoreProvider/config/StateSchema.ts
    - src/pages/Playground/index.ts
    - src/features/PlaygroundSession/index.ts
    - public/locales/{ru,en,de,zh}/playground.json
  deleted:
    - src/pages/Playground/model/slices/playgroundAssistantFormSlice.ts
    - src/features/PlaygroundSession/ui/PlaygroundHeader/PlaygroundHeader.tsx
    - src/features/PlaygroundSession/ui/SettingsPopover/SettingsPopover.tsx
    - src/features/PlaygroundSession/ui/SettingsPanel/SettingsPanel.tsx
    - src/features/PlaygroundSession/ui/PlaygroundAssistantSettings/PlaygroundAssistantSettings.tsx
    - src/features/PlaygroundSession/ui/PlaygroundSession/PlaygroundSession.tsx

key-decisions:
  - "Canonical write path is entity assistantForm + useUpdateAssistant; playgroundAssistantForm removed from root store"
  - "Feature→feature AssistantSettingsForm import uses documented layer-imports eslint-disable (A5)"
  - "Shared mui/Slider index export added so size=small Slider imports resolve"

patterns-established:
  - "runAutosaveAssistant pure gate (validate → clean skip → PATCH) tested without RTK"
  - "SetupSheet owns form composition; V2 owns Start/leave/unmount autosave orchestration"

requirements-completed: [PG-UX-02, PG-UX-07]

coverage:
  - id: D1
    description: AssistantSettingsForm exclusive accordions with Prompt default and Tools last
    requirement: PG-UX-07
    verification:
      - kind: unit
        ref: src/features/AssistantSettingsForm/model/setupAccordion.test.ts
        status: pass
    human_judgment: false
  - id: D2
    description: Autosave success/skip/fail gates Start and Setup leave
    requirement: PG-UX-02
    verification:
      - kind: unit
        ref: src/features/PlaygroundSession/model/useAutosaveAssistant.test.ts
        status: pass
    human_judgment: false
  - id: D3
    description: Dual-slice removed; live V2 opens SetupSheet not popovers
    requirement: PG-UX-02
    verification:
      - kind: unit
        ref: src/features/PlaygroundSession/model/playgroundMode.test.ts
        status: pass
    human_judgment: true
    rationale: Visual Setup sheet width/scroll and mid-call Open settings block need human UAT

duration: 24min
completed: 2026-08-10
status: complete
---

# Phase 11 Plan 02: Setup sheet + AssistantSettingsForm Summary

**Setup sheet with shared AssistantSettingsForm and dirty-aware autosave on entity `assistantForm` — dual `playgroundAssistantForm` slice and popover settings paths removed from Playground.**

## Performance

- **Duration:** ~24 min
- **Started:** 2026-08-10T09:17:00Z
- **Completed:** 2026-08-10T09:45:00Z
- **Tasks:** 3/3
- **Files modified:** ~25

## Accomplishments

- Shared `features/AssistantSettingsForm` with exclusive Prompt / Parameters / VAD / Tools accordions (2-col desktop / 1-col mobile)
- `SetupSheet` Drawer (420px / fullscreen mobile) + `useAutosaveAssistant` (skip clean, fail blocks Start, silent Setup unmount)
- Root store no longer registers `playgroundAssistantForm`; V1 header/popover/settings panels deleted from live path

## Task Commits

1. **Task 1: Create AssistantSettingsForm feature** - `39d67ad1` (feat)
2. **Task 2: useAutosaveAssistant + SetupSheet + Start/leave gates** - `e1c90020` (feat)
3. **Task 3: Consolidate on entity assistantForm; remove dual slice + popovers** - `df14f8e4` (feat)

## Files Created/Modified

- `src/features/AssistantSettingsForm/**` — shared accordion settings form
- `src/features/PlaygroundSession/ui/SetupSheet/**` — MUI Drawer wrapper
- `src/features/PlaygroundSession/model/useAutosaveAssistant.ts` — dirty/validate/PATCH gate
- `src/features/PlaygroundSession/ui/PlaygroundSessionV2/PlaygroundSessionV2.tsx` — Setup + autosave wiring
- `src/app/providers/StoreProvider/config/{store,StateSchema}.ts` — slice removal
- Locales `playground.json` (ru/en/de/zh) — VAD / Инструменты / Parameters

## Decisions Made

- Entity `assistantForm` + `useUpdateAssistant` is the only Playground write path
- Documented FSD feature→feature import for SetupSheet → AssistantSettingsForm (A5)
- Added missing `shared/ui/mui/Slider` public index for compact form sliders

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Slider module had no index export**
- **Found during:** Task 1
- **Issue:** `@/shared/ui/mui/Slider` failed TypeScript resolve (only `Slider.tsx` existed)
- **Fix:** Added `src/shared/ui/mui/Slider/index.ts`
- **Files modified:** `src/shared/ui/mui/Slider/index.ts`
- **Committed in:** `39d67ad1`

## Auth Gates

None.

## Known Stubs

None that block this plan’s goal. Debug drawer remains a stub until 11-03 (intentional).

## Threat Flags

None beyond plan threat model (T-11-04 mitigated: PATCH uses form `id` from selected assistant only).

## Self-Check: PASSED

- `src/features/AssistantSettingsForm/ui/AssistantSettingsForm/AssistantSettingsForm.tsx` — FOUND
- `src/features/PlaygroundSession/ui/SetupSheet/SetupSheet.tsx` — FOUND
- `src/features/PlaygroundSession/model/useAutosaveAssistant.ts` — FOUND
- Commits `39d67ad1`, `e1c90020`, `df14f8e4` — FOUND

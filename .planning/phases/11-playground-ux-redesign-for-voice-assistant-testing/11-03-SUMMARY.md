---
phase: 11-playground-ux-redesign-for-voice-assistant-testing
plan: 03
subsystem: ui
tags: [playground, debug-sheet, metrics, mic-device, mui, fsd]

requires:
  - phase: 11-playground-ux-redesign-for-voice-assistant-testing
    provides: Call-first PlaygroundSessionV2 shell with Setup sheet
provides:
  - DebugSheet MUI Drawer 400px / fullscreen mobile with DebugPanel
  - StatusBar dense metrics relocated into Debug (Call chrome status+timer only)
  - Session-scoped mic device select wired to connect(assistantId, micDeviceId)
affects:
  - 11-04 Assistants page migration
  - 11-05 UAT / polish

tech-stack:
  added: []
  patterns:
    - "Debug as overlay sheet (SetupSheet twin) — no resizable PlaygroundLayout as default"
    - "DEFAULT_DEBUG_FILTERS exclude audio (D-11); StatusBar metrics Debug-only (D-12)"
    - "Session-only micDeviceId via resolveMicDeviceIdForConnect into existing connect signature"

key-files:
  created:
    - src/features/PlaygroundSession/ui/DebugSheet/DebugSheet.tsx
    - src/features/PlaygroundSession/ui/DebugSheet/DebugSheet.module.scss
    - src/features/PlaygroundSession/model/debugFilters.ts
    - src/features/PlaygroundSession/model/debugFilters.test.ts
    - src/features/PlaygroundSession/model/micDeviceSelect.ts
    - src/features/PlaygroundSession/model/micDeviceSelect.test.ts
  modified:
    - src/features/PlaygroundSession/ui/DebugPanel/DebugPanel.tsx
    - src/features/PlaygroundSession/ui/StatusBar/StatusBar.tsx
    - src/features/PlaygroundSession/ui/PlaygroundSessionV2/PlaygroundSessionV2.tsx
    - public/locales/{ru,en,de,zh}/playground.json

key-decisions:
  - "Reuse StatusBar inside DebugSheet metrics section rather than duplicating VAD/token UI"
  - "Mic device id is React session state only — no localStorage (RESEARCH Q3)"
  - "TDD via pure micDeviceSelect helpers; enumerateDevices mocked at unit layer"

patterns-established:
  - "Sheet twins: SetupSheet 420px / DebugSheet 400px with shared back/Esc close to Call"
  - "connect(assistantId, resolveMicDeviceIdForConnect(micDeviceId)) on Start"

requirements-completed: [PG-UX-03]

coverage:
  - id: D1
    description: Debug opens as 400px/fullscreen sheet with DebugPanel default filters excluding audio
    requirement: PG-UX-03
    verification:
      - kind: unit
        ref: src/features/PlaygroundSession/model/debugFilters.test.ts
        status: pass
    human_judgment: true
    rationale: Drawer open from Open events and mobile fullscreen need visual UAT
  - id: D2
    description: Tokens/latency/VAD/model metrics live in DebugSheet — not Call chrome
    requirement: PG-UX-03
    verification:
      - kind: other
        ref: CallChrome has no StatusBar/token metrics; DebugSheet mounts StatusBar
        status: pass
    human_judgment: true
    rationale: Confirm Call header remains status+timer only in browser
  - id: D3
    description: Mic device select in Debug only; Start passes device id to connect
    requirement: PG-UX-03
    verification:
      - kind: unit
        ref: src/features/PlaygroundSession/model/micDeviceSelect.test.ts
        status: pass
    human_judgment: true
    rationale: Real enumerateDevices + connect path needs browser mic UAT

duration: 21min
completed: 2026-08-10
status: complete
---

# Phase 11 Plan 03: Debug sheet + metrics + mic select Summary

**Debug overlays Call as a 400px sheet with event filters, relocated StatusBar metrics, and session-scoped mic device select wired into `connect`.**

## Performance

- **Duration:** ~21 min
- **Started:** 2026-08-10T09:44:00Z
- **Completed:** 2026-08-10T10:04:38Z
- **Tasks:** 2/2
- **Files modified:** ~12

## Accomplishments

- Replaced Debug stub drawer with `DebugSheet` (DebugPanel + metrics + back/Esc close)
- Extracted `DEFAULT_DEBUG_FILTERS` excluding audio; StatusBar metrics mount only in Debug
- Mic Combobox in Debug only; V2 holds `micDeviceId` and passes it on Start via `resolveMicDeviceIdForConnect`

## Task Commits

1. **Task 1: DebugSheet drawer + metrics off StatusBar + default filters** - `76823fd8` (feat)
2. **Task 2 RED: Mic device select tests** - `a7ad79dd` (test)
3. **Task 2 GREEN: Mic device select + connect wiring** - `d91d96f4` (feat)

## Files Created/Modified

- `src/features/PlaygroundSession/ui/DebugSheet/**` — MUI Drawer host for events + metrics + mic
- `src/features/PlaygroundSession/model/debugFilters.ts` — D-11 default filter set + tests
- `src/features/PlaygroundSession/model/micDeviceSelect.ts` — audioinput filter + connect arg helper + tests
- `src/features/PlaygroundSession/ui/DebugPanel/DebugPanel.tsx` — uses `createDefaultDebugFilters`
- `src/features/PlaygroundSession/ui/PlaygroundSessionV2/PlaygroundSessionV2.tsx` — DebugSheet + mic state
- Locales `playground.json` (ru/en/de/zh) — mic device labels

## Decisions Made

- Mount existing `StatusBar` inside Debug metrics section (no parallel metrics component)
- Mic choice is session React state only (no persistence)
- Pure helpers for TDD; UI enumerates devices when sheet opens

## Deviations from Plan

None - plan executed exactly as written.

## Auth Gates

None.

## Known Stubs

None that block this plan’s goal.

## Threat Flags

None beyond plan threat model (T-11-05 / T-11-01 — client-only event buffer, text-only JSON render unchanged).

## Self-Check: PASSED

- `src/features/PlaygroundSession/ui/DebugSheet/DebugSheet.tsx` — FOUND
- `src/features/PlaygroundSession/model/debugFilters.ts` — FOUND
- `src/features/PlaygroundSession/model/micDeviceSelect.ts` — FOUND
- Commits `76823fd8`, `a7ad79dd`, `d91d96f4` — FOUND

## Next Phase Readiness

Ready for 11-04 (Assistants page migration to AssistantSettingsForm). Manual checklist item 5 (Debug filters + metrics; Call single column) remains for UAT.

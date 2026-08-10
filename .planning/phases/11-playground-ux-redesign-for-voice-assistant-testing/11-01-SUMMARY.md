---
phase: 11-playground-ux-redesign-for-voice-assistant-testing
plan: 01
subsystem: ui
tags: [playground, call-first, mic, mute, mui, onboarding]

requires:
  - phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
    provides: first_call / playground_call_success analytics hooks
provides:
  - Call-first PlaygroundSessionV2 shell (no permanent dual-pane)
  - CallChrome + CallCenter states (empty/checklist/connecting/transcript/summary)
  - useMicPermission + mute/volume on usePlaygroundSession
  - Mobile sticky Start/Stop + assistant switch confirm
  - Onboarding ≥10s disconnect analytics preserved
affects:
  - 11-02 Setup sheet / AssistantSettingsForm
  - 11-03 Debug events sheet

tech-stack:
  added: []
  patterns:
    - "Call-first mode with stub MUI Drawers; session hook at orchestrator root"
    - "matchMedia max-width 899px for Playground mobile (not useDevice alone)"
    - "Mic probe stops tracks immediately; connect still owns real getUserMedia"

key-files:
  created:
    - src/features/PlaygroundSession/model/playgroundMode.ts
    - src/features/PlaygroundSession/model/playgroundMode.test.ts
    - src/features/PlaygroundSession/model/callCenterState.ts
    - src/features/PlaygroundSession/model/callCenterState.test.ts
    - src/features/PlaygroundSession/model/useMicPermission.ts
    - src/features/PlaygroundSession/model/useMicPermission.test.ts
    - src/features/PlaygroundSession/ui/CallChrome/CallChrome.tsx
    - src/features/PlaygroundSession/ui/CallCenter/CallCenter.tsx
    - src/pages/Playground/model/playgroundOnboardingGate.ts
    - src/pages/Playground/model/playgroundOnboardingGate.test.ts
    - src/pages/Playground/ui/Playground/Playground.test.tsx
  modified:
    - src/features/PlaygroundSession/ui/PlaygroundSessionV2/PlaygroundSessionV2.tsx
    - src/features/PlaygroundSession/model/usePlaygroundSession.ts
    - src/features/PlaygroundSession/lib/eventProcessor.ts
    - src/features/PlaygroundSession/model/types/sessionMetrics.ts
    - src/pages/Playground/ui/Playground/Playground.tsx
    - src/entities/Assistants/ui/AssistantSelect/AssistantSelect.tsx
    - public/locales/{ru,en,de,zh}/playground.json

key-decisions:
  - "Connecting timeout fixed at 18s per UI-SPEC discretion (D-41)"
  - "Mobile breakpoint uses MUI useMediaQuery('(max-width: 899px)') not useDevice"
  - "Setup/Debug remain stub drawers until 11-02/11-03"
  - "errorCount incremented on processEvent case 'error' for post-call summary"

patterns-established:
  - "PlaygroundSessionV2 mounts usePlaygroundSession once; mode only toggles overlays"
  - "Call center view resolved via pure callCenterState helpers"

requirements-completed: [PG-UX-01, PG-UX-04, PG-UX-05, PG-UX-06, PG-UX-08]

coverage:
  - id: D1
    description: Call-first mode shell with session hook stable across Setup/Debug
    requirement: PG-UX-01
    verification:
      - kind: unit
        ref: src/features/PlaygroundSession/model/playgroundMode.test.ts
        status: pass
    human_judgment: true
    rationale: Visual Call-first chrome verified by user after Task 1
  - id: D2
    description: Call center states, mic checklist, mute/volume, 18s connect timeout
    requirement: PG-UX-04
    verification:
      - kind: unit
        ref: src/features/PlaygroundSession/model/callCenterState.test.ts
        status: pass
      - kind: unit
        ref: src/features/PlaygroundSession/model/useMicPermission.test.ts
        status: pass
      - kind: unit
        ref: src/features/PlaygroundSession/lib/eventProcessor.test.ts#errorCount
        status: pass
    human_judgment: false
  - id: D3
    description: Mobile sticky bar + onboarding secondary chrome + switch confirm
    requirement: PG-UX-05
    verification:
      - kind: unit
        ref: src/pages/Playground/ui/Playground/Playground.test.tsx
        status: pass
    human_judgment: false
  - id: D4
    description: Onboarding disconnect ≥10s analytics preserved
    requirement: PG-UX-08
    verification:
      - kind: unit
        ref: src/pages/Playground/model/playgroundOnboardingGate.test.ts
        status: pass
      - kind: unit
        ref: src/pages/Playground/ui/Playground/Playground.test.tsx
        status: pass
    human_judgment: false

duration: 45min
completed: 2026-08-10
status: complete
---

# Phase 11 Plan 01: Call-first tracer Summary

**Call-first Playground chrome with checklist, 18s connecting timeout, mute/volume, mic probe, mobile sticky bar, and preserved ≥10s onboarding analytics — session hook stays mounted across mode toggles.**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-08-10T08:41:00Z (continuation from Task 2)
- **Completed:** 2026-08-10T09:10:00Z
- **Tasks:** 3/3
- **Files modified:** ~20

## Accomplishments

- Replaced permanent dual-pane `PlaygroundLayout` with CallChrome + CallCenter (D-10)
- Wave 0 unit tests for playgroundMode, callCenterState, useMicPermission, errorCount, onboarding gate
- Mute via `MediaStreamTrack.enabled`; playback volume via GainNode (D-30)
- Proactive mic permission probe stops tracks immediately (D-27)
- Mobile sticky Start/Stop under 899px; onboarding subdues Setup/Debug; switch confirm dialog

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `d31e894c` | feat(11-01): Call-first mode shell with stable session mount |
| 1b | `536eaf67` | fix(playground): stop assistant select label clipping under caret (user-verified fix) |
| 2 RED | `7954f25b` | test(11-01): add failing tests for call center, mic, errorCount |
| 2 GREEN | `443d56fb` | feat(11-01): Call center states, mic checklist, mute/volume, 18s timeout |
| 3 | `003ebe0f` | feat(11-01): mobile sticky bar, onboarding chrome, switch confirm |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical] AssistantSelect.disabled prop**
- **Found during:** Task 1
- **Issue:** Call chrome needs disable-while-connected (D-38) but AssistantSelect lacked `disabled`
- **Fix:** Added `disabled?: boolean` to BaseAssistantSelectProps
- **Files modified:** `src/entities/Assistants/ui/AssistantSelect/AssistantSelect.tsx`
- **Commit:** `d31e894c`

**2. [External] Assistant select label clipping**
- **Found during:** Task 1 human verify
- **Issue:** Combobox label clipped under caret
- **Fix:** Applied outside this executor as `536eaf67`
- **Commit:** `536eaf67`

## Known Stubs

| File | Stub | Reason | Resolves in |
|------|------|--------|-------------|
| PlaygroundSessionV2.tsx Setup Drawer | Stub body shows «Параметры» only | Full Setup sheet / AssistantSettingsForm | 11-02 |
| PlaygroundSessionV2.tsx Debug Drawer | Stub body shows «События» only | Events sheet + StatusBar metrics move | 11-03 |

Intentional per plan: tracer proves Call surface; Setup/Debug polish deferred.

## Threat Flags

None — no new network endpoints; transcript still rendered as React text; mic copy is neutral product copy.

## Next Phase Ready

Plans 11-02 (Setup sheet) and 11-03 (Debug sheet) can proceed; they replace the stub drawers without remounting `usePlaygroundSession`.

## Self-Check: PASSED

All key files and commits (`d31e894c`, `536eaf67`, `7954f25b`, `443d56fb`, `003ebe0f`) verified present.

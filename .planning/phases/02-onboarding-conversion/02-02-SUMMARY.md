---
phase: 02-onboarding-conversion
plan: 02
subsystem: ui
tags: [onboarding, playground, assistants, analytics, trackEvent, redesign-v3]

requires:
  - phase: 02-01
    provides: ProductForkStep, trackOnboardingEvent, branch-aware onboardingSlice
provides:
  - SimpleExampleStep replacing mandatory Telegram
  - PlaygroundGuideStep with Playground-first CTA
  - Playground call success detection (10s threshold)
  - TrunkWidgetStep post-success publish options
  - Events assistant_created, playground_call_success, onboarding_completed
affects: [02-03, 02-04]

tech-stack:
  added: []
  patterns:
    - "pauseOnboardingOverlay / resumeForPostSuccess for Playground handoff"
    - "Disconnect duration callback in usePlaygroundSession"
    - "Onboarding query params ?onboarding=assistants&assistantId="

key-files:
  created:
    - src/features/Onboarding/ui/steps/SimpleExampleStep.tsx
    - src/features/Onboarding/ui/steps/PlaygroundGuideStep.tsx
    - src/features/Onboarding/ui/steps/TrunkWidgetStep.tsx
  modified:
    - src/features/Onboarding/ui/OnboardingWizard/OnboardingWizard.tsx
    - src/features/Onboarding/ui/steps/BusinessTypeStep.tsx
    - src/features/Onboarding/model/slices/onboardingSlice.ts
    - src/features/PlaygroundSession/model/usePlaygroundSession.ts
    - src/features/PlaygroundSession/ui/PlaygroundSessionV2/PlaygroundSessionV2.tsx
    - src/pages/Playground/ui/Playground/Playground.tsx
    - public/locales/{ru,en}/onboarding.json
    - public/locales/{ru,en}/playground.json

key-decisions:
  - "PlaygroundGuide hides overlay via pauseOnboardingOverlay; TrunkWidget resumes on success"
  - "Call success = connected >= 10s before disconnect (UI callback, not billing)"
  - "Secondary exits on PlaygroundGuide call skipOnboarding (onboarding_skipped)"
  - "onboarding_completed tracked from completeOnboarding reducer"

patterns-established:
  - "Assistants steps: Welcome → BusinessType → SimpleExample → PlaygroundGuide → TrunkWidget"
  - "Preselect assistant in Playground via assistantId query param"

requirements-completed: [GAP-10-partial]

duration: 35min
completed: 2026-06-25
---

# Phase 02 Plan 02: Assistants Onboarding Path Summary

**Playground-first assistants onboarding: Simple Example step, mandatory call success detection, post-call trunk/widget offer with funnel events**

## Performance

- **Duration:** ~35 min
- **Started:** 2026-06-25T12:00:00Z
- **Completed:** 2026-06-25T12:35:00Z
- **Tasks:** 4
- **Files modified:** 12

## Accomplishments

- `SimpleExampleStep` replaces mandatory `TelegramStep` with scenario walkthrough and optional Telegram link
- `PlaygroundGuideStep` drives users to Playground without completing onboarding; tracks `assistant_created`
- `usePlaygroundSession` reports disconnect duration; fires `playground_call_success` after ≥10s connected call
- `TrunkWidgetStep` presents widget/SIP options after success; `onboarding_completed` on finish

## Task Commits

Each task was committed atomically:

1. **Task 1: SimpleExampleStep replaces TelegramStep** - `e08b5f05` (feat)
2. **Task 2: PlaygroundGuideStep + assistant_created** - `9b761f40` (feat)
3. **Task 3: Playground call success detection** - `505bb7e8` (feat)
4. **Task 4: TrunkWidgetStep post-success** - `68373dfa` (feat)

## Files Created/Modified

- `src/features/Onboarding/ui/steps/SimpleExampleStep.tsx` - Guided example with optional Telegram
- `src/features/Onboarding/ui/steps/PlaygroundGuideStep.tsx` - Primary Playground CTA, secondary skip links
- `src/features/Onboarding/ui/steps/TrunkWidgetStep.tsx` - Post-call widget/SIP cards and finish CTAs
- `src/features/Onboarding/ui/OnboardingWizard/OnboardingWizard.tsx` - Updated assistants step map
- `src/features/Onboarding/ui/steps/BusinessTypeStep.tsx` - `assistant_created` event on create
- `src/features/Onboarding/model/slices/onboardingSlice.ts` - pause/resume overlay, `onboarding_completed` event
- `src/features/PlaygroundSession/model/usePlaygroundSession.ts` - Connected duration on disconnect
- `src/pages/Playground/ui/Playground/Playground.tsx` - Onboarding mode detection and success handler
- `public/locales/{ru,en}/onboarding.json` - New step strings
- `public/locales/{ru,en}/playground.json` - Success toast string

## Decisions Made

- Overlay paused (not completed) when navigating to Playground so user can interact with the page
- TrunkWidget CTAs that navigate to publish routes also call `completeOnboarding` to close funnel
- `TelegramStep` and `CompletionStep` files retained but removed from assistants step map

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added pauseOnboardingOverlay and resumeForPostSuccess reducers**
- **Found during:** Task 2 (PlaygroundGuideStep)
- **Issue:** Navigating to Playground while wizard overlay active would block the Playground UI
- **Fix:** Pause overlay on navigate; resume to step 5 (TrunkWidget) after call success
- **Files modified:** `onboardingSlice.ts`
- **Committed in:** `9b761f40`

**2. [Rule 2 - Missing Critical] Added onboarding_completed to completeOnboarding reducer**
- **Found during:** Task 4 (TrunkWidgetStep)
- **Issue:** Plan requires `onboarding_completed` event; reducer did not track it
- **Fix:** `trackOnboardingEvent('onboarding_completed', ...)` in `completeOnboarding`
- **Files modified:** `onboardingSlice.ts`
- **Committed in:** `9b761f40`

---

**Total deviations:** 2 auto-fixed (2 missing critical)
**Impact on plan:** Required for correct Playground handoff and funnel measurement.

## Known Stubs

| File | Reason | Resolved by |
|------|--------|-------------|
| `TelegramStep.tsx` | Removed from flow; file kept for optional future deep-link | N/A (optional integration) |
| `CompletionStep.tsx` | Replaced by PlaygroundGuide + TrunkWidget | N/A |

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **02-03** can implement analytics branch without assistants path changes
- **02-04** can document GA4/Metrika goals for events now firing (`assistant_created`, `playground_call_success`, `onboarding_completed`)

## Self-Check: PASSED

- FOUND: src/features/Onboarding/ui/steps/SimpleExampleStep.tsx
- FOUND: src/features/Onboarding/ui/steps/PlaygroundGuideStep.tsx
- FOUND: src/features/Onboarding/ui/steps/TrunkWidgetStep.tsx
- FOUND: commit e08b5f05
- FOUND: commit 9b761f40
- FOUND: commit 505bb7e8
- FOUND: commit 68373dfa
- npm run test:unit: 86 passed

---
*Phase: 02-onboarding-conversion*
*Completed: 2026-06-25*

---
phase: 02-onboarding-conversion
plan: 01
subsystem: ui
tags: [onboarding, redux, analytics, product-fork, trackEvent]

requires: []
provides:
  - Extended OnboardingState with productPath and milestone flags
  - ProductForkStep dual-product choice UI
  - trackOnboardingEvent funnel helper
  - Branch-aware OnboardingWizard routing
  - Re-entry button in AvatarDropdown for completed users
affects: [02-02, 02-03, 02-04]

tech-stack:
  added: []
  patterns:
    - "Branch-aware onboarding slice with per-path step limits"
    - "trackOnboardingEvent wrapper over initAnalytics trackEvent"
    - "Product fork as step 0 before path-specific step maps"

key-files:
  created:
    - src/features/Onboarding/ui/steps/ProductForkStep.tsx
    - src/features/Onboarding/ui/steps/AnalyticsWelcomeStep.tsx
    - src/features/Onboarding/lib/onboardingAnalytics.ts
  modified:
    - src/features/Onboarding/model/types/onboarding.ts
    - src/features/Onboarding/model/slices/onboardingSlice.ts
    - src/features/Onboarding/model/selectors/onboardingSelectors.ts
    - src/features/Onboarding/ui/OnboardingWizard/OnboardingWizard.tsx
    - src/features/avatarDropdown/ui/AvatarDropdown/AvatarDropdown.tsx
    - public/locales/ru/onboarding.json
    - public/locales/en/onboarding.json

key-decisions:
  - "Analytics branch uses AnalyticsWelcomeStep placeholder until plan 02-03"
  - "Re-entry placed in AvatarDropdown for all users when onboarding_completed"
  - "Product fork events fire from ProductForkStep; step/skip events from slice"

patterns-established:
  - "productPath null → ProductForkStep; assistants/analytics use separate step maps"
  - "resetForReentry clears fork state without wiping createdAssistantId"

requirements-completed: [GAP-10-partial, GAP-16-partial]

duration: 45min
completed: 2026-06-25
---

# Phase 02 Plan 01: Onboarding Fork Shell Summary

**Dual-product onboarding fork with branch-aware Redux state, GA4/Metrika funnel events, and single re-entry control in AvatarDropdown**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-06-25T00:00:00Z
- **Completed:** 2026-06-25T00:45:00Z
- **Tasks:** 4
- **Files modified:** 11

## Accomplishments

- Extended `OnboardingState` with `productPath`, success milestones, and `resetForReentry`
- `ProductForkStep` renders Voice Assistants vs Speech Analytics choice at signup and re-entry
- `trackOnboardingEvent` wires `onboarding_started`, product selection, step navigation, and skip events
- All authenticated users with completed onboarding see «Начать обучение» / «Product tour» in avatar menu

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend onboarding state and selectors** - `8b2d29ab` (feat)
2. **Task 2: ProductForkStep + wizard routing** - `3a97c44c` (feat)
3. **Task 3: onboardingAnalytics helper + step/skip events** - `d9cac2e1` (feat)
4. **Task 4: Re-entry button** - `68b1ae6f` (feat)

## Files Created/Modified

- `src/features/Onboarding/model/types/onboarding.ts` - productPath type, storage keys, branch step helpers
- `src/features/Onboarding/model/slices/onboardingSlice.ts` - branch reducers, analytics side effects
- `src/features/Onboarding/model/selectors/onboardingSelectors.ts` - productPath and branch step selectors
- `src/features/Onboarding/ui/steps/ProductForkStep.tsx` - dual-product fork UI (data-testid onboarding-product-fork)
- `src/features/Onboarding/ui/steps/AnalyticsWelcomeStep.tsx` - wave 1 analytics entry placeholder
- `src/features/Onboarding/ui/OnboardingWizard/OnboardingWizard.tsx` - branch-aware step routing
- `src/features/Onboarding/lib/onboardingAnalytics.ts` - typed trackEvent wrapper
- `src/features/avatarDropdown/ui/AvatarDropdown/AvatarDropdown.tsx` - re-entry for all users
- `public/locales/{ru,en}/onboarding.json` - fork and re-entry i18n keys

## Decisions Made

- Used `redesign-v3/Button` for fork cards; `Text`/`VStack` from redesigned stack (v3 Text/VStack not yet in repo)
- Analytics path ends at placeholder welcome step in wave 1; full project/upload flow deferred to 02-03

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

| File | Reason | Resolved by |
|------|--------|-------------|
| `AnalyticsWelcomeStep.tsx` | Wave 1 analytics entry placeholder; skip-only until embedded ProjectWizard | Plan 02-03 |

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **02-02** can extend assistants step map (SimpleExample, PlaygroundGate, PostSuccess)
- **02-03** can replace AnalyticsWelcomeStep with embedded OA wizard steps
- **02-04** can document GA4/Metrika goals for events now firing in code

## Self-Check: PASSED

- FOUND: src/features/Onboarding/ui/steps/ProductForkStep.tsx
- FOUND: src/features/Onboarding/lib/onboardingAnalytics.ts
- FOUND: src/features/Onboarding/model/types/onboarding.ts
- FOUND: commit 8b2d29ab
- FOUND: commit 3a97c44c
- FOUND: commit d9cac2e1
- FOUND: commit 68b1ae6f
- npm run test:unit: 86 passed

---
*Phase: 02-onboarding-conversion*
*Completed: 2026-06-25*

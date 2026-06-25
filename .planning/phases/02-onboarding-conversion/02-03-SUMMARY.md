---
phase: 02-onboarding-conversion
plan: 03
subsystem: ui
tags: [onboarding, analytics, operator-analytics, trackEvent, redesign-v3, dashboard-tour]

requires:
  - phase: 02-01
    provides: ProductForkStep, trackOnboardingEvent, branch-aware onboardingSlice
provides:
  - OnboardingAnalyticsFlow with project create, upload, API intro
  - Dashboard spotlight tour after first analysis
  - Events oa_project_created, oa_file_uploaded, oa_first_analysis_complete
affects: [02-04]

tech-stack:
  added: []
  patterns:
    - "Internal analytics sub-steps 1-4 via onboardingSlice currentStep"
    - "pauseOnboardingOverlay + dashboard route tour query params"
    - "useBatchProgress onBatchFinished callback for funnel completion"

key-files:
  created:
    - src/features/Onboarding/ui/analytics/OnboardingAnalyticsFlow.tsx
    - src/features/Onboarding/ui/analytics/OnboardingAnalyticsSteps.tsx
    - src/features/Onboarding/ui/analytics/OnboardingDashboardTour.tsx
    - src/features/Onboarding/ui/analytics/OnboardingAnalyticsFlow.module.scss
    - src/features/Onboarding/ui/analytics/OnboardingDashboardTour.module.scss
  modified:
    - src/features/Onboarding/ui/OnboardingWizard/OnboardingWizard.tsx
    - src/features/Onboarding/model/types/onboarding.ts
    - src/features/Onboarding/model/slices/onboardingSlice.ts
    - src/features/OperatorAnalytics/ui/OperatorUploadForm/OperatorUploadForm.tsx
    - src/features/Calls/lib/useBatchProgress.ts
    - src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx
    - src/pages/DashboardCallRecordsPage/ui/DashboardCallRecordsPage/DashboardCallRecordsPage.tsx
    - public/locales/{ru,en}/onboarding.json

key-decisions:
  - "Analytics wizard uses 4 onboardingSlice steps; dashboard tour runs on call-records page"
  - "Project created at end of metrics step (step 3) before upload"
  - "API intro is secondary panel on upload step, not a separate backend connector"
  - "Custom spotlight overlay (no react-joyride) with data-tour-id anchors"

patterns-established:
  - "Analytics path: Welcome → Project/Template → Metrics+Create → Upload → Dashboard tour"
  - "oa_first_analysis_complete triggers navigate to /dashboard/call-records?onboarding=analytics&tour=1"

requirements-completed: [GAP-10-partial]

duration: 45min
completed: 2026-06-25
---

# Phase 02 Plan 03: Speech Analytics Onboarding Path Summary

**Guided analytics onboarding from product fork through project creation, first recording analysis, and a 3-step dashboard spotlight tour with full funnel events**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-06-25T14:00:00Z
- **Completed:** 2026-06-25T14:45:00Z
- **Tasks:** 4
- **Files modified:** 14

## Accomplishments

- `OnboardingAnalyticsFlow` replaces `AnalyticsWelcomeStep` stub with 4-step guided path (welcome, template/name, metrics, upload)
- Project creation reuses `projectWizard` slice + `useCreateOperatorProject`; fires `oa_project_created`
- Inline upload via extended `OperatorUploadForm` with `fixedProjectId`; batch polling fires `oa_first_analysis_complete`
- API intro panel on upload step links to `/analytics/api` without new backend endpoints
- `OnboardingDashboardTour` spotlight overlay on `OperatorDashboard` after analysis; `onboarding_completed` / `onboarding_skipped` on tour end/skip

## Task Commits

Each task was committed atomically:

1. **Task 1: OnboardingAnalyticsFlow shell (D-08, D-17)** - `19e2e62e` (feat)
2. **Task 2: Upload step + batch completion (D-09, D-11)** - `442ed5b0` (feat)
3. **Task 3: API intro step (D-09)** - `f088b9d6` (feat)
4. **Task 4: Dashboard tour (D-10, D-13, D-17)** - `7d85496d` (feat)

## Files Created/Modified

- `src/features/Onboarding/ui/analytics/OnboardingAnalyticsFlow.tsx` - Analytics branch coordinator with batch polling
- `src/features/Onboarding/ui/analytics/OnboardingAnalyticsSteps.tsx` - Step components + API intro panel
- `src/features/Onboarding/ui/analytics/OnboardingDashboardTour.tsx` - Portal-based spotlight tour
- `src/features/Onboarding/ui/OnboardingWizard/OnboardingWizard.tsx` - Routes analytics to OnboardingAnalyticsFlow
- `src/features/OperatorAnalytics/ui/OperatorUploadForm/OperatorUploadForm.tsx` - `fixedProjectId`, `onUploadStart`, `compact`
- `src/features/Calls/lib/useBatchProgress.ts` - Optional `onBatchFinished` callback
- `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx` - `data-tour-id` anchors + always-visible scorecard card
- `src/pages/DashboardCallRecordsPage/.../DashboardCallRecordsPage.tsx` - Tour activation from URL params
- `public/locales/{ru,en}/onboarding.json` - Analytics path strings

## Decisions Made

- Metrics step creates project (not template step) so custom metrics from template are included
- Dashboard tour runs after `pauseOnboardingOverlay` on the call-records page, not inside wizard overlay
- Insights tour step falls back to stats grid when insights banner is not yet available

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Always render operator scorecard tour target**
- **Found during:** Task 4 (Dashboard tour)
- **Issue:** Scorecard section was conditional on `agentScorecards.length`; tour step 2 would have no anchor for new projects
- **Fix:** Always render scorecard card with empty-state text and `data-tour-id="oa-scorecard"`
- **Files modified:** `OperatorDashboard.tsx`
- **Committed in:** `7d85496d`

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Required for reliable tour spotlight on first-time users.

## Known Stubs

| File | Reason | Resolved by |
|------|--------|-------------|
| `AnalyticsWelcomeStep.tsx` | Replaced by OnboardingAnalyticsFlow step 1 | N/A (file retained, unused in map) |

## Issues Encountered

None

## User Setup Required

None

## Next Phase Readiness

- **02-04** can document GA4/Metrika goals for `oa_project_created`, `oa_file_uploaded`, `oa_first_analysis_complete`
- Docs screenshots for OA wizard/upload/dashboard remain in GAP-14 scope

## Self-Check: PASSED

- FOUND: src/features/Onboarding/ui/analytics/OnboardingAnalyticsFlow.tsx
- FOUND: src/features/Onboarding/ui/analytics/OnboardingDashboardTour.tsx
- FOUND: commit 19e2e62e
- FOUND: commit 442ed5b0
- FOUND: commit f088b9d6
- FOUND: commit 7d85496d
- npm run test:unit: 86 passed

---
*Phase: 02-onboarding-conversion*
*Completed: 2026-06-25*

---
phase: 02-onboarding-conversion
reviewed: 2026-06-25T18:00:00Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - src/features/Onboarding/ui/analytics/OnboardingAnalyticsFlow.tsx
  - src/features/Onboarding/ui/analytics/OnboardingAnalyticsSteps.tsx
  - src/features/Onboarding/ui/analytics/OnboardingDashboardTour.tsx
  - src/features/Onboarding/model/slices/onboardingSlice.ts
  - src/features/Calls/lib/useBatchProgress.ts
  - src/pages/DashboardCallRecordsPage/ui/DashboardCallRecordsPage/DashboardCallRecordsPage.tsx
  - src/features/OperatorAnalytics/ui/OperatorUploadForm/OperatorUploadForm.tsx
findings:
  critical: 2
  warning: 4
  info: 2
  total: 8
status: issues_found
---

# Phase 2: Onboarding Conversion — Code Review Report

**Reviewed:** 2026-06-25T18:00:00Z  
**Depth:** standard  
**Files Reviewed:** 7  
**Status:** issues_found

## Summary

Review focused on the reported analytics onboarding bug: after file upload and batch processing, the upload form reappears instead of navigating to `OperatorDashboard` with the guided tour (D-10 / D-11).

The implementation wires batch completion through `useBatchProgress` → `handleBatchFinished` → `pauseOnboardingOverlay` + `navigate(?onboarding=analytics&tour=1)`. The upload form visibility is gated only by `!batchIsActive && !analysisComplete`. **When batch polling ends without entering the success branch in `handleBatchFinished`, both flags become false/true in the wrong combination and the upload form is shown again with no error state.** This matches the user report.

Secondary gaps: dashboard tour targets may be missing on first load (`insightsAvailable`), no tests for the upload→dashboard transition, and fragile unmount-during-callback pattern.

---

## Root Cause Analysis — Upload Form Re-Opens After Analysis

### Symptom chain

1. User uploads on step 4 → `OperatorUploadForm` calls `onBatchStarted(batchId)` → `useBatchProgress.startPolling`.
2. `AnalyticsUploadStep` shows progress while `batchIsActive === true`.
3. When the backend batch finishes, `useBatchProgress.pollOneBatch` removes the batch from local state → **`batchIsActive` becomes `false`**.
4. `onBatchFinished` → `handleBatchFinished` runs.
5. **Only if `status.completed >= 1`:** Redux `setOaAnalysisCompleted(true)`, `pauseOnboardingOverlay()`, `navigate` to dashboard with tour params.
6. If that guard fails, **`analysisComplete` stays `false`** and overlay stays active (`isActive` still `true` because `pauseOnboardingOverlay` was never dispatched).
7. `AnalyticsUploadStep` condition `!batchIsActive && !analysisComplete` is satisfied → **`OperatorUploadForm` renders again**.

### Primary root cause (BLOCKER)

`handleBatchFinished` treats batch end and analysis success as the same event, but only acts on success:

```43:61:src/features/Onboarding/ui/analytics/OnboardingAnalyticsFlow.tsx
    const handleBatchFinished = useCallback((status: { completed: number; finishedAt?: string | null }) => {
        if (status.completed >= 1) {
            dispatch(onboardingActions.setOaAnalysisCompleted(true))
            trackOnboardingEvent('oa_first_analysis_complete', { ... })
            setNavigatingToDashboard(true)
            dispatch(onboardingActions.pauseOnboardingOverlay())
            navigate(`${getRouteDashboardCallRecords()}?${params.toString()}`)
        }
    }, [dispatch, navigate, projectId])
```

**Any finished batch with `completed === 0`** (all items failed, partial backend count mismatch, or transient API shape) leaves the user on step 4 with the upload form restored. `useBatchProgress` still shows the completion toast (`Обработка завершена: 0 из N`), so the user perceives “analysis finished” while the UI resets to upload — exactly the reported bug.

There is **no `else` branch** for finished-but-failed batches: no error message, no retry CTA, no navigation.

### Contributing UI logic (same file)

```328:340:src/features/Onboarding/ui/analytics/OnboardingAnalyticsSteps.tsx
            {!batchIsActive && !analysisComplete && !showApiIntro && (
                <>
                    <OperatorUploadForm
                        compact
                        fixedProjectId={projectId}
                        onUploadStart={onUploadStart}
                        onBatchStarted={onBatchStarted}
                    />
```

The form reappears whenever polling ends without Redux `oaAnalysisCompleted` being set. Local `navigatingToDashboard` only flips inside the success guard, so it cannot mask the gap.

### Expected behavior (D-10 / D-11)

Per `02-CONTEXT.md`: first success = file uploaded **and analysis completed** → show `OperatorDashboard` capabilities via guided tour. The code intends this via dashboard navigation + `OnboardingDashboardTour`, but the success gate is too narrow and the failure path is unhandled.

### Recommended fix (upload flow)

```typescript
const handleBatchFinished = useCallback((status: BatchStatusResponse) => {
  const finished = Boolean(status.finishedAt)
  if (!finished) return

  if (status.completed >= 1) {
    dispatch(onboardingActions.setOaAnalysisCompleted(true))
    setNavigatingToDashboard(true)
    trackOnboardingEvent('oa_first_analysis_complete', { productPath: 'analytics', projectId: projectId ?? undefined, completed: status.completed })
    dispatch(onboardingActions.pauseOnboardingOverlay())
    const params = new URLSearchParams({ onboarding: 'analytics', tour: '1' })
    if (projectId) params.set('projectId', projectId)
    navigate(`${getRouteDashboardCallRecords()}?${params.toString()}`)
    return
  }

  // Batch finished but no successful analyses — do NOT restore upload form silently
  dispatch(onboardingActions.setError(
    t('analytics_analysis_failed', 'Не удалось проанализировать запись. Попробуйте другой файл или повторите загрузку.')
  ))
}, [dispatch, navigate, projectId, t])
```

Additional hardening:

- Set `oaAnalysisCompleted` / `navigatingToDashboard` **before** batch hook clears `isActive`, or add Redux flag `oaUploadInProgress` set in `onBatchStarted` and cleared only on terminal outcomes.
- In `AnalyticsUploadStep`, hide `OperatorUploadForm` when `batchIsActive || analysisComplete || navigatingToDashboard || oaUploadInProgress`.
- Add unit tests for `handleBatchFinished` success, all-failed, and zero-completed paths.

---

## Critical Issues

### CR-01: Finished batch with zero completions silently restores upload form (reported bug)

**File:** `src/features/Onboarding/ui/analytics/OnboardingAnalyticsFlow.tsx:43-61`  
**Issue:** `handleBatchFinished` no-ops when `status.completed < 1`. `useBatchProgress` still marks the batch finished (`batchIsActive → false`), so `AnalyticsUploadStep` shows `OperatorUploadForm` again. User sees completion toast but remains trapped on upload step instead of dashboard/tour. Violates D-11 and D-10.  
**Fix:** Handle all terminal batch outcomes explicitly (see root-cause fix above). Never leave `!batchIsActive && !analysisComplete` without user-facing error or forward navigation.

### CR-02: No bridge state between batch end and overlay dismissal

**File:** `src/features/Onboarding/ui/analytics/OnboardingAnalyticsFlow.tsx:86-93`, `OnboardingAnalyticsSteps.tsx:328-340`  
**Issue:** `analysisComplete` and `navigatingToDashboard` are only set inside the `completed >= 1` branch. Between `setBatches` deleting the finished batch and Redux updates landing, React can render one frame (or persist, if success branch never runs) with upload form visible.  
**Fix:** Set `onboardingActions.setOaAnalysisCompleted(true)` or a dedicated `setOaUploadAwaitingDashboard(true)` in `onBatchStarted` / at start of `handleBatchFinished` before clearing batch state; pass that flag into `AnalyticsUploadStep` to suppress form re-entry.

---

## Warnings

### WR-01: Dashboard tour first step target may be absent after first analysis

**File:** `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx:200-212`, `OnboardingDashboardTour.tsx:61-68`  
**Issue:** `data-tour-id="oa-insights"` is rendered only when `data?.insightsAvailable` is true. Immediately after first analysis, insights may not be ready; tour step 1 finds no element (fallback to `oa-stats` only for `oa-insights` target). Tour shows with full backdrop and weak spotlight — poor D-10 experience.  
**Fix:** Always render a tour anchor for insights (empty-state placeholder), or reorder tour to start with `oa-scorecard` / `oa-stats` which are always present; defer insights step until `insightsAvailable`.

### WR-02: Tour measures DOM before dashboard finishes loading

**File:** `src/features/Onboarding/ui/analytics/OnboardingDashboardTour.tsx:80-92`  
**Issue:** `measureTarget` runs on mount + 300ms timeout. `OperatorDashboard` may still be in skeleton state (`isLoading || isFetching`), so `data-tour-id` nodes are absent and `rect` stays `null`.  
**Fix:** Pass `ready={!isLoading && !!dashboardData}` from `DashboardCallRecordsPage` into tour; re-measure when data loads.

### WR-03: `pauseOnboardingOverlay` invoked from inside batch hook callback that unmounts owner

**File:** `src/features/Onboarding/ui/analytics/OnboardingAnalyticsFlow.tsx:51-52`  
**Issue:** `onBatchFinished` is called from `useBatchProgress` inside `OnboardingAnalyticsFlowContent`. `pauseOnboardingOverlay` unmounts that component (and the hook) in the same synchronous stack. Works today because `navigate()` runs after, but fragile if effect ordering changes.  
**Fix:** Move batch polling to a parent that survives overlay pause (e.g. `OnboardingWizard` shell), or dispatch navigation first then pause on next tick / `queueMicrotask`.

### WR-04: `completeOnboarding` only fires when tour finishes — not when analysis succeeds

**File:** `src/features/Onboarding/ui/analytics/OnboardingDashboardTour.tsx:105-108`, `onboardingSlice.ts:141-147`  
**Issue:** If user closes tab after analysis but before tour, or tour params are stripped, `onboarding_completed` is never written. Re-entry behavior is ambiguous.  
**Fix:** Mark a milestone in `handleBatchFinished` (e.g. `setOaAnalysisCompleted` + optional `localStorage` flag) and keep `completeOnboarding` for tour/skip only.

---

## Info

### IN-01: No unit/integration tests for analytics upload → dashboard transition

**File:** `src/features/Onboarding/ui/analytics/` (missing `*.test.tsx`)  
**Issue:** `ProductForkStep` and `onboardingAnalytics` have tests; the upload completion path that causes the reported bug is untested.  
**Fix:** Add tests mocking `useBatchProgress` / `handleBatchFinished` for success, all-failed, and navigation side effects.

### IN-02: Hardcoded Russian metric labels in onboarding step

**File:** `src/features/Onboarding/ui/analytics/OnboardingAnalyticsSteps.tsx:40-50`  
**Issue:** `DEFAULT_METRIC_LABELS` uses Russian literals; project rule requires i18n `ru` + `en`. Not related to upload bug but violates D-17/i18n convention.  
**Fix:** Move labels to `public/locales/{en,ru}/onboarding.json` or reuse existing `reports` keys.

---

_Reviewed: 2026-06-25T18:00:00Z_  
_Reviewer: Claude (gsd-code-reviewer)_  
_Depth: standard_

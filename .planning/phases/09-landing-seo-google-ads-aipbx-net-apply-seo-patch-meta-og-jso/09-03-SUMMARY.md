---
phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
plan: 03
subsystem: analytics
tags: [gtag, Google Ads, GA4, conversion, initAnalytics, jest]

requires:
  - phase: 09-01
    provides: "__GOOGLE_ADS_ID__ / __GA4_MEASUREMENT_ID__ / __ADS_SIGNUP_LABEL__ build constants + Jest globals"
provides:
  - "initAnalytics configures GA4 with send_page_view:false and Ads when IDs set"
  - "fireAdsConversion(label, params) guarded Google-only conversion helper"
  - "mock-gtag unit tests for D-06/D-07"
affects:
  - 09-05 funnel wiring (signup/payment conversion sites)

tech-stack:
  added: []
  patterns:
    - "Single gtag.js load; second gtag('config', adsId) for AW-; Ads conversion Google-only (no ym dual-dispatch)"
    - "GA4 send_page_view:false so SPA owns manual page_view (Pitfall 5)"

key-files:
  created:
    - src/shared/config/analytics/initAnalytics.test.ts
  modified:
    - src/shared/config/analytics/initAnalytics.ts

key-decisions:
  - "Ads config runs in a separate guarded block after GA4 init (requires window.gtag)"
  - "fireAdsConversion never dual-dispatches to Metrika; no PII in conversion params"

patterns-established:
  - "Analytics unit tests stub window.gtag / dataLayer and override Jest globals per-test; do not mock the module under test"

requirements-completed: [D-06, D-07]

duration: 8min
completed: 2026-07-21
---

# Phase 09 Plan 03: Google Ads initAnalytics + fireAdsConversion Summary

**Extended `initAnalytics` with Ads `gtag('config')`, GA4 `send_page_view:false`, and guarded `fireAdsConversion` — proven by mock-gtag unit tests (D-06/D-07)**

## Performance

- **Duration:** 8 min
- **Started:** 2026-07-21T08:50:11Z
- **Completed:** 2026-07-21T08:57:58Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- GA4 config now passes `{ send_page_view: false }` so route-level page_view stays SPA-owned (Pitfall 5)
- When `__GOOGLE_ADS_ID__` is set and `window.gtag` exists, a second `gtag('config', adsId)` runs
- Exported `fireAdsConversion(label, params?)` → `gtag('event','conversion',{ send_to: \`${adsId}/${label}\`, ...params })` with no-op when Ads ID or gtag missing
- Added colocated unit tests covering Ads+GA4 config, conversion `send_to`, params merge, and no-op branches

## Task Commits

Each task was committed atomically (TDD):

1. **Task 1 RED → Task 2 test file:** `8c60cdc8` (test) — failing mock-gtag suite for Ads config + `fireAdsConversion`
2. **Task 1 GREEN:** `d8773851` (feat) — implement Ads config / `fireAdsConversion` + eslint void-expression fixes in test

**Plan metadata:** (pending docs commit)

_Note: Task 2’s artifact was created in the TDD RED commit; GREEN landed the implementation that makes the suite pass._

## Files Created/Modified

- `src/shared/config/analytics/initAnalytics.ts` — Ads ID read, `send_page_view:false`, Ads config block, `fireAdsConversion` export
- `src/shared/config/analytics/initAnalytics.test.ts` — mock `window.gtag` / `dataLayer`; per-test global overrides; D-06/D-07 coverage

## Decisions Made

- Place Ads `gtag('config')` in its own `if (adsId && window.gtag)` block after the GA4 block (matches RESEARCH; gtag created only when GA4 ID set)
- Keep Ads conversion Google-only — do not call `ym` from `fireAdsConversion`
- Document non-PII constraint in a brief JSDoc on `fireAdsConversion` (T-09-06)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] ESLint `no-confusing-void-expression` in new test**
- **Found during:** Task 1 GREEN verification (`eslint` on analytics files)
- **Issue:** Arrow shorthand returned void from `el.remove()` and `fireAdsConversion(...)` inside `expect(() => ...)`
- **Fix:** Wrap bodies in braces
- **Files modified:** `src/shared/config/analytics/initAnalytics.test.ts`
- **Verification:** `npx eslint` on both analytics files — 0 errors; `npm run test:unit -- initAnalytics` — 5/5 pass
- **Committed in:** `d8773851`

---

**Total deviations:** 1 auto-fixed (Rule 1)
**Impact on plan:** None — lint gate for new code green; no scope change.

## Issues Encountered

- Repo-wide `npm run lint:ts` still exits non-zero due to pre-existing warnings/errors in unrelated files (out of scope). Targeted eslint on the two analytics files is clean.

## User Setup Required

Local/prod `.env` must set `GA4_MEASUREMENT_ID` and `GOOGLE_ADS_ID` for configs/conversions to fire (empty = inert no-op). Funnel call sites land in 09-05.

## Next Phase Readiness

09-05 can import `fireAdsConversion` / `trackEvent` at signup success handlers. Manual SPA `page_view` wiring (also 09-05) assumes `send_page_view:false` already in place.

## Self-Check: PASSED

- FOUND: `src/shared/config/analytics/initAnalytics.ts`
- FOUND: `src/shared/config/analytics/initAnalytics.test.ts`
- FOUND: commit `8c60cdc8`
- FOUND: commit `d8773851`

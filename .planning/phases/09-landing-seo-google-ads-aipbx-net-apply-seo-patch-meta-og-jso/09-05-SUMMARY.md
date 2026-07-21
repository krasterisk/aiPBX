---
phase: 09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso
plan: 05
subsystem: analytics
tags: [ga4, google-ads, funnel, signup_complete, payment_success, page_view, first_call]

requires:
  - phase: 09-03
    provides: trackEvent + fireAdsConversion + GA4 send_page_view:false
provides:
  - signup_complete GA4 event + Ads conversion at 3 signup success sites
  - SPA route-change page_view
  - first_call alongside playground_call_success
  - payment_success on BillingPage verified success branch
  - useSignupData + BillingPage funnel unit tests
affects: [09-07, google-ads-import, gtm-measurement]

tech-stack:
  added: []
  patterns:
    - "Fire funnel/Ads only inside .then()/verified-success branches (never code-sent, catch, mount)"
    - "SPA page_view via useEffect(pathname) paired with send_page_view:false"
    - "payment_success on frontend return route (BillingPage), not billing core"

key-files:
  created:
    - src/features/Auth/lib/hooks/useSignupData.test.ts
    - src/pages/BillingPage/ui/BillingPage/BillingPage.test.tsx
  modified:
    - src/features/Auth/lib/hooks/useSignupData.ts
    - src/app/App.tsx
    - src/pages/Playground/ui/Playground/Playground.tsx
    - src/pages/BillingPage/ui/BillingPage/BillingPage.tsx
    - .planning/phases/09-landing-seo-google-ads-aipbx-net-apply-seo-patch-meta-og-jso/09-05-PLAN.md

key-decisions:
  - "payment_success wired on BillingPage verified success (alternate-return-route), not PaymentPage mount"
  - "first_call emitted alongside playground_call_success for GTM continuity"
  - "signup Ads conversion only on google/telegram/email-activation success (not email-code-sent)"

patterns-established:
  - "Funnel events: mock trackEvent/fireAdsConversion in colocated Jest; assert success + negative paths"
  - "Exactly-once payment_success via ref guard on verified succeeded branch"

requirements-completed: [D-06, D-07]

duration: 35min
completed: 2026-07-21
---

# Phase 09 Plan 05: GA4 Funnel + Ads Conversion Summary

**Full GA4 funnel (signup_complete, page_view, first_call, payment_success) plus Ads signup conversion wired without touching billing/ari/accounting/payment API/checkout core.**

## Performance

- **Duration:** ~35 min (including founder payment-surface checkpoint)
- **Started:** 2026-07-21T09:17:00Z
- **Completed:** 2026-07-21T09:46:00Z
- **Tasks:** 5/5
- **Files modified:** 7

## Accomplishments

- Fired `signup_complete` + `fireAdsConversion(__ADS_SIGNUP_LABEL__)` on Google, Telegram, and email-activation success only
- Added SPA `page_view` on pathname change and non-breaking `first_call` next to `playground_call_success`
- Wired `payment_success` on founder-approved `BillingPage` verified success branch (Robokassa/Stripe `succeeded`)
- Fail-closed unit tests for signup funnel and BillingPage payment_success

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Failing funnel test** - `bb61c403` (test)
2. **Task 1 GREEN: signup_complete + Ads conversion** - `215f28e3` (feat)
3. **Task 2: useSignupData funnel unit coverage** - `cca9f989` (test)
4. **Task 3: SPA page_view + first_call** - `9c88870f` (feat)
5. **Task 4: Founder decision** - checkpoint (`alternate-return-route` → BillingPage)
6. **Task 5: payment_success on BillingPage** - `2f6eb834` (feat)

**Plan metadata:** (docs commit after this SUMMARY)

## Files Created/Modified

- `src/features/Auth/lib/hooks/useSignupData.ts` - signup_complete + Ads conversion at 3 success sites
- `src/features/Auth/lib/hooks/useSignupData.test.ts` - funnel unit tests (success + negatives)
- `src/app/App.tsx` - manual gtag page_view on pathname change
- `src/pages/Playground/ui/Playground/Playground.tsx` - first_call alongside playground_call_success
- `src/pages/BillingPage/ui/BillingPage/BillingPage.tsx` - payment_success on verified success only
- `src/pages/BillingPage/ui/BillingPage/BillingPage.test.tsx` - fail-closed payment_success assertions
- `09-05-PLAN.md` - files_modified/Task 5 retargeted to BillingPage after founder decision

## Decisions Made

- Founder selected `alternate-return-route`: `src/pages/BillingPage/ui/BillingPage/BillingPage.tsx` (PaymentPage has no success signal)
- Keep `playground_call_success` and also emit `first_call`
- No PII in event params (method string only for signup)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] promise-function-async lint on test mocks**
- **Found during:** Task 1/2 verification
- **Issue:** Jest unwrap mocks returning `Promise.resolve` violated `@typescript-eslint/promise-function-async`
- **Fix:** Switched mocks to `async () => ...`
- **Files modified:** `useSignupData.test.ts`
- **Verification:** eslint clean on file; tests green
- **Committed in:** `cca9f989`

**2. [Rule 2 - Critical] Retarget payment_success to BillingPage**
- **Found during:** Task 4 checkpoint / Task 5
- **Issue:** Plan defaulted to PaymentPage, which has no success branch
- **Fix:** Founder-approved BillingPage; updated PLAN files_modified + Task 5 paths; wired only on `status === 'succeeded'`
- **Files modified:** `BillingPage.tsx`, `BillingPage.test.tsx`, `09-05-PLAN.md`
- **Verification:** `npm run test:unit -- BillingPage` green; no billing/ari/accounting/payment-api/CheckoutByRobokassa diffs
- **Committed in:** `2f6eb834` (+ docs commit for PLAN)

---

**Total deviations:** 2 auto-fixed (1 Rule 3, 1 Rule 2/checkpoint)
**Impact on plan:** Required for correctness and scope compliance; no billing-core edits

## Issues Encountered

- Task 4 blocking checkpoint: PaymentPage lacks a payment-success signal; resumed with founder `alternate-return-route` → BillingPage

## User Setup Required

None for this plan (Ads IDs already documented in `.env.example` from 09-01/09-03).

## Next Phase Readiness

- Funnel events ready for GA4 observation / Ads import of signup conversion label `-B6_CK72wtMcEIyDxKA-`
- Remaining phase work: 09-07 prerender verify (Quality Score gate)

## Self-Check: PASSED

- FOUND: `src/features/Auth/lib/hooks/useSignupData.test.ts`
- FOUND: `src/pages/BillingPage/ui/BillingPage/BillingPage.test.tsx`
- FOUND: commits `bb61c403`, `215f28e3`, `cca9f989`, `9c88870f`, `2f6eb834`

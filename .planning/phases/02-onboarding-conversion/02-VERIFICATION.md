---
phase: 02-onboarding-conversion
verified: 2026-06-25T12:00:00Z
status: gaps_found
score: 17/20 must-haves verified
overrides_applied: 0
gaps:
  - truth: "Docs screenshots are real captures or high-fidelity production-like mocks (D-15, GAP-14)"
    status: failed
    reason: "Current *.png files are procedural pure-Node pixel mocks (~12–20 KB); older *-placeholder.png files contain actual production UI captures and are higher fidelity"
    artifacts:
      - path: public/docs/screenshots/dashboard.png
        issue: "Procedural pixel-art mock, not redesign-v3 production UI"
      - path: scripts/generate-mock-screenshots.ts
        issue: "Fallback generator produces low-fidelity placeholders, not component-based mocks"
      - path: public/docs/screenshots/playground-placeholder.png
        issue: "Legacy file is a real Playground screenshot; new playground.png is inferior mock"
    missing:
      - "Re-run scripts/capture-docs-screenshots.ts with --base-url against authenticated dev/staging, or replace Node fallback with Playwright HTML mocks from renderMockHtml()"
      - "Remove or archive obsolete *-placeholder.png files after live captures land"
      - "Visual review against D-15 bar: must look like production, not generic placeholders"
  - truth: "Funnel goals configured in GA4 and Yandex Metrika for all domains (D-14)"
    status: partial
    reason: "Code emits events via trackEvent to both vendors when env IDs are set; vendor-side conversion goals are documented in docs/ONBOARDING_ANALYTICS.md but cannot be verified in codebase"
    artifacts:
      - path: docs/ONBOARDING_ANALYTICS.md
        issue: "Documentation only — no proof goals exist in GA4/Metrika admin UIs"
    missing:
      - "Configure conversion goals in GA4 and Metrika per ONBOARDING_ANALYTICS.md on prod/staging counters"
human_verification:
  - test: "Signup → Assistants path → create assistant → Playground call ≥10s → TrunkWidget step"
    expected: "playground_call_success fires; overlay resumes to TrunkWidgetStep with SIP/widget CTAs; total time ≤15 min on staging"
    why_human: "GAP-10 requires end-to-end timing and WebRTC/mic behavior; no Cypress coverage (deferred to Phase 6)"
  - test: "Signup → Analytics path → project + metrics → upload recording → wait for analysis → dashboard tour"
    expected: "oa_first_analysis_complete fires; redirect to operator dashboard with spotlight tour on insights/scorecard/upload"
    why_human: "Requires real backend batch processing and OperatorDashboard render with data-tour-id targets"
  - test: "Re-entry via Avatar dropdown «Начать обучение» after onboarding_completed"
    expected: "Product fork reappears; productPath reset; user can pick either product again"
    why_human: "Requires authenticated session and localStorage state"
  - test: "Visual review of public/docs/screenshots/*.png (non-placeholder)"
    expected: "Screenshots resemble production redesign-v3 UI, not pixel-art procedural mocks"
    why_human: "Automated checks confirm file existence only; D-15 quality bar is visual"
  - test: "GA4 DebugView + Metrika goals on staging with YANDEX_METRIKA_ID and GA4_MEASUREMENT_ID set"
    expected: "onboarding_started, product fork events, and primary conversions reach both analytics backends"
    why_human: "Vendor admin configuration and network delivery cannot be grep-verified"
---

# Phase 2: Onboarding Conversion Verification Report

**Phase Goal:** New user reaches first successful call/analysis in ≤15 minutes — **both products**.
**Verified:** 2026-06-25T12:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | First-time users see product fork: Voice Assistants vs Speech Analytics (D-01) | ✓ VERIFIED | `ProductForkStep.tsx` at step 0; `OnboardingWizard.tsx` resolveStepComponent; signup triggers `startOnboarding()` via `ONBOARDING_SIGNUP_KEY` |
| 2 | `productPath` assistants\|analytics in Redux + localStorage (D-19) | ✓ VERIFIED | `onboardingSlice.ts` setProductPath; `ONBOARDING_PRODUCT_KEY`; types in `onboarding.ts` |
| 3 | `onboarding_started` + `onboarding_product_*` on fork (D-12, D-13) | ✓ VERIFIED | `startOnboarding` + `ProductForkStep.onSelect` call `trackOnboardingEvent` |
| 4 | Re-entry button restarts fork for completed users (D-02) | ✓ VERIFIED | `AvatarDropdown.tsx` → `resetForReentry()` + `startOnboarding()` when `onboarding_completed` |
| 5 | Both products first-class, not assistants-only (D-03) | ✓ VERIFIED | Dual cards in ProductForkStep; separate `assistantsStepsMap` / analytics `OnboardingAnalyticsFlow` |
| 6 | SimpleExampleStep replaces mandatory Telegram (D-06) | ✓ VERIFIED | `assistantsStepsMap` step 3 = SimpleExampleStep; optional Telegram collapsible; TelegramStep not in map |
| 7 | Wizard primary CTA drives to Playground (D-07) | ✓ VERIFIED | `PlaygroundGuideStep` primary button navigates to `getRoutePlayground()?onboarding=assistants&assistantId=` |
| 8 | `playground_call_success` after meaningful disconnect (D-04) | ✓ VERIFIED | `Playground.tsx` MIN_CONNECTED_MS=10_000; dispatches `setPlaygroundCallCompleted` + `resumeForPostSuccess` |
| 9 | Post-success TrunkWidget offers SIP trunk + website widget (D-05) | ✓ VERIFIED | `TrunkWidgetStep.tsx` CTAs to `getRoutePublishWidgetsCreate` / `getRoutePublishSipUrisCreate`; shown after call via `resumeForPostSuccess` |
| 10 | Analytics branch: project + templates/metrics (D-08) | ✓ VERIFIED | `OnboardingAnalyticsSteps.tsx` reuses `WizardStep0_Templates`, `useCreateOperatorProject`, metric toggles |
| 11 | Upload recording or API intro during onboarding (D-09) | ✓ VERIFIED | `AnalyticsUploadStep` + `OperatorUploadForm`; `AnalyticsApiIntroPanel` with docs link |
| 12 | `oa_first_analysis_complete` when batch finishes (D-11) | ✓ VERIFIED | `OnboardingAnalyticsFlow.handleBatchFinished` via `useBatchProgress` |
| 13 | Dashboard tour highlights insights, scorecard, upload (D-10) | ✓ VERIFIED | `OnboardingDashboardTour.tsx` spotlight; wired in `DashboardCallRecordsPage.tsx` via `?onboarding=analytics&tour=1`; `data-tour-id` on `OperatorDashboard.tsx` |
| 14 | All D-13 funnel events wired in code (GAP-16 code layer) | ✓ VERIFIED | grep + `onboardingAnalytics.test.ts`; `initAnalytics.ts` sends to GA4 + Metrika |
| 15 | Funnel events documented for GA4/Metrika setup (D-14 doc) | ✓ VERIFIED | `docs/ONBOARDING_ANALYTICS.md` lists all events + goal mapping |
| 16 | GA4/Metrika conversion goals live in vendor UIs (D-14) | ? UNCERTAIN | Doc exists; vendor admin config not verifiable in repo |
| 17 | 6+ non-placeholder screenshots in docs (GAP-14, D-16 filenames) | ✓ VERIFIED | 9 PNG files exist; README lists all priority + OA captures |
| 18 | Screenshots look like production UI, not generic placeholders (D-15) | ✗ FAILED | New PNGs are procedural pixel mocks; legacy `*-placeholder.png` files are real UI captures |
| 19 | STATE.md marks Phase 2 executed with plan count | ✓ VERIFIED | `.planning/STATE.md` — Executed 2026-06-25, 4 plans |
| 20 | Unit tests for onboarding analytics + fork | ✓ VERIFIED | `npm run test:unit` — 23 suites / 103 tests PASS including `onboardingAnalytics.test.ts`, `ProductForkStep.test.tsx` |

**Score:** 17/20 truths verified (1 FAILED, 1 UNCERTAIN, 1 partial gap)

### Key Decisions (D-01 — D-19)

| ID | Decision | Status | Evidence |
|----|----------|--------|----------|
| D-01 | Product fork on first login after signup | ✓ | `useSignupData.ts` sets `onboarding_is_signup`; `OnboardingWizard` clears key and starts wizard |
| D-02 | Single re-entry button | ✓ | `AvatarDropdown` one menu item |
| D-03 | Both products first-class | ✓ | ProductForkStep dual path |
| D-04 | Playground call = primary assistants success | ✓ | TrunkWidget only after `resumeForPostSuccess`; skip allowed at PlaygroundGuideStep (per planner discretion) |
| D-05 | Trunk/widget after Playground success | ✓ | TrunkWidgetStep step 5 |
| D-06 | «Простой пример» replaces Telegram | ✓ | SimpleExampleStep in wizard |
| D-07 | Drive user to Playground | ✓ | Primary CTA in PlaygroundGuideStep |
| D-08 | Analytics branch from ProjectWizard patterns | ✓ | OnboardingAnalyticsSteps reuses wizard entities |
| D-09 | Upload primary; API educational | ✓ | Upload step + AnalyticsApiIntroPanel |
| D-10 | OperatorDashboard tour | ✓ | OnboardingDashboardTour + data-tour-id |
| D-11 | Analytics first success = analysis complete | ✓ | oa_first_analysis_complete on batch finish |
| D-12 | Both paths via trackEvent | ✓ | onboardingAnalytics.ts → initAnalytics.ts |
| D-13 | Minimum event set | ✓ | All 11 events present in code + tests |
| D-14 | Funnel goals all domains | ? | Code + doc only; vendor setup needs human |
| D-15 | Real/high-fidelity screenshots | ✗ | Node fallback mocks fail quality bar |
| D-16 | Priority screenshot inventory | ✓ | 9 files per README (6 legacy + 3 OA) |
| D-17 | New UI in redesign-v3 | ⚠️ PARTIAL | New steps (fork, SimpleExample, Playground, Trunk, analytics) use redesign-v3; WelcomeStep/BusinessTypeStep still use `redesigned/` + mui |
| D-18 | DynamicModuleLoader + Redux slice | ✓ | OnboardingWizard + OnboardingAnalyticsFlow |
| D-19 | onboarding_is_signup + productPath | ✓ | Keys and state fields present |

### GAP Closure Assessment

| GAP | Description | Status | Notes |
|-----|-------------|--------|-------|
| GAP-10 | «First call in 15 min» flow untested | ⚠️ OPEN (human) | Full dual-path flow implemented in code; no E2E/manual timing proof (E2E deferred Phase 6) |
| GAP-14 | Docs screenshots are placeholders | ✗ NOT CLOSED | Filename-level replacement done; visual quality regressed vs legacy placeholders |
| GAP-16 | No conversion funnel analytics | ✓ CODE CLOSED | Events instrumented end-to-end; vendor goal configuration remains human step |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/features/Onboarding/ui/steps/ProductForkStep.tsx` | Product fork UI | ✓ VERIFIED | Exists, substantive, wired in wizard |
| `src/features/Onboarding/lib/onboardingAnalytics.ts` | Typed funnel helpers | ✓ VERIFIED | trackOnboardingEvent + step helper; tested |
| `src/features/Onboarding/ui/steps/SimpleExampleStep.tsx` | Guided example step | ✓ VERIFIED | In assistantsStepsMap step 3 |
| `src/features/Onboarding/ui/steps/PlaygroundGuideStep.tsx` | Playground-first step | ✓ VERIFIED | Primary CTA to Playground |
| `src/features/Onboarding/ui/analytics/OnboardingAnalyticsFlow.tsx` | OA onboarding wizard | ✓ VERIFIED | 4 steps + batch polling + tour redirect |
| `public/docs/screenshots/dashboard.png` | Dashboard screenshot | ⚠️ STUB | Exists but procedural mock, not production-like |
| `scripts/capture-docs-screenshots.ts` | Repeatable capture | ✓ VERIFIED | Playwright + Node fallback; needs live run |
| `docs/ONBOARDING_ANALYTICS.md` | Funnel goal docs | ✓ VERIFIED | Complete D-13 mapping |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| ProductForkStep | onboardingSlice | setProductPath | ✓ WIRED | dispatch on card click |
| onboardingSlice | initAnalytics | trackOnboardingEvent | ✓ WIRED | start/skip/complete/step events |
| PlaygroundGuideStep | Playground route | navigate + query params | ✓ WIRED | onboarding=assistants, assistantId |
| Playground.tsx | onboardingSlice | setPlaygroundCallCompleted + resumeForPostSuccess | ✓ WIRED | onSessionDisconnect ≥10s |
| OnboardingAnalyticsFlow | OperatorDashboard | navigate + tour query | ✓ WIRED | ?onboarding=analytics&tour=1 |
| OnboardingAnalyticsSteps | Report API | useCreateOperatorProject | ✓ WIRED | unwrap + oa_project_created |
| AnalyticsUploadStep | batch API | OperatorUploadForm + useBatchProgress | ✓ WIRED | oa_file_uploaded + oa_first_analysis_complete |
| AvatarDropdown | onboardingSlice | resetForReentry + startOnboarding | ✓ WIRED | re-entry for completed users |
| index.tsx | initAnalytics | initAnalytics() | ✓ WIRED | called at app bootstrap |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| OnboardingAnalyticsFlow | batch status | useBatchProgress polling | Yes — API batch endpoint | ✓ FLOWING |
| AnalyticsMetricsStep | project.id | useCreateOperatorProject | Yes — RTK mutation | ✓ FLOWING |
| Playground.tsx | connectedDurationMs | PlaygroundSessionV2 disconnect callback | Yes — WebRTC session | ✓ FLOWING |
| OnboardingDashboardTour | rect spotlight | DOM query data-tour-id | Depends on OperatorDashboard render | ⚠️ needs human with data |
| public/docs/screenshots/*.png | image pixels | generate-mock-screenshots.ts | No — static procedural art | ✗ STATIC |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Onboarding unit tests pass | `npm run test:unit` (includes Onboarding tests) | 23 suites, 103 tests PASS | ✓ PASS |
| Screenshot file count ≥6 | `Get-ChildItem public/docs/screenshots/*.png` (excl. placeholder) | 9 non-placeholder PNGs | ✓ PASS |
| Funnel doc references primary goals | `grep playground_call_success docs/ONBOARDING_ANALYTICS.md` | Match found | ✓ PASS |

### Probe Execution

Step 7c: SKIPPED — no probe scripts declared for this phase.

### Requirements Coverage

No `requirements:` IDs in PLAN frontmatter. GAP mapping from ROADMAP:

| Requirement | Description | Status | Evidence |
|-------------|-------------|--------|----------|
| GAP-10 | First-call-in-15-min flow | ⚠️ NEEDS HUMAN | Code complete; no timing/E2E proof |
| GAP-14 | Docs screenshots | ✗ BLOCKED | Quality regression on D-15 bar |
| GAP-16 | Conversion funnel analytics | ✓ SATISFIED (code) | Full event instrumentation + doc |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `OnboardingAnalyticsSteps.tsx` | 273 | Comment "placeholder for task 2" | ℹ️ Info | Stale dev comment; Upload step is implemented |
| `public/docs/screenshots/*-placeholder.png` | — | Legacy real screenshots coexist with inferior mocks | ⚠️ Warning | Confusing asset inventory; docs may reference wrong file |
| `WelcomeStep.tsx` / `BusinessTypeStep.tsx` | — | Uses `redesigned/` not `redesign-v3/` | ⚠️ Warning | D-17 partial compliance on pre-existing steps |

### Human Verification Required

### 1. Assistants ≤15 min E2E (GAP-10)

**Test:** Fresh signup → Assistants → business template → Playground call ≥10s → TrunkWidget
**Expected:** `playground_call_success` in analytics; TrunkWidget overlay; ≤15 min total
**Why human:** WebRTC, mic permissions, real assistant creation API

### 2. Analytics ≤15 min E2E (GAP-10)

**Test:** Fresh signup → Analytics → project + metrics → upload → wait for analysis → tour
**Expected:** `oa_first_analysis_complete`; spotlight tour on operator dashboard
**Why human:** Backend batch processing latency and dashboard data render

### 3. Screenshot visual quality (GAP-14 / D-15)

**Test:** Open `public/docs/screenshots/*.png` (non-placeholder) side-by-side with live app
**Expected:** Production-like redesign-v3 appearance
**Why human:** Current Node mocks are pixel-art wireframes; legacy placeholders are closer to production

### 4. Analytics vendor goals (D-14)

**Test:** Configure goals per `docs/ONBOARDING_ANALYTICS.md` on staging GA4 + Metrika
**Expected:** Primary conversions `playground_call_success` and `oa_first_analysis_complete` fire as goals
**Why human:** Vendor admin UIs outside codebase

### Gaps Summary

Phase 2 delivers the dual-product onboarding architecture, analytics instrumentation, and both conversion paths in code — verified by file inspection, wiring traces, and passing unit tests. **SUMMARY.md claims are largely accurate for application code but overstated for screenshots:** the 9 new PNG assets are low-fidelity procedural mocks generated by `generate-mock-screenshots.ts` when Playwright was unavailable, and they are visually inferior to the legacy `*-placeholder.png` files that contain real production UI captures. This fails D-15 and does not close GAP-14 at the quality bar defined in CONTEXT.

GAP-16 is closed at the code layer (events fire to GA4 + Metrika via `trackEvent`); vendor goal configuration remains a human follow-up per D-14.

GAP-10 remains open for human E2E verification of the ≤15 minute north-star on staging — intentionally out of CI scope until Phase 6.

**Recommended next actions:**
1. Re-capture screenshots with `npx ts-node scripts/capture-docs-screenshots.ts --base-url=http://localhost:3000` (authenticated dev) or fix Playwright HTML mock path
2. Remove obsolete `*-placeholder.png` after confirming new captures
3. Run staging funnel smoke per `02-VALIDATION.md` before marking phase fully complete
4. Configure GA4/Metrika goals per `docs/ONBOARDING_ANALYTICS.md`

---

_Verified: 2026-06-25T12:00:00Z_
_Verifier: Claude (gsd-verifier)_

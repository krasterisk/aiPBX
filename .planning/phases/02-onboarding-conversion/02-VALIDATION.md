---
phase: 02
slug: onboarding-conversion
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-24
---

# Phase 02 — Validation Strategy

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29 (jsdom) |
| **Config file** | `config/jest/jest.config.ts` |
| **Quick run command** | `npm run test:unit -- --testPathPattern=Onboarding` |
| **Full suite command** | `npm run lint:ts && npm run test:unit` |
| **Estimated runtime** | ~45 seconds |

## Sampling Rate

- **After every task commit:** Run quick command for affected feature
- **After every plan wave:** Run full suite command
- **Before `/gsd-verify-work`:** Full suite green; manual funnel smoke on staging
- **Max feedback latency:** 120 seconds

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 02-01-01 | 01 | 1 | D-18, D-19 | lint | `npm run lint:ts -- --max-warnings=0 src/features/Onboarding/model/` | ⬜ pending |
| 02-01-02 | 01 | 1 | D-01, D-03 | unit | `npm run test:unit -- --testPathPattern=Onboarding --passWithNoTests` | ⬜ pending |
| 02-01-03 | 01 | 1 | D-12, D-13 | grep | `grep -E "trackOnboardingEvent\|onboarding_step_\|onboarding_skipped" src/features/Onboarding/` | ⬜ pending |
| 02-01-04 | 01 | 1 | D-02 | grep | `grep -r "startOnboarding\|onboarding_reentry" src/widgets/ src/features/Onboarding/` | ⬜ pending |
| 02-02-01 | 02 | 2 | D-06 | grep | `grep -l SimpleExampleStep src/features/Onboarding/ui/OnboardingWizard/OnboardingWizard.tsx` | ⬜ pending |
| 02-02-02 | 02 | 2 | D-04, D-13 | grep | `grep "assistant_created" src/features/Onboarding/ui/steps/BusinessTypeStep.tsx` | ⬜ pending |
| 02-02-03 | 02 | 2 | D-04 | grep | `grep "playground_call_success" src/features/PlaygroundSession/ src/pages/Playground/` | ⬜ pending |
| 02-02-04 | 02 | 2 | D-05 | grep | `grep "TrunkWidgetStep\|onboarding_completed" src/features/Onboarding/` | ⬜ pending |
| 02-03-01 | 03 | 2 | D-08 | grep | `grep "OnboardingAnalyticsFlow" src/features/Onboarding/ui/OnboardingWizard/OnboardingWizard.tsx` | ⬜ pending |
| 02-03-02 | 03 | 2 | D-09, D-11 | grep | `grep "oa_first_analysis_complete\|oa_file_uploaded" src/features/Onboarding/` | ⬜ pending |
| 02-03-03 | 03 | 2 | D-09 | grep | `grep -i "api" src/features/Onboarding/ui/analytics/` | ⬜ pending |
| 02-03-04 | 03 | 2 | D-10 | grep | `grep -i "tour\|spotlight" src/features/Onboarding/ui/analytics/` | ⬜ pending |
| 02-04-01 | 04 | 3 | D-15, D-16 | file | `ls public/docs/screenshots/*.png 2>/dev/null \| wc -l` | ⬜ pending |
| 02-04-02 | 04 | 3 | D-14 | file | `grep "playground_call_success" docs/ONBOARDING_ANALYTICS.md` | ⬜ pending |
| 02-04-03 | 04 | 3 | GAP-10 | unit | `npm run test:unit -- --testPathPattern=Onboarding` | ⬜ pending |
| 02-04-04 | 04 | 3 | DoD | grep | `grep "02-01-PLAN\|Planned" .planning/STATE.md` | ⬜ pending |

## Wave 0 Requirements

Existing Jest + Cypress infrastructure covers phase requirements. No new test framework install.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| GA4 / Метрика goals | D-14 | Vendor UIs | Complete assistants path on staging; confirm events in GA4 DebugView and Metrika |
| Playground call success | D-04 | WebRTC + SIP | Place ≥10s call in Playground with `?onboarding=assistants`; verify success modal and event |
| OA batch completion | D-11 | Async processing | Upload test audio during onboarding; wait for batch; confirm dashboard tour |
| Screenshot fidelity | D-16 | Visual QA | Compare docs screenshots against live redesign-v3 UI at 1280×800 |

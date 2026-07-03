---
phase: 0b
slug: engineering-foundation
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-24
---

# Phase 0b — Validation Strategy

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29 (FE jsdom + BE node) |
| **Config file** | `aiPBX/config/jest/jest.config.ts`, `aiPBX_backend/package.json` jest |
| **Quick run command** | FE: `npm run test:unit`; BE: `npm test -- --testPathPattern=operator-analytics` |
| **Full suite command** | FE: `npm run lint:ts && npm run test:unit`; BE: `npm test` |
| **Estimated runtime** | ~120 seconds combined |

## Sampling Rate

- **After every task commit:** Run quick command for affected repo
- **After every plan wave:** Run full suite command for affected repo(s)
- **Before `/gsd-verify-work`:** Both full suites green
- **Max feedback latency:** 180 seconds

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 0b-01-01 | 01 | 1 | GAP-01 | ci | `grep test:unit .github/workflows/deploy.yml` | ⬜ pending |
| 0b-01-02 | 01 | 1 | GAP-01 | unit | `cd aiPBX && npm run test:unit` | ⬜ pending |
| 0b-01-03 | 01 | 1 | GAP-02 | unit | `cd aiPBX_backend && npm test` | ⬜ pending |
| 0b-02-01 | 02 | 1 | GAP-04 | file | `test -f aiPBX/.env.example` | ⬜ pending |
| 0b-02-02 | 02 | 1 | GAP-03 | grep | `rg '192\.168' aiPBX/vite.config.ts aiPBX/cypress/` | ⬜ pending |
| 0b-03-01 | 03 | 2 | GAP-05 | file | `grep initSentry src/index.tsx` | ⬜ pending |
| 0b-03-02 | 03 | 2 | GAP-06 | codegen | `cd aiPBX && npm run generate:api-types:check` | ⬜ pending |
| 0b-03-03 | 03 | 2 | GAP-06 | unit | `cd aiPBX && npm run lint:ts` | ⬜ pending |

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test framework install.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sentry DSN in production | GAP-05 | Requires server secrets | Set DSN on staging, trigger test error, confirm event in Sentry UI |

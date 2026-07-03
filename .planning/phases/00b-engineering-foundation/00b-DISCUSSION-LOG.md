# Phase 0b: Engineering Foundation - Discussion Log (Assumptions Mode)

> **Audit trail only.** Decisions in `00b-CONTEXT.md`.

**Date:** 2026-06-24
**Phase:** 00b-engineering-foundation
**Mode:** assumptions (--auto)
**Areas analyzed:** CI gates, failing tests, secrets/env, Sentry, OpenAPI codegen

## Assumptions Presented

### CI test gates
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Master-push quality job with test:unit (FE) and npm test (BE) is sufficient for solo founder | Confident | `.github/workflows/deploy.yml` both repos |
| Deploy blocked on quality failure | Confident | `needs: [quality]` in deploy job |

### Failing OA tests
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| 5 failures in operator-analytics.service.spec.ts from Phase 1 mock drift | Likely | GAPS.md, codebase/CONCERNS.md |
| Fix by updating mocks, not deleting tests | Confident | DoD requires unit tests |

### Secrets hygiene
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| package.json secrets already removed; webpack uses .env | Likely | package.json grep clean, webpack.config.ts |
| .env.example still missing on FE | Confident | Glob search |
| Hardcoded LAN IP in vite/cypress | Confident | codebase/CONCERNS.md |

### Sentry
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| Init stubs exist; ErrorBoundary not wired to Sentry | Likely | initSentry.ts, ErrorBoundary.tsx |
| Opt-in via DSN env var | Confident | initSentry.ts early return |

### OpenAPI codegen
| Assumption | Confidence | Evidence |
|------------|-----------|----------|
| generate:api-types works but types unused | Confident | schema.d.ts, no imports |
| Pilot one entity, not full migration | Confident | Phase scope guardrail |

## Corrections Made

No corrections — all assumptions confirmed via --auto for solo founder RU B2B context.

## Auto-Resolved

All assumptions Confident/Likely — proceeded to CONTEXT.md without user prompt.

## External Research

None required — codebase maps + GAPS sufficient.

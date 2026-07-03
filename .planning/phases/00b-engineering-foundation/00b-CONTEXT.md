# Phase 0b: Engineering Foundation - Context

**Gathered:** 2026-06-24 (assumptions mode, --auto)
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish safe agent execution infrastructure across both repos: CI test gates, green unit tests, secrets/env hygiene, observability (Sentry), and OpenAPI type codegen adoption. No product features, no telephony/billing logic changes, no UI redesign.

**GAPs in scope:** GAP-01, GAP-02, GAP-03, GAP-04, GAP-05, GAP-06

**Already partially done (manual, do not revert):** FE/BE CI test steps, Sentry init stubs, webpack env-driven config. Phase completes and verifies these — does not rip out.
</domain>

<decisions>
## Implementation Decisions

### CI test gates (GAP-01)
- **D-01:** Both repos run unit tests on every `master` push before deploy job proceeds. FE: `npm run lint:ts` + `npm run test:unit`. BE: `npm test`. Verify existing `.github/workflows/deploy.yml` in both repos; add PR workflow only if zero extra scope — master push gate is sufficient for solo founder.
- **D-02:** CI must fail deploy matrix when tests fail (`needs: [quality]` already present on FE).

### Fix failing backend tests (GAP-02)
- **D-03:** Fix all failing tests in `aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts` (5 failures per GAPS). Root cause likely mock drift after Phase 1 insights changes — update mocks to match current `generateInsights()` / facts builder, not weaken assertions.
- **D-04:** After fix, `npm test` exits 0 locally and in CI.

### Secrets hygiene (GAP-03, GAP-04)
- **D-05:** No secrets, API keys, or internal IPs in `package.json` scripts, webpack CLI args, or committed config. All client keys via `.env.local` / `.env` loaded by `webpack.config.ts` (already pattern).
- **D-06:** Create `aiPBX/.env.example` documenting: `API_URL`, `WS_URL`, `STATIC_URL`, `GOOGLE_CLIENT_ID`, `TELEGRAM_BOT_ID`, `STRIPE_PUBLISHABLE_KEY`, `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `YANDEX_METRIKA_ID`, `GA4_MEASUREMENT_ID`, `PORT`. No real values — placeholders only.
- **D-07:** Audit `vite.config.ts` and `cypress/support/commands/*.ts` for hardcoded `192.168.2.37` — replace with env vars documented in `.env.example` and Cypress `env` config.
- **D-08:** Extend `aiPBX_backend/.env.example` (if exists) or create with `SENTRY_DSN`, `SENTRY_ENVIRONMENT` additions; never commit `.env`.

### Observability / Sentry (GAP-05)
- **D-09:** Frontend: keep `src/shared/config/sentry/initSentry.ts`; wire `ErrorBoundary` to `Sentry.captureException` (not console-only). Init called from `src/index.tsx` before render.
- **D-10:** Backend: keep `Sentry.init` in `main.ts`; document DSN in `.env.example`. No PII in breadcrumbs; `tracesSampleRate: 0.1` retained.
- **D-11:** Sentry is opt-in via env — empty DSN = no-op (current behavior). Production DSNs live in server secrets / GitHub Actions env, not repo.

### OpenAPI codegen (GAP-06)
- **D-12:** Backend exports `openapi.json` (Swagger already generates at runtime; add build-time export script `npm run openapi:export` → `openapi.json` at repo root).
- **D-13:** FE `npm run generate:api-types` runs against exported spec; add npm script `generate:api-types:check` for CI drift detection (regenerate + git diff).
- **D-14:** Pilot adoption: wire **one** high-churn entity (`entities/Report` or `entities/Assistant`) RTK Query types from `src/shared/api/generated/schema.d.ts` — prove pattern without mass migration.
- **D-15:** Do not create shared npm package in this phase — codegen output stays in FE repo.

### Claude's Discretion
- Exact PR vs push-only CI trigger wording
- Which single entity to pilot for OpenAPI types (Report vs Assistant — pick highest churn)
- Cypress env file structure (`cypress.env.example.json` vs documented in README)
- Whether to add `openapi.json` to git or generate in CI only

### Folded Todos
None.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning & backlog
- `.planning/PROJECT.md` — full-stack context, agent rules
- `.planning/GAPS.md` — GAP-01 through GAP-06 definitions
- `.planning/codebase/RECONCILIATION.md` — intel vs codebase deltas, partial manual work
- `.planning/codebase/TESTING.md` — Jest commands, CI patterns
- `.planning/codebase/CONCERNS.md` — verified debt (OA tests, secrets, codegen)
- `.planning/codebase/INTEGRATIONS.md` — external services, env vars
- `.planning/intel/RISKS.md` — read before any accidental billing/telephony touch

### Cursor rules
- `.cursor/rules/aipbx-core.mdc` — DoD, scope discipline
- `.cursor/rules/frontend-fsd.mdc` — FSD layer rules
- `.cursor/rules/backend-nestjs.mdc` — NestJS module patterns

### Implementation anchors
- `aiPBX/.github/workflows/deploy.yml` — FE CI (lint + test:unit)
- `aiPBX_backend/.github/workflows/deploy.yml` — BE CI (npm test)
- `aiPBX/webpack.config.ts` — env-driven build vars
- `aiPBX/src/shared/config/sentry/initSentry.ts` — FE Sentry
- `aiPBX_backend/src/main.ts` — BE Sentry + Swagger
- `aiPBX/package.json` — `generate:api-types` script
- `aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts` — failing tests

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `webpack.config.ts` — dotenv loading pattern for all `__VAR__` globals
- `config/jest/jest.config.ts` — Sentry/analytics globals already mocked for tests
- `src/shared/api/generated/schema.d.ts` — generated types (unused, ready for pilot)
- `aiPBX_backend` Swagger `DocumentBuilder` in `main.ts` — OpenAPI source

### Established Patterns
- DoD: `npm run lint:ts` + `npm run test:unit` (FE), `npm test` (BE)
- Env vars injected via webpack `DefinePlugin` — not package.json
- Deploy tag gating: `[deploy all]` / `[deploy:N]` in commit message

### Integration Points
- CI quality job → deploy job dependency chain
- OpenAPI export → FE codegen → entity `model/types`
- Sentry DSN via env at build time (FE) and runtime (BE)
</code_context>

<specifics>
## Specific Ideas

- Solo founder RU B2B: minimize ceremony — master-push CI gate enough; no separate PR workflow unless trivial
- Manual Sentry/CI work from 2026-06-24 session should be completed and documented, not reimplemented from scratch
- OpenAPI pilot on one entity keeps phase scope bounded
</specifics>

<deferred>
## Deferred Ideas

- E2E tests in CI (GAP-29) — Phase 6
- SEO/prerender (GAP-15, GAP-40) — Phase 4; partial sitemap/meta work stays
- GA4/Метрика funnel goals (GAP-16) — Phase 2
- Full entity type migration to codegen — post-0b incremental
- Shared types npm package — future

### Reviewed Todos (not folded)
None.
</deferred>

---

*Phase: 00b-engineering-foundation*
*Context gathered: 2026-06-24 via assumptions mode (--auto)*

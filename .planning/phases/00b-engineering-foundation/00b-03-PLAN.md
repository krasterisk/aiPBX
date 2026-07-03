---
phase: 00b-engineering-foundation
plan: 03
type: execute
wave: 2
depends_on: [00b-01, 00b-02]
files_modified:
  - aiPBX_backend/openapi.json
  - aiPBX_backend/package.json
  - aiPBX_backend/src/operator-analytics/dto/operator-insights-response.dto.ts
  - aiPBX_backend/src/operator-analytics/operator-analytics.controller.ts
  - aiPBX/.github/workflows/deploy.yml
  - aiPBX/package.json
  - aiPBX/src/index.tsx
  - aiPBX/src/shared/api/generated/schema.d.ts
  - aiPBX/src/entities/Report/model/types/report.ts
  - aiPBX/src/entities/Report/api/reportApi.ts
  - aiPBX/.env.example
  - aiPBX_backend/.env.example
  - .planning/STATE.md
autonomous: true
gaps: [GAP-05, GAP-06]
must_haves:
  truths:
    - "initSentry() called from index.tsx before render"
    - "Sentry env vars documented in both .env.example files"
    - "openapi:export alias exists; openapi.json has OperatorInsightsResponse schema"
    - "generate:api-types:check runs in FE CI quality job"
    - "Report entity imports type from schema.d.ts"
  artifacts:
    - path: aiPBX_backend/src/operator-analytics/dto/operator-insights-response.dto.ts
      provides: "Swagger DTO for insights endpoint"
    - path: aiPBX/src/shared/api/generated/schema.d.ts
      provides: "Generated OpenAPI types"
    - path: aiPBX/package.json
      provides: "generate:api-types:check script"
  key_links:
    - from: aiPBX_backend/operator-analytics.controller.ts
      to: OperatorInsightsResponseDto
      via: "@ApiResponse({ type: OperatorInsightsResponseDto })"
    - from: aiPBX/.github/workflows/deploy.yml
      to: generate:api-types:check
      via: "quality job npm script"
---

<objective>
Complete observability documentation (D-09–D-11), OpenAPI pipeline with backend DTO (D-12–D-14), CI drift detection (D-13), and phase STATE update.

Purpose: FE/BE contract drift visible in CI; Sentry documented; codegen pilot proven.
Output: Populated openapi.json, CI checks, Report entity type pilot, STATE.md updated.
</objective>

<execution_context>
@$HOME/.cursor/gsd-core/workflows/execute-plan.md
</execution_context>

<context>
@.planning/phases/00b-engineering-foundation/00b-CONTEXT.md
@.planning/phases/00b-engineering-foundation/00b-RESEARCH.md
@aiPBX/src/index.tsx
@aiPBX/src/shared/config/sentry/initSentry.ts
@aiPBX_backend/scripts/export-openapi.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Verify Sentry wiring and document env (D-09, D-10, D-11)</name>
  <files>aiPBX/.env.example, aiPBX_backend/.env.example, aiPBX/src/index.tsx</files>
  <read_first>aiPBX/src/index.tsx, aiPBX/src/shared/config/sentry/initSentry.ts, aiPBX/src/app/providers/ErrorBoundary/ui/ErrorBoundary.tsx, aiPBX_backend/src/main.ts</read_first>
  <action>
Per D-09: Verify `initSentry()` is called in `src/index.tsx` before `createRoot().render()` (already present — do not remove).
Per D-10–D-11: Add Sentry section to both `.env.example` files with SENTRY_DSN= and SENTRY_ENVIRONMENT= plus "Empty DSN disables Sentry" comment.
Verify ErrorBoundary calls `Sentry.captureException`.
  </action>
  <verify>
    <automated>grep -n "initSentry" aiPBX/src/index.tsx && grep "captureException" aiPBX/src/app/providers/ErrorBoundary/ui/ErrorBoundary.tsx</automated>
  </verify>
  <done>Sentry init order verified; env vars documented (D-09–D-11)</done>
</task>

<task type="auto">
  <name>Task 2: Backend insights DTO + OpenAPI export (D-12, D-14)</name>
  <files>aiPBX_backend/src/operator-analytics/dto/operator-insights-response.dto.ts, aiPBX_backend/src/operator-analytics/operator-analytics.controller.ts, aiPBX_backend/openapi.json, aiPBX_backend/package.json</files>
  <read_first>aiPBX_backend/src/operator-analytics/lib/insights-schema.ts, aiPBX_backend/src/operator-analytics/operator-analytics.controller.ts, aiPBX_backend/scripts/export-openapi.ts</read_first>
  <action>
Per D-12/D-14: Create `OperatorInsightsResponseDto` (and nested DTOs) mirroring insights-schema types with `@ApiProperty` decorators.
Add `@ApiResponse({ status: 200, type: OperatorInsightsResponseDto })` on insights GET endpoint.
Add `"openapi:export": "npm run swagger:export"` alias in `aiPBX_backend/package.json`.
Run `npm run openapi:export`, commit populated `openapi.json` with insights path in `paths`.
Add BE script `openapi:check`: export + `git diff --exit-code openapi.json`.
  </action>
  <verify>
    <automated>cd aiPBX_backend && npm run openapi:export && node -e "const o=require('./openapi.json'); if(!o.paths||!Object.keys(o.paths).length) process.exit(1)"</automated>
  </verify>
  <done>OperatorInsightsResponse in openapi.json; openapi:export alias added (D-12, D-14)</done>
</task>

<task type="auto">
  <name>Task 3: Codegen check in CI + pilot Report types (D-13, D-14, D-15)</name>
  <files>aiPBX/package.json, aiPBX/.github/workflows/deploy.yml, aiPBX/src/shared/api/generated/schema.d.ts, aiPBX/src/entities/Report/model/types/report.ts, aiPBX/src/entities/Report/api/reportApi.ts</files>
  <read_first>aiPBX/package.json, aiPBX/.github/workflows/deploy.yml, aiPBX/src/entities/Report/model/types/report.ts</read_first>
  <action>
Per D-13: Add `generate:api-types:check` script; add step to FE `deploy.yml` quality job after test:unit.
Run `npm run generate:api-types` to refresh schema.d.ts.
Per D-14/D-15: Import `components['schemas']['OperatorInsightsResponse']` in Report entity; replace duplicate hand-written interface.
Run `npm run lint:ts && npm run test:unit`.
  </action>
  <verify>
    <automated>cd aiPBX && npm run generate:api-types:check && npm run lint:ts && npm run test:unit</automated>
  </verify>
  <done>CI codegen drift check wired; Report entity uses generated type (D-13–D-15)</done>
</task>

<task type="auto">
  <name>Task 4: Update STATE.md (DoD)</name>
  <files>.planning/STATE.md</files>
  <read_first>.planning/STATE.md, .cursor/rules/aipbx-core.mdc</read_first>
  <action>
Per aipbx-core DoD: Mark Phase 0b status Executed in STATE.md with date, plans completed, and next phase pointer (Phase 2 or continue roadmap).
  </action>
  <verify>
    <automated>grep "Phase 0b" .planning/STATE.md</automated>
  </verify>
  <done>STATE.md reflects Phase 0b completion</done>
</task>

</tasks>

<verification>
- [ ] `cd aiPBX_backend && npm run openapi:check` succeeds on clean tree
- [ ] `cd aiPBX && npm run generate:api-types:check` in CI quality job
- [ ] Report entity imports from schema.d.ts
</verification>

## Artifacts this phase produces

- `OperatorInsightsResponseDto` + Swagger decoration
- `openapi:export` / `openapi:check` scripts
- `generate:api-types:check` in FE CI
- Report entity codegen pilot

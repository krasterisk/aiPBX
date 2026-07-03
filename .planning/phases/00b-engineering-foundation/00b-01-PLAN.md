---
phase: 00b-engineering-foundation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - aiPBX/.github/workflows/deploy.yml
  - aiPBX_backend/.github/workflows/deploy.yml
  - aiPBX/src/app/types/global.d.ts
  - aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts
autonomous: true
gaps: [GAP-01, GAP-02]
must_haves:
  truths:
    - "FE deploy workflow quality job runs lint:ts and test:unit before deploy"
    - "BE deploy workflow quality job runs npm test before deploy"
    - "operator-analytics.service.spec.ts passes with zero failures"
    - "npm test exits 0 in aiPBX_backend"
  artifacts:
    - path: aiPBX/.github/workflows/deploy.yml
      provides: "FE CI quality gate"
    - path: aiPBX_backend/.github/workflows/deploy.yml
      provides: "BE CI quality gate"
    - path: aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts
      provides: "Green OA service unit tests"
---

<objective>
Verify CI test gates (D-01, D-02) and fix all failing Operator Analytics unit tests (D-03, D-04).

Purpose: Unblock safe agent execution — deploy must not proceed on red tests.
Output: Green `npm test` on backend; confirmed CI workflow structure on both repos.
</objective>

<execution_context>
@$HOME/.cursor/gsd-core/workflows/execute-plan.md
</execution_context>

<context>
@.planning/phases/00b-engineering-foundation/00b-CONTEXT.md
@.planning/phases/00b-engineering-foundation/00b-RESEARCH.md
@.planning/codebase/TESTING.md
@.planning/codebase/CONCERNS.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Verify and document CI quality gates (D-01, D-02)</name>
  <files>aiPBX/.github/workflows/deploy.yml, aiPBX_backend/.github/workflows/deploy.yml</files>
  <read_first>aiPBX/.github/workflows/deploy.yml, aiPBX_backend/.github/workflows/deploy.yml, .planning/phases/00b-engineering-foundation/00b-CONTEXT.md</read_first>
  <action>
Per D-01/D-02: Confirm both deploy.yml files have a `quality` job that runs before `deploy` via `needs: [quality]`.
- FE quality steps must include `npm run lint:ts` and `npm run test:unit`
- BE quality steps must include `npm test`
If any step missing, add it. If already present (manual work), add a comment `# GAP-01: quality gate` for traceability.
Run locally: `cd aiPBX && npm run lint:ts && npm run test:unit` and `cd aiPBX_backend && npm test` — record pass/fail in plan summary (do not fix BE failures in this task).
  </action>
  <acceptance_criteria>
    - Both deploy.yml files contain job named `quality` with test commands above
    - Deploy job has `needs: [quality]` or equivalent blocking dependency
    - FE `npm run lint:ts` exits 0 locally
  </acceptance_criteria>
  <verify>
    <automated>grep -E "test:unit|npm test" aiPBX/.github/workflows/deploy.yml aiPBX_backend/.github/workflows/deploy.yml</automated>
  </verify>
  <done>CI quality jobs verified in both deploy.yml files with deploy blocked on quality failure (D-01, D-02)</done>
</task>

<task type="auto">
  <name>Task 2: Fix FE test compile blocker — SCSS modules (D-01)</name>
  <files>aiPBX/src/app/types/global.d.ts</files>
  <read_first>aiPBX/src/app/types/global.d.ts, aiPBX/config/jest/jest.config.ts</read_first>
  <action>
Per D-01: Add `declare module '*.scss' { const classes: Record&lt;string, string&gt;; export default classes }` (and `*.module.scss` if needed) to `global.d.ts` so Jest/tsc can compile component imports.
Run `cd aiPBX && npm run test:unit` — must exit 0 (or only pre-existing failures documented for separate fix).
  </action>
  <acceptance_criteria>
    - global.d.ts contains declare module for *.scss
    - `npm run test:unit` in aiPBX exits 0
  </acceptance_criteria>
  <verify>
    <automated>cd aiPBX && npm run test:unit</automated>
  </verify>
  <done>FE unit tests compile and pass (D-01)</done>
</task>

<task type="auto">
  <name>Task 3: Diagnose all BE test failures (D-03)</name>
  <files>aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts</files>
  <read_first>aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts, aiPBX_backend/src/operator-analytics/operator-analytics.service.ts, aiPBX_backend/src/operator-analytics/lib/insights-schema.ts, .planning/phases/01-dashboard-insights-upgrade/01-01-PLAN.md</read_first>
  <action>
Run `cd aiPBX_backend && npm test -- operator-analytics.service.spec.ts` and capture all failure messages.
For each failure, identify whether cause is: (a) mock drift from Phase 1 structured insights, (b) cache key change, (c) billing mock, (d) facts builder signature.
Document failure→fix mapping in a brief comment block at top of spec file (max 10 lines).
Do NOT apply fixes yet — diagnosis only.
  </action>
  <acceptance_criteria>
    - Test command executed and output captured
    - Spec file contains comment block listing each failing test name and root cause category
    - No test assertions weakened or skipped
  </acceptance_criteria>
  <verify>
    <automated>cd aiPBX_backend && npm test 2>&1 | head -50</automated>
  </verify>
  <done>Failure diagnosis comment block added to spec file listing all failing suites (D-03)</done>
</task>

<task type="auto">
  <name>Task 4: Fix all BE tests (D-03, D-04)</name>
  <files>aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts</files>
  <read_first>aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts, aiPBX_backend/src/operator-analytics/operator-analytics.service.ts, aiPBX_backend/src/operator-analytics/lib/insights-facts.ts, aiPBX_backend/src/operator-analytics/lib/insights-schema.ts</read_first>
  <action>
Per D-03/D-04: Update mocks and fixtures to match current `generateInsights()` implementation:
- Mock `chatWithFallback` to return valid structured JSON matching `parseAndValidateInsightsResponse`
- Update expected cache keys if `userId` now included
- Update dashboard fixtures to include fields required by `buildInsightsFacts`
- Preserve test intent: schema validation, cache composition, billing invocation, structured parse
Run `cd aiPBX_backend && npm test` — must exit 0 with zero failures across entire suite (D-04).
  </action>
  <acceptance_criteria>
    - `npm test` in aiPBX_backend exits 0
    - No `it.skip`, `xit`, or deleted test cases
  </acceptance_criteria>
  <verify>
    <automated>cd aiPBX_backend && npm test</automated>
  </verify>
  <done>Full backend test suite green (D-03, D-04)</done>
</task>

</tasks>

<verification>
- [ ] `cd aiPBX && npm run test:unit` exits 0
- [ ] `cd aiPBX_backend && npm test` exits 0
- [ ] Both deploy.yml quality jobs unchanged or improved (not weakened)
</verification>

## Artifacts this phase produces

- Updated `operator-analytics.service.spec.ts` with Phase-1-aligned mocks
- CI workflow comments/traceability for GAP-01

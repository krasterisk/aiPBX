# Single call topic
Coordinator: Codex /root. Mode: codex-direct. Status: in_progress.
Scope: optional project singleTopic flag; wizard checkbox; strict LLM validation/retry; manual tag limit; API contracts; migrations MySQL/PostgreSQL.
Baseline: existing frontend prompt editor changes, package/docs/helpdesk artifacts preserved. No agents.
Plan: wire project persistence and UI; enforce one known topic when taxonomy exists; preserve one manual override; test cardinality, retries and project state.
Owned paths: Report wizard/API types; OperatorAnalytics ProjectWizard; backend operator-analytics model/DTO/service/schema and tests; migrations and OpenAPI contracts.
No helpdesk changes or production deployment. Gates: targeted tests, type checks, contract generation. Next: implementation.

## Result
Status: implemented; automated targeted tests passed.
- Project singleTopic defaults false. Checkbox in creation/settings; persisted via POST/PATCH.
- With taxonomy enabled: model schema + local Zod require exactly one known topic; empty/multiple/unknown results retry once and then fail. No first-topic truncation.
- Manual update accepts at most one topic (clearing remains allowed). One manual override wins on reanalysis; conflicting prior manual tags require correction.
- Classification still uses full transcript, not summary. Old records unchanged.
- Backend: 211 initial targeted tests passed; after persistence tests and type repairs 182 service/DTO/single-topic tests passed; prior analysis-schema suite passed. Backend TypeScript pass.
- Frontend: initial 22 tests passed; latest Redux/Taxonomy tests 18 passed; existing prompt editor suite passed. TypeScript with skipLibCheck pass. Full TypeScript fails on installed dependency declarations.
- Frontend targeted ESLint: 0 errors, 2 existing warnings. Backend baseline comparison: 46 existing errors, 0 new.
- API contracts synchronized and generated types refreshed; scoped diff check pass.
- Pending: apply migration migrations/{mysql,postgres}/2026-10-08-operator-project-single-topic.sql to deployment DB BEFORE deploying/restarting backend; deploy backend/frontend; enable checkbox for intended project; live verify reanalysis. No migration or production deployment performed.
Next action: migration and deployment, then activate and reanalyze example call.

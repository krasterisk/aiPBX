---
phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t
plan: 03
subsystem: api
tags: [sequelize, nestjs, react, taxonomy, postgres, mysql, class-validator]

requires:
  - phase: 10-01
    provides: Serialised ownership of operator-analytics.service.ts (no behavioural dependency)
provides:
  - callTaxonomy JSON column on operator_projects with validated DTO
  - operator_call_tags table (dual-dialect migrations) and CallTag model
  - TaxonomyEditor in ProjectSettingsForm wired through existing updateProject mutation
  - TagDefinition types on frontend and _topics.tags / tag_names siblings
affects: [10-05, 10-07, 10-08, 10-09, 10-10]

tech-stack:
  added: []
  patterns:
    - "Taxonomy writes skip currentSchemaVersion bump (keyword dictionary ≠ LLM metric schema)"
    - "Dual-write table separate from operator_metric_values (manual tags survive re-analysis)"
    - "Defensive try/catch on callTaxonomy with migration file name in warn log"

key-files:
  created:
    - aiPBX_backend/migrations/postgres/2026-07-30-operator-call-taxonomy.sql
    - aiPBX_backend/migrations/mysql/2026-07-30-operator-call-taxonomy.sql
    - aiPBX_backend/src/operator-analytics/operator-call-tag.model.ts
    - aiPBX_backend/src/operator-analytics/operator-call-tag.model.spec.ts
    - aiPBX/src/features/OperatorAnalytics/ui/ProjectWizard/TaxonomyEditor.tsx
    - aiPBX/src/features/OperatorAnalytics/ui/ProjectWizard/TaxonomyEditor.test.tsx
  modified:
    - aiPBX_backend/src/operator-analytics/interfaces/operator-metrics.interface.ts
    - aiPBX_backend/src/operator-analytics/operator-project.model.ts
    - aiPBX_backend/src/operator-analytics/dto/project.dto.ts
    - aiPBX_backend/src/operator-analytics/operator-analytics.service.ts
    - aiPBX_backend/src/operator-analytics/operator-analytics.controller.ts
    - aiPBX_backend/src/operator-analytics/operator-analytics.module.ts
    - aiPBX/src/entities/Report/model/types/report.ts
    - aiPBX/src/entities/Report/api/reportApi.ts
    - aiPBX/src/features/OperatorAnalytics/ui/ProjectWizard/ProjectSettingsForm.tsx

key-decisions:
  - "Taxonomy persistence deliberately omits currentSchemaVersion increment"
  - "Service-level validateCallTaxonomy mirrors DTO caps as defense-in-depth"
  - "UpdateProjectDto introduced so PATCH body gets class-validator transforms"
  - "CallTag model spec uses file-content assertions to avoid Sequelize bootstrap in unit tests"

patterns-established:
  - "Pattern: callTaxonomy column mirrors customMetricsSchema JSON default []"
  - "Pattern: operator_call_tags with source auto|manual and channelId+tagId uniqueness"

requirements-completed: [D-13, D-17, D-19, D-21, D-22]

coverage:
  - id: D1
    description: Validated taxonomy persists through existing project update without schema version bump
    requirement: D-13
    verification:
      - kind: unit
        ref: aiPBX_backend/src/operator-analytics/operator-analytics.service.spec.ts#taxonomy
        status: pass
    human_judgment: false
  - id: D2
    description: Dual-dialect migrations and CallTag model registered for injection
    requirement: D-19
    verification:
      - kind: unit
        ref: aiPBX_backend/src/operator-analytics/operator-call-tag.model.spec.ts
        status: pass
    human_judgment: false
  - id: D3
    description: TaxonomyEditor in project settings with confirmed theme deletion
    requirement: D-17
    verification:
      - kind: unit
        ref: aiPBX/src/features/OperatorAnalytics/ui/ProjectWizard/TaxonomyEditor.test.tsx
        status: pass
    human_judgment: false
  - id: D4
    description: Production migration apply on each database server
    requirement: D-19
    verification: []
    human_judgment: true
    rationale: Migrations are manual per R12; cannot be exercised from CI without server access

duration: 25min
completed: 2026-07-30
status: complete
---

# Phase 10 Plan 03: Call Taxonomy Vertical Summary

**Project call-topic taxonomy end-to-end: validated JSON vocabulary on projects, dual-dialect operator_call_tags table, and TaxonomyEditor in project settings.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-07-30T06:19:00Z
- **Completed:** 2026-07-30T06:44:00Z
- **Tasks:** 3/3
- **Files modified:** 17

## Accomplishments

- Managers can define project themes with synonym phrases in **Project settings**; saving uses the existing `updateProject` mutation (no second save button).
- Taxonomy writes are validated (theme count, id/name/alias length caps, control-character rejection) and **do not bump** `currentSchemaVersion`.
- `operator_call_tags` table ships for PostgreSQL and MySQL with channel+tag uniqueness and `source` defaulting to `auto`.
- Frontend types add `TagDefinition`, `callTaxonomy`, and sibling `_topics.tags` / `_topics.tag_names` without overloading `_topics.keywords`.

## Task Commits

1. **Task 1: Validated taxonomy through project update** — `2e693b4` (aiPBX_backend, feat)
2. **Task 2: Dual-dialect migrations + CallTag model** — `5dc77b6` (aiPBX_backend, feat)
3. **Task 3: TaxonomyEditor in project settings** — `720f10de` (aiPBX, feat)

## Files Created/Modified

- `aiPBX_backend/migrations/{postgres,mysql}/2026-07-30-operator-call-taxonomy.sql` — callTaxonomy column + operator_call_tags table
- `aiPBX_backend/src/operator-analytics/operator-call-tag.model.ts` — injectable per-call tag model
- `aiPBX_backend/src/operator-analytics/dto/project.dto.ts` — TagDefinitionDto, UpdateProjectDto
- `aiPBX/src/features/OperatorAnalytics/ui/ProjectWizard/TaxonomyEditor.tsx` — controlled editor with delete confirmation
- `aiPBX/src/features/OperatorAnalytics/ui/ProjectWizard/ProjectSettingsForm.tsx` — wires taxonomy into save payload

## Decisions Made

- Taxonomy branch in `updateProject` skips `currentSchemaVersion` increment (matches D-20 / threat T-10-03-05).
- Service-level `validateCallTaxonomy` duplicates DTO caps because global ValidationPipe uses `skipMissingProperties: true`.
- `UpdateProjectDto` replaces inline PATCH body types so nested validation runs on `callTaxonomy`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] CallTag model spec could not call Sequelize getAttributes without DB bootstrap**
- **Found during:** Task 2
- **Issue:** Importing OperatorAnalyticsModule pulled full Nest graph; `CallTag.getAttributes()` requires initialised Sequelize
- **Fix:** Assert model columns and defaults via source-file reads; migration consistency checks unchanged
- **Files modified:** `operator-call-tag.model.spec.ts`
- **Committed in:** `5dc77b6`

**2. [Rule 2 - Missing Critical] Introduced UpdateProjectDto for PATCH validation**
- **Found during:** Task 1
- **Issue:** Controller used inline body types — TagDefinitionDto caps would not run through ValidationPipe
- **Fix:** Added `UpdateProjectDto` with nested `TagDefinitionDto` validation; controller PATCH/POST now use it
- **Files modified:** `project.dto.ts`, `operator-analytics.controller.ts`
- **Committed in:** `2e693b4`

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing critical)
**Impact on plan:** Both required for testability and write-boundary validation. No scope creep.

## Issues Encountered

- Backend repo-wide `npm run lint` reports pre-existing errors in unrelated modules; changed files pass targeted eslint.
- OpenAPI regeneration deferred to plan 10-10 (contract closeout); new DTO fields have `@ApiProperty` ready for export.

## User Setup Required

**Production/staging databases:** Apply manually before taxonomy is exercised in production:

- PostgreSQL: `migrations/postgres/2026-07-30-operator-call-taxonomy.sql`
- MySQL: `migrations/mysql/2026-07-30-operator-call-taxonomy.sql`

See `user_setup` in `10-03-PLAN.md`.

## Next Phase Readiness

- **10-05** can implement `spotTaxonomyTags`, auto-tag writes to `operator_call_tags`, and manual `PATCH /:id/tags`.
- **10-07** can consume `callTaxonomy` for `tagStats` in `getDashboard`.
- **10-08** can link empty «Темы» state to project settings editor built here.

## Self-Check: PASSED

- FOUND: `.planning/phases/10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t/10-03-SUMMARY.md`
- FOUND: backend commit `2e693b4`
- FOUND: backend commit `5dc77b6`
- FOUND: frontend commit `720f10de`

---
*Phase: 10-speech-analytics-ux-overhaul-operator-drill-down-call-tags-t*
*Completed: 2026-07-30*

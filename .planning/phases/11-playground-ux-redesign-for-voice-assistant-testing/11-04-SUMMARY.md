---
phase: 11-playground-ux-redesign-for-voice-assistant-testing
plan: 04
subsystem: ui
tags: [assistants, settings-form, i18n, mui, fsd, migration]

requires:
  - phase: 11-playground-ux-redesign-for-voice-assistant-testing
    provides: Shared AssistantSettingsForm (exclusive Prompt/Parameters/VAD/Tools accordions)
provides:
  - Assistants create/edit field UI via AssistantSettingsForm (D-36 / PG-UX-07)
  - Explicit Save/Create/Delete retained on AssistantFormHeader (Pitfall 7)
  - Obsolete Assistants MainInfo/Model/VAD/Prompt cards removed
affects:
  - 11-05 UAT / polish

tech-stack:
  added: []
  patterns:
    - "Assistants → AssistantSettingsForm feature import with documented layer-imports exception (A5)"
    - "translationNs prop: playground Setup vs assistants page section titles (D-44)"
    - "Assistants-only PipelineCard remains adjacent; shared form has no Save button"

key-files:
  created: []
  modified:
    - src/features/Assistants/ui/AssistantForm/AssistantForm.tsx
    - src/features/Assistants/ui/AssistantForm/AssistantForm.module.scss
    - src/features/Assistants/index.ts
    - src/features/AssistantSettingsForm/ui/AssistantSettingsForm/AssistantSettingsForm.tsx
    - public/locales/{ru,en,de,zh}/assistants.json
  deleted:
    - src/features/Assistants/ui/AssistantForm/components/MainInfoCard/
    - src/features/Assistants/ui/AssistantForm/components/ModelParametersCard/
    - src/features/Assistants/ui/AssistantForm/components/VadSettingsCard/
    - src/features/Assistants/ui/AssistantForm/components/PromptSection/

key-decisions:
  - "Assistants keeps explicit header Save; shared form remains Save-free (D-05 Playground-only)"
  - "Assistants passes translationNs=assistants for accordion titles; Playground keeps playground ns"
  - "PipelineCard stays Assistants-adjacent; not pulled into AssistantSettingsForm"

patterns-established:
  - "Single AssistantSettingsForm powers Playground Setup + Assistants create/edit fields"
  - "Template/copy/generated init hooks stay in AssistantForm wrappers, not shared form"

requirements-completed: [PG-UX-07]

coverage:
  - id: D1
    description: Assistants create/edit mounts AssistantSettingsForm for field UI; cards removed
    requirement: PG-UX-07
    verification:
      - kind: other
        ref: rg AssistantSettingsForm in AssistantForm.tsx; dead cards deleted from features/Assistants
        status: pass
      - kind: unit
        ref: npm run test:unit -- --testPathPattern=AssistantSettingsForm (560 tests pass)
        status: pass
    human_judgment: true
    rationale: Confirm create/edit + Save still required in browser (Pitfall 7)
  - id: D2
    description: AssistantFormHeader Save/Create/Delete unchanged; form has no Save
    requirement: PG-UX-07
    verification:
      - kind: other
        ref: AssistantCard.tsx onSave wired to AssistantFormHeader
        status: pass
    human_judgment: true
    rationale: Manual check that Assistants still needs explicit Save while Playground autosaves
  - id: D3
    description: assistants locale section titles (Промпт/Параметры/VAD/Tools) in ru/en/de/zh
    requirement: PG-UX-07
    verification:
      - kind: other
        ref: public/locales/{ru,en,de,zh}/assistants.json keys
        status: pass
    human_judgment: false

duration: 14min
completed: 2026-08-10
status: complete
---

# Phase 11 Plan 04: Assistants → AssistantSettingsForm Summary

**Assistants create/edit field UI now uses the shared AssistantSettingsForm while keeping explicit Save/Create/Delete in AssistantFormHeader.**

## Performance

- **Duration:** 14 min
- **Started:** 2026-08-10T10:08:08Z
- **Completed:** 2026-08-10T10:20:42Z
- **Tasks:** 2
- **Files modified:** 16 (incl. intentional card deletions)

## Accomplishments

- AssistantForm hosts `AssistantSettingsForm` + Assistants-only `PipelineCard`; initCreate/initEdit and template/copy/generated hooks preserved
- Removed obsolete MainInfoCard / ModelParametersCard / VadSettingsCard / PromptSection from Assistants feature
- Assistants accordion titles use `assistants` i18n namespace (D-44); Playground Setup unchanged

## Task Commits

1. **Task 1: Swap AssistantForm cards for AssistantSettingsForm** - `8d06b4cc` (feat)
2. **Task 2: Retire unused Assistants card modules + locale parity** - `ff7ea89b` (feat)

**Plan metadata:** `6065bdb3` (docs: complete plan)

## Files Created/Modified

- `src/features/Assistants/ui/AssistantForm/AssistantForm.tsx` — shared form + PipelineCard; template init retained
- `src/features/Assistants/ui/AssistantForm/AssistantForm.module.scss` — single-column layout after card stack removal
- `src/features/Assistants/index.ts` — stopped exporting deleted cards
- `src/features/AssistantSettingsForm/.../AssistantSettingsForm.tsx` — optional `translationNs` prop
- `public/locales/{ru,en,de,zh}/assistants.json` — Промпт / Параметры / VAD keys
- Deleted Assistants card/PromptSection modules (replaced by shared sections)

## Decisions Made

- Keep `AssistantFormHeader` onSave as the only Assistants persistence gate (Pitfall 7 / D-05)
- Prefer `translationNs="assistants"` on Assistants page rather than reusing playground keys for titles
- Leave PipelineCard outside shared form (Assistants-specific pipeline UI)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical functionality] Optional translationNs for Assistants section titles**
- **Found during:** Task 1
- **Issue:** Shared form hard-coded `useTranslation('playground')`; Assistants page should own section title keys (D-44 / plan Task 2 preference)
- **Fix:** Added `translationNs?: 'playground' | 'assistants'` (default `playground`); Assistants passes `assistants`
- **Files modified:** `AssistantSettingsForm.tsx`, `AssistantForm.tsx`
- **Verification:** Locale keys added in Task 2; Playground Setup still defaults to playground
- **Committed in:** `8d06b4cc` / `ff7ea89b`

---

**Total deviations:** 1 auto-fixed (Rule 2)
**Impact on plan:** Small prop addition enables Assistants i18n ownership without breaking Playground.

## Issues Encountered

- Full-repo `npm run lint:ts` still reports pre-existing errors (e.g. `webpack.config.ts`); scoped eslint on changed TS files was clean
- `testPathPattern=AssistantSettingsForm` ran the broader unit suite (560 pass) — no AssistantSettingsForm regressions

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for 11-05 UAT/polish: manual Assistants edit → change field → Save required; Playground Setup still autosaves
- Shared surface now has two production consumers (reversibility costly per plan)

## Self-Check: PASSED

- FOUND: `src/features/Assistants/ui/AssistantForm/AssistantForm.tsx` uses AssistantSettingsForm
- FOUND: commits `8d06b4cc`, `ff7ea89b`
- FOUND: card modules deleted; PipelineCard retained
- FOUND: locale keys in ru/en/de/zh assistants.json

---
*Phase: 11-playground-ux-redesign-for-voice-assistant-testing*
*Completed: 2026-08-10*

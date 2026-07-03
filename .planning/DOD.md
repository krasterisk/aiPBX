# Definition of Done — aiPBX

Applies to all GSD phases (frontend + backend).

## Required for every phase

| # | Criterion | Verify |
|---|-----------|--------|
| 1 | TypeScript lint passes | `npm run lint:ts` |
| 2 | Unit tests pass | FE: `npm run test:unit` · BE: `npm test` |
| 3 | Scope matches PLAN.md | No unrelated file changes |
| 4 | STATE.md updated | Phase status + date |

## User-facing UI changes

| # | Criterion |
|---|-----------|
| 5 | i18n keys added to `public/locales/en/` and `public/locales/ru/` |
| 6 | New UI uses `shared/ui/redesign-v3/` components |
| 7 | Storybook story if new shared UI component |

## API contract changes

| # | Criterion |
|---|-----------|
| 8 | Backend DTO + `@ApiProperty` updated |
| 9 | Frontend entity types + RTK endpoint updated |
| 10 | Unit test for service logic |
| 11 | `intel/API-MAP.md` updated if new endpoint |

## Voice / telephony changes

| # | Criterion |
|---|-----------|
| 12 | Manual checklist: playground call works |
| 13 | Manual checklist: SIP call works (if SIP touched) |
| 14 | Billing record created correctly |

## Billing / SBIS changes

| # | Criterion |
|---|-----------|
| 15 | Unit tests on billing service |
| 16 | SBIS sandbox test for invoice/EDO (if SBIS touched) |

## Deploy

| # | Criterion |
|---|-----------|
| 17 | Deploy only via `[deploy all]` or `[deploy:N]` tag on master |
| 18 | Verify health after deploy |

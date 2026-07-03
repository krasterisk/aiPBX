---
phase: 00b-engineering-foundation
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - aiPBX/.env.example
  - aiPBX/vite.config.ts
  - aiPBX/cypress/support/commands/common.ts
  - aiPBX/cypress/support/commands/profile.ts
  - aiPBX/cypress/support/commands/manual.ts
  - aiPBX/cypress.env.example.json
  - aiPBX_backend/.env.example
autonomous: true
gaps: [GAP-03, GAP-04]
must_haves:
  truths:
    - "aiPBX/.env.example documents all webpack-injected client env vars"
    - "No hardcoded 192.168.x.x in vite.config.ts or cypress commands"
    - "package.json scripts contain no API keys or secrets"
    - "Backend .env.example documents SENTRY_DSN and SENTRY_ENVIRONMENT"
  artifacts:
    - path: aiPBX/.env.example
      provides: "Frontend env template"
    - path: aiPBX/cypress.env.example.json
      provides: "Cypress env template"
---

<objective>
Complete secrets hygiene and env documentation (D-05 through D-08).

Purpose: Agents and new devs configure via env files, not committed secrets.
Output: `.env.example` files, env-driven Cypress/Vite URLs.
</objective>

<execution_context>
@$HOME/.cursor/gsd-core/workflows/execute-plan.md
</execution_context>

<context>
@.planning/phases/00b-engineering-foundation/00b-CONTEXT.md
@.planning/phases/00b-engineering-foundation/00b-RESEARCH.md
@.planning/codebase/CONCERNS.md
@aiPBX/webpack.config.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create frontend .env.example (D-06)</name>
  <files>aiPBX/.env.example</files>
  <read_first>aiPBX/webpack.config.ts, aiPBX/config/jest/jest.config.ts, .planning/phases/00b-engineering-foundation/00b-CONTEXT.md</read_first>
  <action>
Per D-06: Create `aiPBX/.env.example` with commented placeholders for:
API_URL, WS_URL, STATIC_URL, GOOGLE_CLIENT_ID, TELEGRAM_BOT_ID, STRIPE_PUBLISHABLE_KEY, SENTRY_DSN, SENTRY_ENVIRONMENT, YANDEX_METRIKA_ID, GA4_MEASUREMENT_ID, PORT.
Use empty string or obvious placeholders like `your-google-client-id` — never real keys.
Add header comment: "Copy to .env.local for local dev".
Match var names exactly to `webpack.config.ts` `process.env.*` reads.
  </action>
  <acceptance_criteria>
    - File `aiPBX/.env.example` exists
    - Contains all 11 var names from D-06
    - No values matching regex `sk_|pk_live|pk_test_[a-zA-Z0-9]{10,}`
  </acceptance_criteria>
  <verify>
    <automated>test -f aiPBX/.env.example && grep -c "SENTRY_DSN\|API_URL\|STRIPE_PUBLISHABLE_KEY" aiPBX/.env.example</automated>
  </verify>
  <done>FE .env.example created with all D-06 vars (D-06)</done>
</task>

<task type="auto">
  <name>Task 2: Remove hardcoded LAN URLs (D-07)</name>
  <files>aiPBX/vite.config.ts, aiPBX/cypress/support/commands/common.ts, aiPBX/cypress/support/commands/profile.ts, aiPBX/cypress/support/commands/manual.ts, aiPBX/cypress.env.example.json</files>
  <read_first>aiPBX/vite.config.ts, aiPBX/cypress/support/commands/common.ts, .planning/codebase/CONCERNS.md</read_first>
  <action>
Per D-07: Replace hardcoded `192.168.2.37` (and port `7000`) in vite.config.ts and cypress command files with:
- Vite: `process.env.API_URL` or `VITE_API_URL` with fallback `http://localhost:5005/api`
- Cypress: `Cypress.env('API_URL')` with default in `cypress.config.ts` env block
Create `cypress.env.example.json` with `{ "API_URL": "http://localhost:5005/api" }`.
Document Cypress env in `.env.example` comment or README snippet.
  </action>
  <acceptance_criteria>
    - `rg '192\.168' aiPBX/vite.config.ts aiPBX/cypress/` returns no matches
    - `cypress.env.example.json` exists with API_URL key
  </acceptance_criteria>
  <verify>
    <automated>rg "192\.168" aiPBX/vite.config.ts aiPBX/cypress/ --glob "!*.md" || exit 0; test -f aiPBX/cypress.env.example.json</automated>
  </verify>
  <done>No hardcoded LAN IPs; Cypress env template exists (D-07)</done>
</task>

<task type="auto">
  <name>Task 3: Audit secrets and extend BE .env.example (D-05, D-08)</name>
  <files>aiPBX/package.json, aiPBX_backend/.env.example</files>
  <read_first>aiPBX/package.json, aiPBX/webpack.config.ts, aiPBX_backend/.env.example, aiPBX_backend/package.json</read_first>
  <action>
Per D-05/D-08:
1. Run `rg 'sk_|pk_live|pk_test|192\.168' aiPBX/package.json aiPBX_backend/package.json aiPBX/webpack.config.ts` — if matches found in committed config, move to env vars; if clean, note in summary.
2. Extend `aiPBX_backend/.env.example` (create if missing) with SENTRY_DSN= and SENTRY_ENVIRONMENT= entries plus comment that DSN is optional (opt-in observability per D-11).
Do not modify `.env` or `.development.env` files.
  </action>
  <acceptance_criteria>
    - `rg 'sk_|pk_live' aiPBX/package.json aiPBX_backend/package.json aiPBX/webpack.config.ts` returns no matches
    - `aiPBX_backend/.env.example` contains SENTRY_DSN and SENTRY_ENVIRONMENT keys
    - No committed file contains real API key values
  </acceptance_criteria>
  <verify>
    <automated>rg "sk_|pk_live" aiPBX/package.json aiPBX_backend/package.json aiPBX/webpack.config.ts; grep SENTRY_DSN aiPBX_backend/.env.example</automated>
  </verify>
  <done>Secrets audit clean; BE .env.example has Sentry vars (D-05, D-08)</done>
</task>

</tasks>

<verification>
- [ ] `.env.example` exists in aiPBX root
- [ ] `rg '192\.168' aiPBX/src aiPBX/vite.config.ts aiPBX/cypress/` — no matches (except markdown/docs)
</verification>

## Artifacts this phase produces

- `aiPBX/.env.example`
- `aiPBX/cypress.env.example.json`
- Env-driven Vite/Cypress URL configuration

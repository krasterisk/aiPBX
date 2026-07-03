---
phase: 07
slug: helpdesk-admin-ticket-system-with-ai-intake-alfawebhook-clie
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-03
---

# Phase 07 — Validation Strategy

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29 (frontend jsdom + backend node) |
| **Config file** | `config/jest/jest.config.ts` (FE); backend `package.json` jest |
| **Quick run command (FE)** | `npm run test:unit -- --testPathPattern=Helpdesk` |
| **Quick run command (BE)** | `cd ../aiPBX_backend && npm test -- --testPathPattern=helpdesk` |
| **Full suite command** | `npm run lint:ts` in both repos + unit tests |
| **Estimated runtime** | ~60 seconds |

## Sampling Rate

- **After every task commit:** Quick run for affected helpdesk module
- **After every plan wave:** Full lint + helpdesk test pattern both repos
- **Before `/gsd-verify-work`:** Full suite green + manual API key tool smoke + admin UI claim flow
- **Max feedback latency:** 120 seconds

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|--------|
| 07-01-01 | 01 | 1 | D-20 | T-07-01 | SQL migration idempotent | file | `test -f migrations/postgres/2026-07-03-helpdesk-tables.sql` | ⬜ pending |
| 07-01-02 | 01 | 1 | D-12 | T-07-02 | PBX apiKey encrypted at rest | unit | `npm test -- helpdesk-pbx-connection` | ⬜ pending |
| 07-01-03 | 01 | 1 | D-01 | — | searchClients phone-first | unit | `npm test -- helpdesk-alfawebhook` | ⬜ pending |
| 07-01-04 | 01 | 1 | D-19 | — | Admin CRUD + claim | unit | `npm test -- helpdesk.service` | ⬜ pending |
| 07-02-01 | 02 | 2 | D-28 | T-07-03 | Scope helpdesk:tools required | unit | `npm test -- api-key.guard` | ⬜ pending |
| 07-02-02 | 02 | 2 | D-27 | — | Built-in handler routes | unit | `npm test -- ai-tools-handlers` | ⬜ pending |
| 07-02-03 | 02 | 2 | D-14 | — | LLM context JSON→MD | unit | `npm test -- helpdesk-llm-context` | ⬜ pending |
| 07-02-04 | 02 | 2 | D-32 | T-07-04 | Notify only unassigned pool | unit | `npm test -- helpdesk-notification` | ⬜ pending |
| 07-03-01 | 03 | 2 | D-18 | — | Table view renders | unit | `npm run test:unit -- HelpdeskTicketTable` | ⬜ pending |
| 07-03-02 | 03 | 2 | D-18 | — | Kanban columns map statuses | unit | `npm run test:unit -- HelpdeskTicketKanban` | ⬜ pending |
| 07-03-03 | 03 | 2 | D-16 | — | LLM context tabs | grep | `grep HelpdeskLlmContextTabs src/entities/Helpdesk/` | ⬜ pending |
| 07-03-04 | 03 | 2 | D-21 | — | i18n ru+en keys | grep | `grep helpdesk public/locales/ru/admin.json` | ⬜ pending |
| 07-04-01 | 04 | 3 | D-22 | — | Voice scenario doc sections | manual | Review `.planning/scenarios/krasterisk-helpdesk-voice-assistant.md` | ⬜ pending |
| 07-04-02 | 04 | 3 | D-10 | T-07-02 | CLI skeleton health endpoint | manual | `node scripts/pbx-remote-handler --help` | ⬜ pending |

## Wave 0 Requirements

- [ ] `helpdesk.service.spec.ts` — CRUD, claim, status transitions
- [ ] `helpdesk-llm-context.service.spec.ts` — hybrid storage regen
- [ ] Extend `ai-tools-handlers.service.spec.ts` — helpdesk handler cases
- [ ] `HelpdeskTicketKanban.test.tsx` — drag/status mapping

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Voice assistant tool chain | D-22–D-25 | Requires live assistant + API key | Configure Krasterisk assistant per scenario doc; place test call; verify ticket created |
| PBX agent promised payment | D-08 | Requires cloud PBX test env | Invoke agent endpoint with test key; verify vpbx_users blocked cleared |
| Alfawebhook GET clients | D-01 | External service | Confirm search returns client by phone/INN on staging alfawebhook |

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity maintained
- [ ] Wave 0 covers MISSING references
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

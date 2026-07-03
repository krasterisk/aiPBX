# Phase 07: Helpdesk — AI-first admin ticket system (Krasterisk) — Research

**Researched:** 2026-07-03  
**Domain:** Admin helpdesk module, alfawebhook client lookup, AI tool intake, LLM client context, PBX remote agent, operator UI  
**Confidence:** HIGH (codebase-verified patterns); MEDIUM (alfawebhook GET /api/clients contract — endpoint may need alfawebhook-side work); LOW (kanban UX — no prior implementation in repo)

## Summary

Phase 7 delivers a **new `HelpdeskModule`** in `aiPBX_backend` plus an **admin-only FSD frontend** for Krasterisk internal support. The codebase already provides the integration spine: `AlfawebhookClient` (POST `/api/clients`), `AiToolsHandlersService` built-in handler dispatch (`knowledge_base` pattern), `ApiKeyGuard` + scope decorators, `OurOrganizationsController` admin-global CRUD template, `MailerModule` / `TelegramModule`, and frontend list/detail patterns in `entities/Chat` + `ChatsPage`.

**No kanban component exists** in the frontend — table + kanban toggle (D-18) requires new entity-level UI in `redesign-v3` SCSS patterns. **Migrations are manual SQL files** in `migrations/postgres/` (no `prisma db push` or Umzug runner in package.json) — each schema plan must include a `[BLOCKING]` SQL apply step documented for deploy.

**Primary recommendation:** Follow ROADMAP wave split (07-01 backend schema+CRUD → 07-02 AI tools+LLM+notifications → 07-03 frontend → 07-04 standalone doc+CLI). Extend `AlfawebhookClient` with `searchClients({ phone?, inn?, name? })` calling `GET /api/clients`. Register helpdesk built-in handlers in `AiToolsHandlersService` before webhook fallback. Use dedicated `HelpdeskToolsController` with `@RequireApiKeyScope('helpdesk:tools')` + `@UseGuards(ApiKeyGuard)` (mirror `ai-models.controller.ts`). Admin JWT routes use `@Roles('ADMIN')` like `our-organizations`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01–D-05:** Client ID — phone first, INN/name fallback, create ticket even if unknown, store Caller ID + optional alt phone, cloud if `pbxUrl` present
- **D-06–D-09:** Cloud billing — `blocked=1` only blocking; promised payment 2–5 days via PBX agent
- **D-10–D-13:** Universal PBX HTTP agent; API key per server in `helpdesk_pbx_connections`; full read+write ops v1
- **D-14–D-17:** LLM context hybrid JSON+MD; auto-update on events; operator two-tab UI; bot fetches via `helpdesk_get_llm_context` tool
- **D-18–D-21:** Table + kanban toggle; unassigned pool self-claim; `/admin/helpdesk` routes; redesign-v3; i18n ru+en
- **D-22–D-25:** Voice — greeting, ticket at call start, transfer_call, full transcript timeline
- **D-26:** Separate chat bot, same tools, different prompt
- **D-27–D-28:** Hybrid built-in handlers + webhooks; `ApiKeyGuard` scope `helpdesk:tools`
- **D-29–D-30:** Categories technical/billing/sales/spam/other; priority bot auto-assign
- **D-31:** Krasterisk Sales Knowledge Base + `knowledge_base` tool on voice+chat
- **D-32–D-34:** Email+Telegram on new unassigned pool tickets; configurable recipients in admin settings
- **D-35:** Defer inbound email parsing; extensible `source` enum on tickets

### Claude's Discretion
- Exact JSON schema for LLM context hybrid storage
- Kanban column mapping to ticket statuses
- PBX agent API endpoint naming and OpenAPI spec
- Unit test coverage boundaries per plan wave
- Alfawebhook `GET /api/clients` query param design

### Deferred Ideas (OUT OF SCOPE)
- Inbound email parsing as ticket source (reserve `source` enum only)
- Direct MySQL alfawebhook access
- `billing/`, `ari/`, `accounting/` changes without explicit task
- Production Krasterisk voice deploy (doc only)
- Enabling disabled `AmiModule` in NestJS app
- End-user tenant ticket visibility
</user_constraints>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Ticket CRUD + status history | API / Backend | Browser (admin UI) | PostgreSQL source of truth; JWT admin routes |
| Alfawebhook client lookup | API / Backend | External alfawebhook REST | `AlfawebhookClient` extension; no direct MySQL |
| AI tool intake (voice/chat) | API / Backend | Assistants runtime | Built-in handlers + optional webhooks; `ApiKeyGuard` |
| LLM client context | API / Backend | AI tools fetch on demand | Stored in `helpdesk_client_context`; not in system prompt |
| PBX diagnostics / promised payment | External PBX agent | API / Backend proxy | `helpdesk_pbx_connections` + HTTP to client `pbxUrl` |
| Operator UI (table/kanban) | Browser / Client | API / Backend | FSD entity + pages; RTK Query |
| Notifications | API / Backend | Mailer/Telegram modules | Trigger on unassigned pool insert |
| Krasterisk voice setup | CDN / Static (doc) | — | `.planning/scenarios/krasterisk-helpdesk-voice-assistant.md` |
| pbx-remote-handler CLI | Standalone script | — | `scripts/pbx-remote-handler/` not in NestJS module |

## Project Constraints (from .cursor/rules/)

- Planning root: `.planning/`; backend sibling `c:/Users/Professional/WebstormProjects/aiPBX_backend`
- DoD: `npm run lint:ts` both repos, unit tests, i18n ru+en, OpenAPI DTO sync, update STATE.md
- Scope: no `ari/`, `billing/`, `accounting/` changes unless explicit plan task
- New UI only in `shared/ui/redesign-v3/` + entity/page layers
- Helpdesk is **admin-global** (no tenant filter) like `our-organizations`

## Standard Stack

### Core (existing — extend, do not replace)

| Library / Module | Location | Purpose | Why Standard |
|------------------|----------|---------|--------------|
| NestJS + Sequelize | `aiPBX_backend` | Models, services, controllers | Established pattern [VERIFIED: codebase] |
| `@nestjs/axios` + `HttpService` | `AlfawebhookClient`, webhooks | External REST | Already used |
| `ApiKeyGuard` + `RequireApiKeyScope` | `api-keys/` | Machine auth for tools | Pattern in `ai-models.controller.ts` |
| `AiToolsHandlersService` | `ai-tools-handlers/` | Built-in handler dispatch | `knowledge_base` precedent |
| RTK Query inject | `entities/*/api/` | Frontend data layer | FSD convention |
| `redesign-v3` | `shared/ui/redesign-v3/` | Input, Button, Combobox | D-21 locked |
| `lucide-react` | package.json | Icons | redesign-v3 README |
| SQL migrations | `migrations/postgres/*.sql` | Schema changes | No ORM migrate CLI [VERIFIED: package.json] |

### New scope constants to add

| Symbol | File | Value |
|--------|------|-------|
| `HELPDESK_TOOLS` | `api-key.service.ts` `API_KEY_SCOPES` | `'helpdesk:tools'` |

## Architecture Patterns

### Backend module layout

```
aiPBX_backend/src/helpdesk/
├── helpdesk.module.ts
├── helpdesk.controller.ts          # JWT admin CRUD
├── helpdesk-tools.controller.ts    # ApiKeyGuard AI endpoints
├── helpdesk.service.ts
├── helpdesk-llm-context.service.ts
├── helpdesk-notification.service.ts
├── helpdesk-pbx-agent.service.ts
├── helpdesk-alfawebhook.service.ts # wraps AlfawebhookClient search
├── models/
│   ├── helpdesk-ticket.model.ts
│   ├── helpdesk-ticket-message.model.ts
│   ├── helpdesk-ticket-status-history.model.ts
│   ├── helpdesk-client-context.model.ts
│   ├── helpdesk-pbx-connection.model.ts
│   └── helpdesk-settings.model.ts
└── dto/
```

Register in `app.module.ts` imports array (mirror `OurOrganizationsModule`).

### Admin-global controller pattern [VERIFIED: our-organizations.controller.ts]

```typescript
@Roles('ADMIN')
@UseGuards(RolesGuard)
@Get()
getAll() { ... }
```

No `req.tokenUserId` tenant filter on list queries — helpdesk tickets are org-wide admin data.

### AI tools built-in handler pattern [VERIFIED: ai-tools-handlers.service.ts]

1. Parse `tool.toolData.handler` string
2. Route to private method before webhook fallback
3. Add cases: `helpdesk_identify_client`, `helpdesk_get_client_info`, `helpdesk_get_llm_context`, `helpdesk_create_ticket`, `helpdesk_add_message`, `helpdesk_pbx_*`

Tool names in assistant config match `aiTools.name`; `toolData.handler` selects built-in path.

### ApiKey AI endpoint pattern [VERIFIED: ai-models.controller.ts]

```typescript
@RequireApiKeyScope(API_KEY_SCOPES.HELPDESK_TOOLS)
@UseGuards(ApiKeyGuard)
@Post('tools/identify-client')
```

Inject `req.apiKeyUserId` for audit fields on ticket creation.

### Alfawebhook client search [VERIFIED: alfawebhook-client.service.ts — POST only today]

Extend with `searchClients(params)`:
- `GET ${ALFAWEBHOOK_BASE_URL}/api/clients?phone=&inn=&name=` (query design per discretion)
- Graceful empty when `ALFAWEBHOOK_BASE_URL` unset (log debug, return `[]`)
- Map response to internal `HelpdeskClientDto` (inn, name, pbxUrl, balance, licNum, organizationId)

**MEDIUM confidence:** GET endpoint contract not verified in alfawebhook repo — plan must include fallback mock/stub for dev when endpoint missing.

### LLM context hybrid (D-14)

Store in `helpdesk_client_context`:
- `contextJson` JSONB — structured fields (tickets summary, billing flags, last diagnostics)
- `contextMarkdown` TEXT — auto-generated from JSON for bot consumption
- `contextMarkdownOverride` TEXT nullable — operator edits (D-16)

Regenerate markdown on: ticket created/closed, operator note, AI diagnostics complete (D-15).

### Frontend FSD layout

```
src/entities/Helpdesk/
├── api/helpdeskApi.ts          # injectEndpoints
├── model/types/helpdesk.ts
├── ui/
│   ├── HelpdeskTicketTable/
│   ├── HelpdeskTicketKanban/
│   ├── HelpdeskTicketCard/
│   └── HelpdeskLlmContextTabs/
src/pages/HelpdeskListPage/
src/pages/HelpdeskDetailPage/
```

Reference: `entities/Chat` list pattern (`ChatsList`, `ChatItem`, `DynamicModuleLoader`).

### Kanban column mapping (discretion recommendation)

| Column | Ticket statuses |
|--------|-----------------|
| New | `new` |
| In progress | `in_progress`, `waiting_client` |
| Resolved | `resolved` |
| Closed | `closed` |

Unassigned pool = `assigneeId IS NULL AND status IN ('new','in_progress')` — "Claim" button sets `assigneeId` to current admin (D-19).

## Don't Hand-Roll

| Problem | Use Instead | Why |
|---------|-------------|-----|
| AI tool HTTP auth | `ApiKeyGuard` + scopes | Existing `api_keys` table |
| Client search HTTP | Extend `AlfawebhookClient` | Single integration point |
| Admin role check | `RolesGuard` + `@Roles('ADMIN')` | Established |
| Email/TG send | `MailerService`, `TelegramService` | D-34 |
| Sales product answers | `KnowledgeService.searchMultiple` | D-31, existing RAG |
| Human transfer on voice | Existing `transfer_call` ai-tool | D-24 |
| New MUI components | `redesign-v3` + SCSS variables | D-21, frontend-fsd rule |
| AMI from NestJS app | PBX remote agent HTTP API | AmiModule disabled per deferred |

## Common Pitfalls

| Pitfall | Prevention |
|---------|------------|
| Tenant-scoped ticket queries | Admin-global service — no `userId` filter on list |
| Injecting full LLM context in system prompt | Tool fetch only after identify (D-17) |
| Treating `balance=0` as blocked | Check `blocked=1` on vpbx_users (D-06) |
| Forgetting SQL migration apply | `[BLOCKING]` task with `migrations/postgres/2026-07-03-helpdesk-*.sql` |
| Missing OpenAPI sync | Run `npm run openapi:export` in backend; regen frontend `schema.d.ts` |
| Scope not on API key | Add `helpdesk:tools` to `API_KEY_SCOPES`; validate in guard |
| Kanban drag without status update | PATCH ticket status on column drop |
| Encrypting PBX API keys | Use existing env crypto pattern or `crypto` + `HELPDesk_ENCRYPTION_KEY` env |

## Code Examples

### Migration file naming [VERIFIED: migrations/postgres/]

`migrations/postgres/2026-07-03-helpdesk-tables.sql` — follow `2026-03-21-chats.sql` style (`SERIAL PRIMARY KEY`, `"createdAt"` timestamps).

### Ticket source enum (extensible per D-35)

```sql
source VARCHAR(32) NOT NULL DEFAULT 'voice'
-- values: voice, chat, manual, email (reserved)
```

### Built-in handler registration point

`ai-tools-handlers.service.ts` lines 35-39 — add helpdesk handler block after `knowledge_base` check, before webhook handler.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Backend framework | Jest (backend `npm test`) |
| Frontend framework | Jest `npm run test:unit` |
| Backend config | `package.json` jest section |
| Frontend config | `config/jest/jest.config.ts` |
| Backend quick run | `cd aiPBX_backend && npm test -- --testPathPattern=helpdesk` |
| Frontend quick run | `npm run test:unit -- --testPathPattern=Helpdesk` |
| Full suite | `npm run lint:ts` + tests both repos |

### Phase Decisions → Test Map

| Decision | Behavior | Test Type | Automated Command | Wave |
|----------|----------|-----------|-------------------|------|
| D-27–D-28 | Built-in handler routes helpdesk tools | unit | `npm test -- ai-tools-handlers.service.spec` | 2 |
| D-28 | Scope `helpdesk:tools` enforced | unit | guard spec or controller e2e | 2 |
| D-01–D-03 | identify_client search order | unit | `helpdesk-alfawebhook.service.spec` | 1 |
| D-14–D-15 | LLM context regen on ticket event | unit | `helpdesk-llm-context.service.spec` | 2 |
| D-32–D-34 | Notification on unassigned insert | unit | `helpdesk-notification.service.spec` | 2 |
| D-18–D-21 | Table/kanban render + i18n keys | unit | `HelpdeskTicketTable.test.tsx` | 3 |
| D-19 | Claim sets assigneeId | unit | RTK mutation test | 3 |
| D-22–D-25 | Voice scenario doc completeness | manual | Checklist in 07-04 | 4 |
| PBX agent CLI | AMI proxy responds | manual | `node scripts/pbx-remote-handler` smoke | 4 |

### Sampling Rate

- **Per task commit:** affected module quick test + `lint:ts` on touched paths
- **Per wave:** full unit suite for helpdesk modules
- **Phase gate:** manual voice tool call with API key + admin UI smoke before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `helpdesk.service.spec.ts` — CRUD + claim
- [ ] `helpdesk-llm-context.service.spec.ts` — JSON→MD generation
- [ ] `ai-tools-handlers.service.spec.ts` — extend with helpdesk handler cases
- [ ] `HelpdeskTicketKanban.test.tsx` — column mapping

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Control |
|---------------|---------|---------|
| V2 Authentication | yes | JWT admin + API key for tools |
| V4 Access Control | yes | `@Roles('ADMIN')` on CRUD; scope on tools |
| V5 Input Validation | yes | DTO ValidationPipe on controllers |
| V6 Cryptography | yes | Encrypt `helpdesk_pbx_connections.apiKey` at rest |
| V10 Malicious Code | yes | PBX agent write ops require bot verbal confirm (D-13) — document in scenario |

### Known Threat Patterns

| Pattern | STRIDE | Mitigation |
|---------|--------|------------|
| API key leakage in assistant config | Information disclosure | Scope-limited keys; rotate via api-keys UI |
| PBX agent destructive AMI | Elevation | Confirm-before-write in agent API; audit log |
| Ticket PII in notifications | Information disclosure | Truncate body in email/TG; link to admin UI |
| SSRF via alfawebhook/pbxUrl | Spoofing | Allowlist pbxUrl hosts or validate URL format |

## Sources

### Primary (HIGH)
- `aiPBX_backend/src/ai-tools-handlers/ai-tools-handlers.service.ts`
- `aiPBX_backend/src/accounting/alfawebhook-client.service.ts`
- `aiPBX_backend/src/our-organizations/our-organizations.controller.ts`
- `aiPBX_backend/src/api-keys/api-key.guard.ts`
- `aiPBX_backend/src/chat/chat.controller.ts` (JwtOrApiKeyGuard pattern)
- `aiPBX/src/entities/Chat/` (list/detail FSD)
- `.planning/phases/07-helpdesk-admin-ticket-system-with-ai-intake-alfawebhook-clie/07-CONTEXT.md`

### Secondary (MEDIUM)
- `.planning/codebase/INTEGRATIONS.md`, `ARCHITECTURE.md`, `CONVENTIONS.md`
- `.planning/scenarios/krasterisk-helpdesk-voice-assistant.md` (draft)
- `migrations/postgres/2026-03-21-chats.sql` (SQL style)

### Tertiary (LOW)
- alfawebhook `GET /api/clients` response shape — needs alfawebhook-side verification

## RESEARCH COMPLETE

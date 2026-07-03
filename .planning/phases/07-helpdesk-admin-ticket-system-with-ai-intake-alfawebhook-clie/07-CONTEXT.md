# Phase 7: Helpdesk — AI-first admin ticket system (Krasterisk) - Context

**Gathered:** 2026-07-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Administrative helpdesk module in aiPBX frontend + aiPBX_backend for Krasterisk internal support: ticket lifecycle, client identification via alfawebhook REST API, LLM-optimized client context, AI intake (voice + separate chat bot), operator admin UI, email/Telegram notifications, universal PBX agent integration for cloud/on-prem diagnostics, standalone Krasterisk voice scenario doc and pbx-remote-handler CLI.

**Admin-only** for v1 — end-user tenants do not see helpdesk tickets.

**Client data source:** alfawebhook `clients` table via REST API only (no direct MySQL from aiPBX).

</domain>

<decisions>
## Implementation Decisions

### Client identification
- **D-01:** Search order — **Caller ID (phone) first**; may auto-identify. If not found, ask **INN** and/or **organization name**.
- **D-02:** Multiple name matches — **confirm by INN** or full legal name; voice up to 2–3 options.
- **D-03:** Not found — ask organization name; **still create ticket** even if not our client. If client requests human and cannot identify — **create ticket with available data AND transfer call**.
- **D-04:** Phone storage — **always save original Caller ID**; ask *«Контактный номер, с которого вы звоните, или другой?»* — if another, store both numbers in ticket.
- **D-05:** Cloud vs on-prem — if `pbxUrl` present in alfawebhook, treat as **cloud**; do not ask client type. Proceed to issue; fetch PBX data only when needed.

### Cloud PBX billing & blocking (vpbx_users on pbxUrl servers)
- **D-06:** `balance = 0` is **NOT** blocking. Mention balance/billing **only when `blocked = 1`** (insufficient funds after debiting).
- **D-07:** `debitingday` — day of month for billing debit. Blocked client = debit happened, insufficient balance.
- **D-08:** **Promised payment (обещанный платёж)** — offer when `blocked = 1`: default **2 days** (`debitingday + 2`); if client asks more, agree up to **max 5 days**. Activate via **universal PBX agent API** endpoint.
- **D-09:** Cloud data model reference — `vpbx_users` table on cloud PBX (fields: `balance`, `debitingday`, `blocked`, `licnum`, modules, etc.) — see `<specifics>`.

### Universal PBX agent (cloud + on-prem)
- **D-10:** Deploy **universal HTTP API agent** on client web server or cloud PBX — proxies AMI, client DB reads, diagnostics, and write ops (promised payment, channel hangup, Asterisk reload) with bot confirmation.
- **D-11:** Not required to route via alfawebhook — may use dedicated Krasterisk proxy for all cloud PBX, but **must support per-client PBX endpoint** configuration (cloud or on-prem when access known).
- **D-12:** Auth — **API key per server**, stored encrypted in **`helpdesk_pbx_connections`** table (url, apiKey, type cloud/on-prem, link to alfawebhook `clients.id`).
- **D-13:** First release scope — **full ops**: read (vpbx_users, SIP registrations, channels) + write (promised payment, hangup stuck channels, AMI reload) with bot verbal confirmation before destructive actions.

### LLM client context
- **D-14:** Storage format — **hybrid**: JSON for API/storage + auto-generated Markdown for bot consumption.
- **D-15:** Auto-update on events: ticket created, resolved/closed, operator note added, AI diagnostics completed.
- **D-16:** Operator UI — **two tabs**: human-readable summary + LLM raw context; **operator can edit LLM context directly**.
- **D-17:** Bot retrieval — **`helpdesk_get_llm_context` tool fetch** after client identified; do not inject full context into system prompt.

### Operator admin UI
- **D-18:** List views — **both table and kanban** with toggle; no staged v1/v2 split — build complete from start.
- **D-19:** Assignment — **unassigned pool**; operators self-claim tickets from pool.
- **D-20:** Routes — `/admin/helpdesk` (list) and `/admin/helpdesk/:id` (detail); menubar item **Helpdesk** under admin section.
- **D-21:** UI stack — redesign-v3 only; i18n ru + en.

### Voice scenario (Krasterisk)
- **D-22:** Opening — *«Добрый день, компания Krasterisk, меня зовут [имя]. Чем могу помочь?»* then to issue.
- **D-23:** **Create ticket on every call** — at call start (status `new`); update during diagnostics; close if resolved. Mark **non-target calls** in ticket category/notes.
- **D-24:** Human transfer — use existing **`transfer_call` tool**; operator number configured in assistant prompt.
- **D-25:** Ticket timeline — create at start, update through call, close when resolved; attach full transcript.

### Chat intake
- **D-26:** **Separate chat bot** with same helpdesk tools/API but **different prompt** from voice assistant.

### AI tools integration
- **D-27:** **Hybrid** — built-in handlers in `ai-tools-handlers` for core helpdesk tools (like `knowledge_base`) + AiTool webhooks for customization.
- **D-28:** Secure AI endpoints with **`ApiKeyGuard`** + scope `helpdesk:tools`.

Core tools: `helpdesk_identify_client`, `helpdesk_get_client_info`, `helpdesk_get_llm_context`, `helpdesk_create_ticket`, `helpdesk_add_message`, PBX agent diagnostics tools.

### Ticket categories & priority
- **D-29:** Categories — **standard set**: `technical`, `billing`, `sales`, `spam/non-target`, `other`; bot auto-selects. Pay attention to **sales** and **non-target** marking.
- **D-30:** Priority — **bot auto-assigns**: `urgent` = blocked/ATС down; `high` = escalation; `normal` = default; `low` = non-target/sales inquiry.

### Sales consultation
- **D-31:** Use existing **Knowledge Base** module — create **«Krasterisk Sales»** KB with products, pricing, aiPBX voice robot self-presentation docs; attach **`knowledge_base` search tool** to voice + chat assistants.

### Notifications (email + Telegram)
- **D-32:** Channels — **both email and Telegram** on new unassigned tickets in pool.
- **D-33:** Trigger — **new unassigned tickets** entering operator pool (not all status changes).
- **D-34:** Recipients — **configurable list** in helpdesk admin settings (emails + Telegram chat IDs); reuse `MailerModule` + `TelegramModule`.

### Email channel (intake)
- **D-35:** **Defer inbound email parsing** as ticket source; architecture must allow adding email intake in next release. Email used for **outbound operator notifications** in this phase.

### Claude's Discretion
- Exact JSON schema for LLM context hybrid storage
- Kanban column mapping to ticket statuses
- PBX agent API endpoint naming and OpenAPI spec
- Unit test coverage boundaries per plan wave
- Alfawebhook `GET /api/clients` query param design (if endpoint must be added on alfawebhook side)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning & product
- `.planning/ROADMAP.md` — Phase 7 scope, plan breakdown 07-01–07-04
- `.planning/PROJECT.md` — dual-repo rules, agent constraints, Krasterisk context
- `.planning/GAPS.md` — GAP-25 Admin page stub
- `.planning/scenarios/krasterisk-helpdesk-voice-assistant.md` — standalone voice setup doc (to be completed in 07-04)

### Codebase maps
- `.planning/codebase/ARCHITECTURE.md` — NestJS modules, FSD frontend, admin patterns
- `.planning/codebase/INTEGRATIONS.md` — alfawebhook, ai-tools, MCP, API keys
- `.planning/codebase/CONVENTIONS.md` — FSD layers, redesign-v3, DTO sync rules

### Backend reuse points
- `aiPBX_backend/src/accounting/alfawebhook-client.service.ts` — extend for GET clients
- `aiPBX_backend/src/ai-tools-handlers/ai-tools-handlers.service.ts` — built-in handler pattern (`knowledge_base`)
- `aiPBX_backend/src/ai-tools/ai-tool.model.ts` — webhook tool definitions
- `aiPBX_backend/src/api-keys/api-key.guard.ts` — AI endpoint auth
- `aiPBX_backend/src/our-organizations/our-organizations.controller.ts` — admin CRUD pattern
- `aiPBX_backend/src/knowledge/knowledge.service.ts` — Sales KB + RAG search
- `aiPBX_backend/src/mailer/mailer.service.ts` — email notifications
- `aiPBX_backend/src/telegram/telegram.service.ts` — Telegram notifications
- `aiPBX_backend/src/ami/ami.service.ts` — reference for PBX agent AMI ops (module disabled in app)
- `aiPBX_backend/src/payments/payments.service.ts` — legacy pbxBalanceUpdate patterns

### Frontend reuse points
- `aiPBX/src/pages/AdminPage/ui/AdminPage.tsx` — stub to extend/replace with helpdesk hub link
- `aiPBX/src/widgets/Menubar/model/selectors/getMenubarItems.ts` — admin subItems navigation
- `aiPBX/src/app/providers/router/config/routeConfig.tsx` — route + role guards
- `aiPBX/src/pages/ChatsPage/` — reference for admin list/detail pages

### External data schemas (founder-provided)
- alfawebhook `clients` table — INN, KPP, name, pbxUrl, balance, licNum, etc. (see prior phase context)
- Cloud PBX `vpbx_users` table — uid, balance, debitingday, blocked, licnum, modules (see `<specifics>`)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AlfawebhookClient` — outgoing client registration; extend for search/read
- `AiToolsHandlersService.functionHandler` — webhook + built-in handler dispatch
- `ApiKeyGuard` + `api_keys` table — secure machine-to-machine for assistant tools
- `KnowledgeService.searchMultiple` — sales/product RAG for bot
- `OurOrganizationsController` — `@Roles('ADMIN')` CRUD template
- `MailerModule` / `TelegramModule` — notification delivery
- Existing `transfer_call` ai-tool — human escalation on voice calls

### Established Patterns
- NestJS: controller → service → Sequelize model → DTO + Swagger
- Frontend: entity RTK Query inject, pages lazy-loaded, admin routes with `UserRolesValues.ADMIN`
- AI intake: assistant linked to ai-tools; webhooks POST to `/api/*` with Bearer API key
- Multi-tenant JWT scoping — helpdesk is **admin-global** (bypass tenant filter like our-organizations)

### Integration Points
- `app.module.ts` — register `HelpdeskModule`
- `routeConfig.tsx` + `router.ts` — `/admin/helpdesk` routes
- `getMenubarItems.ts` — Helpdesk menu entry
- Assistant config UI — link helpdesk + sales KB tools to Krasterisk voice/chat bots
- Standalone `scripts/pbx-remote-handler/` — PBX agent reference implementation (07-04)

</code_context>

<specifics>
## Specific Ideas

### alfawebhook `clients` (REST source)
Key fields for bot: `inn`, `kpp`, `name`, `pbxUrl`, `balance`, `licNum`, `email`, `dogovor`, `organizationId`.

### Cloud PBX `vpbx_users` (on pbxUrl server)
```sql
-- Key fields for helpdesk bot decisions:
-- balance, debitingday (day of month), blocked (1 = blocked after failed debit),
-- licnum, email, telegram, tariff, renta, vpbx_module_* flags
```

### Krasterisk voice flow (summary)
1. Greeting → identify by phone → INN/name if needed
2. Fetch LLM context tool if client found
3. Diagnose (PBX agent tools, sales KB for product questions)
4. Ticket created at call start; updated live; closed if resolved
5. Transfer via `transfer_call` when requested or escalation needed
6. Notify operators (email + TG) when unassigned ticket in pool

### Sales bot capability
Bot must present aiPBX voice robots when clients ask — use Krasterisk Sales Knowledge Base.

</specifics>

<deferred>
## Deferred Ideas

### Planned next release (architecture reserve, not this phase delivery)
- **Inbound email parsing** as ticket source (`source: email`) — defer implementation; design models/API with extensible `source` enum
- **Direct MySQL** read from alfawebhook — rejected; REST only

### Out of phase scope (from ROADMAP)
- Changes to `billing/`, `ari/`, `accounting/` modules without explicit plan task
- Production deploy of Krasterisk voice line (documented in standalone scenario only)
- Enabling disabled `AmiModule` in NestJS app — use PBX agent + standalone CLI instead

### Noted for future phases
- End-user tenant visibility of their own tickets
- Full MCP server as separate deployable (v1 uses ai-tools + documented schemas)

</deferred>

---

*Phase: 7-Helpdesk — AI-first admin ticket system (Krasterisk)*
*Context gathered: 2026-07-03*

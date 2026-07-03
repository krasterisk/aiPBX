# Phase 7: Helpdesk — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `07-CONTEXT.md`.

**Date:** 2026-07-03
**Phase:** 7-Helpdesk — AI-first admin ticket system (Krasterisk)
**Areas discussed:** client_id, llm_context, operator_ui, cloud_pbx, voice_flow, notifications, ai_tools, categories, sales_kb, priority, email_channel, chat_intake

---

## Client identification

| Option | Description | Selected |
|--------|-------------|----------|
| INN first | B2B standard search order | |
| Name first | Organization name primary | |
| Phone first | Caller ID first, then INN/name | ✓ |
| Flexible | Bot decides by context | |

**User's choice:** Phone first; if not identified, ask INN/name. Always store Caller ID; ask if contact number is calling number or another.

**Notes:** If not our client — still create ticket. Multiple matches — confirm INN. Human transfer when requested — create ticket + transfer. Cloud client (pbxUrl) — don't ask type; check balance/blocking only when needed. Balance 0 ≠ blocked; mention billing only when blocked=1; promised payment 2 days (max 5).

---

## LLM context

| Option | Description | Selected |
|--------|-------------|----------|
| Markdown | Structured sections for LLM | |
| JSON | Machine-readable only | |
| Hybrid | JSON + Markdown | ✓ |

**User's choice:** Hybrid storage; auto-update on ticket events; two UI tabs (human + LLM raw) with operator edit; bot uses tool fetch not system prompt injection.

---

## Operator UI

| Option | Description | Selected |
|--------|-------------|----------|
| Table only | Filters and sort | |
| Kanban only | Status columns | |
| Both views | Toggle table/kanban | ✓ |

**User's choice:** No v1/v2 split — build properly. Unassigned pool (self-claim). Routes `/admin/helpdesk`. User rejected phased UI delivery.

---

## Manual ticket creation (2026-07-03 follow-up)

**User request:** Admin cannot create tickets by hand — must be possible from frontend.

| Aspect | Decision |
|--------|----------|
| Backend | Already `POST /helpdesk/tickets` with `source: manual` |
| Frontend gap | No create button/modal on `HelpdeskListPage` |
| UX | Modal «Создать заявку» on list page |
| Client search | Optional identify via `/helpdesk/clients/identify` |
| After create | Redirect to ticket detail |
| Assignment | Auto-claim to creator (proposed — avoids pool notification noise) |

**User confirmed:** 1a (auto-assign), 2a (client search with identify API).

**Implemented 2026-07-03:** `CreateHelpdeskTicketModal`, backend `assigneeId` on admin create.

Captured as **D-36** in `07-CONTEXT.md`.

---

## Cloud / on-prem PBX agent

| Option | Description | Selected |
|--------|-------------|----------|
| Legacy pbxUrl API | Direct to known endpoints | |
| alfawebhook proxy | Via alfawebhook only | |
| Universal agent API | HTTP agent on client/cloud server | ✓ |

**User's choice:** Universal API on client web server or cloud PBX — AMI, DB, diagnostics, config. API key per server in `helpdesk_pbx_connections`. Full ops in first release including promised payment via agent. Optional Krasterisk proxy for cloud fleet but per-client endpoint required.

---

## Voice scenario

| Option | Description | Selected |
|--------|-------------|----------|
| Krasterisk greeting | Brand intro then issue | ✓ |
| IVR menu first | Department selection | |
| Identify first | Before greeting issue | |

**User's choice:** Ticket on every call (create at start, update during, close if resolved). Non-target calls flagged. Transfer via existing `transfer_call` tool with number in prompt.

---

## Notifications

| Option | Description | Selected |
|--------|-------------|----------|
| Email + Telegram | Both channels | ✓ |
| Telegram only | | |
| Email only | | |

**User's choice:** Notify on new unassigned pool tickets. Recipients configurable in helpdesk admin settings.

---

## AI tools

| Option | Description | Selected |
|--------|-------------|----------|
| Webhooks primary | AiTool → Helpdesk API | |
| Built-in handlers | ai-tools-handlers | |
| Hybrid | Both | ✓ |

---

## Categories & sales

**User's choice:** Standard categories including sales and non-target. Sales consultation via Knowledge Base «Krasterisk Sales» + knowledge_base tool. Bot auto-assigns priority.

---

## Email & chat channels

**User's choice:** Defer email intake; plan architecture for future. Separate chat bot (same tools, different prompt). Email for outbound notifications only in this phase.

---

## Claude's Discretion

JSON schema details, kanban columns, PBX agent OpenAPI, alfawebhook GET API design if missing.

## Deferred Ideas

- Inbound email ticket parsing (next release)
- End-user ticket portal
- Standalone MCP server deploy

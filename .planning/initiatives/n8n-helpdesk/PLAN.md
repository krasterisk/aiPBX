# n8n helpdesk — PLAN rev 1 (2026-10-08)

Scope authorized by user: deploy n8n on ipbx.krasterisk.ru/helpdesk/, Yandex mail, DeepSeek API, aiPBX context, PostgreSQL history, Telegram approval, backups.
Coordinator/executor: Codex /root. Mode: codex-direct. No delegated agents.
Inputs: user attachment and chat; .planning/PROJECT.md and intel/ARCHITECTURE.md; backend src/helpdesk and api-keys contracts.

1. Deploy isolated Docker Compose n8n + PostgreSQL + integration bridge under /opt/aipbx-helpdesk. Preserve existing Asterisk/MySQL/nginx/VPN/backend. Pin image versions; bind n8n to loopback. Add nginx /helpdesk/ proxy with HTTPS. Create owner before exposing setup.
2. Validate Yandex IMAP/SMTP login, DeepSeek access, Telegram bot and approver metadata without disclosing secrets. No customer test emails.
3. Implement durable inbox/history and draft revision state, Telegram approval restricted to configured user/chat, SMTP reply threading, duplicate guards. Model cannot select recipient/project or send. Ambiguous/unmapped email held for manual verification. Client rules require source and human approval.
4. Integrate aiPBX only using authenticated, tenant-correct API contract. Current helpdesk identify method lacks email; remote :5010 helpdesk route is 404. API URL/key and verified project mapping are dependencies, not guessed values.
5. Configure daily backups and run backup + isolated restore validation. Verify health, editor assets/settings, restart, unit/integration approval guards. Record pending external gates explicitly.

Allowed writes: aiPBX_backend/docker/helpdesk/**; this initiative directory; one link in intel/DOCS-INDEX.md; server /opt/aipbx-helpdesk/**, additive nginx locations in krasterisk (backup first), helpdesk backup systemd units. No unrelated source/deploy/STATE changes.
Acceptance: UI HTTPS healthy; private database; persisted encryption key; restart policies; backup restore tested; rejection of unauthorized/stale/repeated approvals; no SMTP send without concrete human approval; aiPBX project context verified before activating customer processing.

## Revision 2 — email project context (2026-10-08)

Extend owned paths to backend src/helpdesk/helpdesk-email-context{.controller,.service,.service.spec}.ts, src/helpdesk/dto/helpdesk-email-context.dto.ts, and src/helpdesk/helpdesk.module.ts. Implement POST helpdesk/tools/email-project-context under existing helpdesk:tools scope, additionally requiring an active ADMIN key owner. Exact case-insensitive email lookup; owner resolution via vpbx_user_id; never choose among multiple projects; bounded project-scoped samples. No webhook credentials returned. Deploy to aipbx.ru remains pending connection/deployment information. Bridge validates resolved IDs against manual mappings and requests manual project selection on ambiguity.


## Revision 3 — two products and runtime product knowledge
User clarified: analytics project is required only for speech analytics. Voice assistants, balance and general account questions use cabinet scope. Same coordinator and owned helpdesk files; additionally own docker/helpdesk/knowledge/** and routing.py. Give DeepSeek verified product documentation and a validated read plan over cabinet/analytics context, not an unconstrained API client. Email determines cabinet in trusted code; model cannot choose recipient, cabinet, credentials or write settings. Balance is stored in USD; render tenant currency only with valid FX rates. Assistant configuration is not evidence of live online status. Reprocess ticket #2 after deployed fix; keep exact Telegram revision approval for send.


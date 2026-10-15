# EXECUTION

Coordinator: Codex /root (current chat). Mode: codex-direct.
Current plan: PLAN.md rev 1, 2026-10-08.
Owned paths: see PLAN.md. Workers: coordinator only.
Baseline frontend: master 076f59b; dirty package.json, MetricPromptEditor.tsx, TaxonomyEditor.tsx (preserve).
Baseline backend: master 1c42a17; clean.
Status: in_progress. Next action: deploy isolated infrastructure and run integration credential checks.
Pending: aiPBX API URL/key + email-to-cabinet/project contract, live approval/send acceptance.

Current plan updated: rev 2; backend endpoint files exclusively owned by coordinator. Next action: local implementation and targeted tests; remote backend deploy pending.


## Verified progress (2026-10-08)
- Backend API implemented and released: 1af5b95 via GitHub Actions 37767409257, all jobs success; 80 suites / 936 tests passed, targeted lint/TypeScript pass.
- n8n/PostgreSQL17/bridge deployed; HTTPS editor/assets/settings and owner login pass; daily backup + isolated restore pass.
- Dedicated @aiPBXhelpdeskbot through existing TELEGRAM_PROXY; correct approver/private chat verified and connection notification delivered. Token accidentally appeared in a library error; user revoked it, replacement fingerprint verified; HTTP/transport errors now sanitized and regression-tested.
- Both workflows active, mailbox initialized with historical mail skipped. Test ticket #1 correctly matched cabinet but has no analytics project, so held with Telegram notification and no outbound email.
- Adapter: 17 unit/isolated PostgreSQL tests pass with mocked SMTP, including stale/unauthorized/duplicate approvals, uncertain-send no retry, and notification recovery.
- GitGuardian 1af5b95 configure.py:9 confirmed false positive on generated-password prefix. 32 current/historical secrets compared to commit diff, no matches. Fixed generator; existing n8n password unchanged.
- Pending: general/assistant question path must not require an analytics project (latest user requirement). Inspect n8n execution metadata persistence: scheduler creates rows remaining running with save-on-success=none; do not call scheduler completions verified until resolved. Live draft and human-approved SMTP reply remain pending.
- Coordinator remains Codex /root, codex-direct. No agents. Next action: add safe cabinet/assistant context and classification, test and deploy via [deploy:3], resolve execution evidence, run live acceptance. Preserve frontend dirty baseline; no product phase STATE changes.


## Product routing revision 3
- Current plan: PLAN.md rev 3; coordinator /root, codex-direct, same owned paths.
- Implemented cabinet scope with assistant whitelist and tenant-currency balance; project required only for specific speech analytics. Short product guide and validated model JSON read plan, adapter-mediated API calls; no native tools/MCP/document search.
- Backend 80 suites / 939 tests pass; TypeScript and targeted eslint pass. Adapter 20 tests pass against isolated PostgreSQL with SMTP mocked. Live DeepSeek routing: assistant+balance=cabinet, project metrics=analytics_project, general product comparison=no project, all pass.
- dad9c26 pushed with [deploy:3], Actions 37772696822 quality pass; production deploy in progress at this checkpoint.
- n8n save-success/error=all (168h pruning) gives successful completed execution metadata after restart; historical running rows retained. Need verify both workflow IDs finish.
- Pending: finish deployment, reprocess test ticket #2 with cabinet scope, deliver draft for human approval; SMTP acceptance requires actual button approval. Ticket #1 analytics hold preserved.
- Scope limitation: guide is a small reviewed overview, not whole-project knowledge. User asked how data reaches model; explained current JSON context and adapter routing, no MCP. Full documentation retrieval is not implemented.

## Live checkpoint 2026-10-08 11:55 UTC
- Released dad9c26 on aipbx.ru: Actions 37772696822 all jobs success, quality 939 tests. Bridge image updated separately on ipbx.krasterisk.ru.
- Cabinet endpoint live: test sender resolves, 4 assistant configurations, balance available in RUB; no analytics project required. Ticket #2 reprocessed under mail advisory lock, readPlan=[cabinet], context key cabinet, draft v1 delivered to Telegram (notified_revision=1), status pending_approval. Draft explicitly says assistant online status unverified and reports API balance/currency/time.
- Both active n8n workflows have repeated success/completed executions after save-success/error=all. Old running rows are historical metadata; not evidence of current stuck jobs.
- 8e51989 commits mixed-product partial context and execution metadata fix; adapter 20 tests passed after change. Backup 20261008T115507Z complete.
- Remaining gate: configured human approves/rejects/edits ticket #2 in Telegram. Do not bypass button/hash approval. Next action: after approval verify ticket sent and SMTP acceptance, outgoing Message-ID/thread and no duplicate. Recipient delivery is a separate human check. SMTP uncertainty must be reconciled, never retried automatically.
- The new small runtime product guide is in the system prompt; it is not full project documentation or MCP. User's latest architecture questions answered honestly. Full knowledge retrieval/native tool calling are not implemented.
- Owned diagnostic helpers are untracked in backend docker/helpdesk (inspect*, probe-mail.py, reprocess-test.py). No secret values in those files; no unrelated baseline edits committed. Frontend initiative/index docs remain local; original unrelated dirty frontend files preserved.

## Callback bug repair — 2026-10-08
- User reported both buttons appear unresponsive. Read-only audit confirmed ticket #2 already sent: exactly one approved_sending and smtp_accepted, outgoing Message-ID recorded. Telegram acknowledgement raised TelegramAPIError after the durable decision, hiding status and interrupting cursor advancement.
- Coordinator /root owns docker/helpdesk/bridge.py/tests.py/install-workflows.py and schedule migration only; no backend API changes. Fix acknowledges before SMTP, tolerates acknowledgement failure, then notifies result. Duplicate sent/rejected clicks return explicit status; sending guard retained.
- Automated tests: 22 adapter unit/isolated PostgreSQL tests pass with mocked SMTP, including expired approve/reject callback and acknowledgement order. Runtime bridge rebuilt/deployed. Recovery poll returns ok with zero queued updates; ticket #2 remains sent, one SMTP acceptance.
- Approval schedule migration: 5-second polling, preserve exported previous workflow; publishing/restart verification pending at this checkpoint. Human fresh click feedback remains a live UI gate; do not fabricate callback or resend ticket.
- Schedule repair released: approval workflow active with secondsInterval=5; n8n restarted. Callback fix committed/pushed ab0c656; import ownership correction a69e75c. Backup 20261008T120116Z complete. Ticket #2 SMTP acceptance recorded exactly once; no resend performed. Fresh human button click feedback remains pending live UI verification.

Active: PLAN rev4, /root codex-direct. Independent registry/source redesign in progress; unrelated operator-analytics dirty file preserved. Next: registry schema and connector/Telegram management implementation.

## Revision 4 release / handoff — 2026-10-09
Coordinator /root, mode codex-direct; PLAN rev4, Docker helpdesk/initiative scope only. Backend baseline advanced independently to afddaa2; pre-existing dirty src/operator-analytics/operator-analytics.service.ts preserved and not staged. No product STATE/ROADMAP changes or extra agents.

Implemented/released on ipbx.krasterisk.ru:
- HTTPS /helpdesk-clients/ browser console and @aiPBXhelpdeskbot Mini App menu. Owner-only initial login, no registration. scrypt password hashes, strict JWT issuer/audience/algorithm/expiry, current-account role/version checks, logout revocation, POST Origin checks, login rate/concurrency limits. Owner-created operator accounts; assigned-client/ticket visibility, no source/credential/account management or sending by operators.
- Independent PostgreSQL clients/contacts/shared sources/client bindings. No implicit aiPBX sender lookup. Telegram /client TICKET CLIENT_ID or reply with bare client ID. Unknown senders held; configured registry contacts resume after active source bindings. Historical ticket linkage does not resend; customer agreements follow explicitly linked client.
- aiPBX/API/PostgreSQL/MySQL/SSH/knowledge/MCP readers. Fixed operator-configured SQL/argv/URL/tenant arguments; model only chooses allowed bound reads/search. Query text cannot override fixed tenant arguments. Bounded two-round read plan, source provenance/revisions, scrubbed model inputs/results; no arbitrary model shell/SQL, sending or configuration writes.
- Write-only credential fields, AES-GCM protected private files with per-source authenticated identity and atomic/process-locked updates; vault/JWT keys separate. Git and Docker context exclude runtime credentials. Existing user-entered SSH credential retained and encrypted.
- Ticket queue/search/status/pagination, staff assignment, comments, inbound/outbound messages, draft revisions, model/read/action timeline, historical requests, public source/binding revision history. Human case status separate from SMTP status. New same-sender replies join a known thread, invalidate old pending draft and increment revisions. Superseded preparation cannot overwrite newer work. Exact-version owner approval/SMTP uncertainty/dedup guards retained.

Acceptance evidence:
- 50 automated Python unit/integration tests PASS in isolated helpdesk_test with private temp vault. Includes JWT/Telegram signature checks, cookie-blocked Mini App bearer fallback, access controls, secret non-disclosure/encryption/AAD, client isolation, unknown sender no network, source selection, search/tenant separation, threading/dedup, approval guards and journal. SMTP/model/MCP protocol fixtures mocked where stated. Real local SSH server fixture and actual isolated PostgreSQL reader PASS. Not an independent review.
- Live HTTPS login/state/ticket-history PASS; unauthenticated state 401, no auth hashes/vault keys or credential values returned. Real Chrome desktop/mobile screenshots PASS, no page JS errors/overflow, secret fields blank. JWT Mini App server flow is integration-tested; physical Telegram launch/login remains human UAT (menu configuration/getChatMenuButton verified live).
- Live aiPBX reader through encrypted credential PASS: configured owner selector cabinet, four assistant configurations and balance available in RUB. Other real customer servers/MCP/MySQL need their provided configuration and read test; no claim of universal live connector verification.
- n8n inbox and five-second approval workflows active with success/completed executions; bridge health PASS. Four prior tickets preserved; #2 SMTP accepted once, waiting_client. #1/#3/#4 held for setup.
- Backup 20261009T070722Z checksum PASS, encrypted vault/signing keys included, full helpdesk dump restored into new helpdesk_console_restore_check; restored counts tickets=4, clients=1, sources=2, users=1. Existing production data untouched by restore. Prior-source.tar a69e75c retained for rollback rebuild; Docker old image metadata unavailable for tagging. Current snapshots are root-only; no off-server backup.

User is already configuring the live UI: one client and two sources, including their SSH source #2. It remains inactive and has no binding; do not enable or infer parameters. Next: owner sets client-source params/instructions/allowed operations in «Привязки и проверки», manually tests (owner may preview inactive sources), enables intended binding/source and links relevant ticket ID. Then verify real source-read timeline/draft for that customer and human-approved reply. No production customer registry test records fabricated/imported. Limits: PostgreSQL/MySQL only; MCP Streamable HTTP 2025 family, no stdio/OAuth; knowledge search lexical or external RAG API/MCP; no attachment processing/remediation. Existing historical traces not invented.

Release commit af85175 pushed to origin/master. 27 owned helpdesk files, 50 tests passed; unrelated operator-analytics dirty file remains local. Final Chrome QA and live console/API checks passed after latest deployment; backup/restore checkpoint above is current. No backend deployment marker used because no aiPBX API change was required; console/bridge deployed directly to the already-authorized ipbx server.

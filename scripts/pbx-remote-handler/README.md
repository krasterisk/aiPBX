# pbx-remote-handler

Standalone HTTP agent for **on-prem** Krasterisk PBX instances.  
Called by `HelpdeskPbxAgentService` in `aiPBX_backend` (not part of NestJS).

## Install

```bash
cd scripts/pbx-remote-handler
cp .env.example .env
# Edit PBX_AGENT_API_KEY — use a long random string
npm install
npm start
```

Default bind: **`127.0.0.1:3109`** (local only). Put nginx/reverse proxy in front if remote access is needed.

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `PBX_AGENT_API_KEY` | Yes | Must match key stored in `helpdesk_pbx_connections` (encrypted on backend) |
| `PBX_AGENT_HOST` | No | Default `127.0.0.1` |
| `PBX_AGENT_PORT` | No | Default `3109` |
| `PBX_MYSQL_DSN` | No | `mysql://user:pass@host:3306/db` — read `vpbx_users`; stub if unset |
| `AMI_HOST` / `AMI_PORT` / `AMI_USER` / `AMI_PASS` | No | Reserved for real hangup (TODO) |

## Authentication

Every request requires:

```http
X-Api-Key: <PBX_AGENT_API_KEY>
```

Missing or wrong key → **401**.

## Endpoints (HelpdeskPbxAgentService)

| Method | Path | Body | Notes |
|--------|------|------|-------|
| GET | `/health` | — | `{ ok: true }` |
| GET | `/api/vpbx-user` | query `uid` optional | balance, debitingday, blocked, licnum |
| GET | `/api/sip-registrations` | — | stub list |
| POST | `/api/promised-payment` | `{ days: 2..5 }` | stub success |
| POST | `/api/hangup-channel` | `{ channelId, confirm: true }` | 400 if confirm !== true |

Alternate paths (docs): `GET /vpbx/user/:uid`, `POST /vpbx/promised-payment`, `POST /ami/hangup`.

## Backend wiring

1. Run this agent on the PBX host.
2. Insert row in `helpdesk_pbx_connections`:
   - `alfawebhookClientId` — client id from alfawebhook
   - `url` — e.g. `http://127.0.0.1:3109`
   - `apiKeyEncrypted` — encrypt `PBX_AGENT_API_KEY` with backend `HELPDESK_ENCRYPTION_KEY`
3. Set `HELPDESK_PBX_URL_ALLOWLIST` if using host allowlist.

AI tools call backend → `HelpdeskPbxAgentService` → this agent.

## Security

- Do **not** expose port 3109 to the public internet without TLS and IP allowlist.
- Never commit `.env` or real API keys.
- Hangup and promised payment are **stubs** until AMI/DB write is implemented.

## Quick test

```bash
export PBX_AGENT_API_KEY=test-key
npm start

curl -s -H "X-Api-Key: test-key" http://127.0.0.1:3109/health
curl -s -H "X-Api-Key: test-key" http://127.0.0.1:3109/api/vpbx-user
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3109/health
# expect 401 without header
```

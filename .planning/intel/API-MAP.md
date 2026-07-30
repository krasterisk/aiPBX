# API-MAP — Frontend ↔ Backend Contract

Last updated: 2026-06-24.  
Base URL: `__API__` (e.g. `https://aipbx.ru/api`). WebSocket: `__WS__` (port 3033).

**Note:** No shared types package. Frontend types in `src/entities/*/model/types/`. Backend DTOs use `@ApiProperty`. Drift risk — see GAP-06.

## Auth

| FE (`usersApi.ts`) | BE (`auth.controller.ts`) | Auth |
|--------------------|-------------------------|------|
| `POST /auth/login` | login | — |
| `POST /auth/signup` | signup | — |
| `POST /auth/google/login` | google login | — |
| `POST /auth/google/signup` | google signup | — |
| `POST /auth/telegram/login` | telegram login | — |
| `POST /auth/telegram/signup` | telegram signup | — |
| `POST /auth/activation` | email activation | — |

## Users

| FE | BE | Auth |
|----|-----|------|
| `GET /users/page` | paginated list | JWT |
| `GET /users` | current user | JWT |
| `GET /users/balance` | balance | JWT |
| `PATCH /users` | update profile | JWT |
| `POST /users` | create | JWT ADMIN |
| `DELETE /users/:id` | delete | JWT |
| `POST /users/updatePassword` | password | JWT |
| `POST /users/avatar` | upload avatar | JWT |
| `GET/PUT /users/limits` | usage limits | JWT |
| `GET /users/tenant-members` | members | JWT |
| `GET/POST /users/sub-user` | sub-users | JWT owner |
| `POST /users/admin/top-up` | manual top-up | JWT ADMIN |

**FE entity:** `entities/User`  
**BE module:** `UsersModule`, `RolesModule`

## Assistants

| FE (`assistantsApi.ts`) | BE | Auth |
|-------------------------|-----|------|
| `GET /assistants/page` | paginated | JWT |
| `GET /assistants` | by id | JWT |
| `GET /assistants/user/:userId` | by user | JWT |
| `POST /assistants` | create | JWT |
| `PATCH /assistants` | update | JWT |
| `DELETE /assistants/:id` | delete | JWT |
| `POST /assistants/generate-prompt` | AI prompt gen | JWT |
| `POST /assistants/:id/tts-voice` | upload TTS | JWT |

**FE:** `entities/Assistants`, `features/Assistants`  
**BE:** `AssistantsModule`, `PlaygroundModule`

## AI Models

| FE (`aiModelApi.ts`) | BE | Auth |
|----------------------|-----|------|
| `GET /aiModels` | list | JWT |
| `POST /aiModels` | create | JWT ADMIN |
| `PATCH /aiModels/:id` | update | JWT ADMIN |
| `DELETE /aiModels/:id` | delete | JWT ADMIN |

**BE:** `AiModelsModule`

## Tools

| FE (`toolsApi.ts`) | BE | Auth |
|--------------------|-----|------|
| `GET /tools/page` | paginated | JWT |
| `GET /tools` | by id | JWT |
| `POST /tools` | create | JWT |
| `PATCH /tools` | update | JWT |
| `DELETE /tools/:id` | delete | JWT |

**BE:** `AiToolsModule`, runtime via `AiToolsHandlersModule`

## MCP

| FE (`mcpApi.ts`) | BE | Auth |
|------------------|-----|------|
| `GET /mcp/servers/page` | paginated | JWT |
| `POST /mcp/servers` | create | JWT |
| `PATCH /mcp/servers/:id` | update | JWT |
| `DELETE /mcp/servers/:id` | delete | JWT |
| `POST /mcp/servers/:id/connect` | connect | JWT |
| `POST /mcp/composio/connect` | Composio OAuth | JWT |
| `POST /mcp/bitrix24/connect` | Bitrix24 | JWT |
| `POST /mcp/telegram/connect` | Telegram | JWT |
| `POST /mcp/servers/:id/sync-tools` | sync tools | JWT |
| `PATCH /mcp/tools/:id/toggle` | enable/disable | JWT |
| `GET/POST/DELETE /mcp/tools/:id/policies` | policies | JWT |

**BE:** `McpClientModule`

## Knowledge Bases

| FE (`knowledgeBaseApi.ts`) | BE | Auth |
|----------------------------|-----|------|
| `GET /knowledge-bases` | list | JWT |
| `POST /knowledge-bases` | create | JWT |
| `PATCH /knowledge-bases/:id` | update | JWT |
| `DELETE /knowledge-bases/:id` | delete | JWT |
| `POST /knowledge-bases/:id/upload` | upload doc | JWT |
| `POST /knowledge-bases/:id/url` | add URL | JWT |
| `DELETE /knowledge-bases/:id/documents/:docId` | delete doc | JWT |

**BE:** `KnowledgeModule`

## Reports & Dashboards

| FE (`reportApi.ts`) | BE | Auth |
|---------------------|-----|------|
| `GET /reports/page` | call list | JWT |
| `GET /reports/dashboard` | overview dashboard | JWT |
| `GET /reports/events` | call events | JWT |
| `GET /reports/dialogs` | transcripts | JWT |
| `DELETE /reports/:id` | delete CDR | JWT |

**BE:** `AiCdrModule`

## AI Analytics

| FE | BE (`ai-analytics.controller.ts`) | Auth |
|----|-----------------------------------|------|
| `GET /ai-analytics/dashboard` | bot analytics | JWT |
| `GET/POST /ai-analytics/:channel` | per-channel metrics | JWT |

**BE:** `AiAnalyticsModule`

## Operator Analytics

| FE (`reportApi.ts` + OperatorAnalytics) | BE | Auth |
|----------------------------------------|-----|------|
| `POST /operator-analytics/upload` | upload audio | JWT |
| `POST /operator-analytics/analyze-file` | analyze file | JWT |
| `POST /operator-analytics/analyze-url` | analyze URL | JWT / oa_ token |
| `GET /operator-analytics/batches` | batch status | JWT |
| `GET/POST/PATCH/DELETE /operator-analytics/projects` | projects | JWT |
| `GET /operator-analytics/dashboard` | project dashboard | JWT |
| `GET /operator-analytics/insights` | AI insights (structured) | JWT |
| `GET/POST/DELETE /operator-analytics/tokens` | API tokens | JWT |
| `GET /operator-analytics/cdrs` | CDR list | JWT |
| `GET /operator-analytics/operator-evidence` | per-operator metric evidence (quotes/rationales) | JWT (ADMIN, USER) |
| `PATCH /operator-analytics/{id}/tags` | manual call tag update | JWT (ADMIN, USER) |

**Query params (phase 10):**

| Route | Param | Purpose |
|-------|-------|---------|
| `GET /operator-analytics/cdrs` | `operatorNameExact` | Exact assistantName match for drill-down call lists |
| `GET /operator-analytics/cdrs` | `tagId` | Filter calls tagged with a project theme |

**BE:** `OperatorAnalyticsModule` — largest API surface

## Billing & Payments

| FE | BE | Auth |
|----|-----|------|
| `GET /billing` | usage records | JWT |
| `GET /payments` | payment history | JWT |
| `POST /payments/create-intent` | Stripe intent | JWT |
| `POST /payments/robokassa/create` | Robokassa redirect | JWT |

**FE:** `entities/Billing`, `entities/Payment`, `features/CheckoutByStripe`, `features/CheckoutByRobokassa`  
**BE:** `BillingModule`, `PaymentsModule`, `PricesModule`

## Organizations (B2B)

| FE (`organizationApi.ts`) | BE | Auth |
|---------------------------|-----|------|
| `GET/POST /organizations` | CRUD | JWT |
| `POST /organizations/:id/invoices` | SBIS invoice | JWT |
| `POST /organizations/:id/invitations` | EDO invite | JWT |
| `GET /organizations/:id/documents` | PDF docs | JWT |

**BE:** `OrganizationsModule`, `AccountingModule` (`/sbis/counterparty`)

## PBX & Telephony

| FE | BE | Auth |
|----|-----|------|
| `GET/POST/PATCH/DELETE /pbx-servers` | PBX CRUD | JWT |
| `POST /pbx-servers/create-sip-uri` | SIP URI | JWT |
| `GET/POST/PUT/DELETE /sip-trunks` | trunks | JWT |
| `GET/POST/PUT/DELETE /widget-keys` | widget keys | JWT |
| `GET/POST /widget/offer, ice-candidate, hangup, config` | WebRTC | public/key |

**FE:** `entities/PbxServers`, `entities/SipTrunks`, `entities/PublishWidgets`, `entities/WidgetKeys`  
**BE:** `PbxServersModule`, `SipTrunksModule`, `WidgetModule`, `WidgetKeysModule`

## Chats (ADMIN)

| FE (`chatApi.ts`) | BE | Auth |
|-------------------|-----|------|
| `GET/POST/PUT/DELETE /chats` | CRUD | JWT / API key |
| `POST /chats/:id/message` | SSE stream | JWT / API key |

**BE:** `ChatModule`

## Our Organizations (ADMIN)

| FE (`ourOrganizationApi.ts`) | BE | Auth |
|------------------------------|-----|------|
| `GET/POST/PATCH/DELETE /our-organizations` | issuer entities | JWT ADMIN |

**BE:** `OurOrganizationsModule`

## Legal

| FE | BE | Auth |
|----|-----|------|
| — | `POST/GET /legal-acceptances` | JWT |

**BE:** `LegalModule`

## API Keys

| FE | BE | Auth |
|----|-----|------|
| — (no UI yet) | `POST/GET/DELETE /api-keys` | JWT |

**BE:** `ApiKeyModule` — docs in `aiPBX_backend/.docs/API_KEYS.md`

## Internal / Ops

| Endpoint | BE | Auth |
|----------|-----|------|
| `POST /whisper/recognize` | WhisperModule | internal |
| `GET /whisper/health` | WhisperModule | — |
| `POST /open-ai` | OpenAiModule | internal |
| `GET /logs/*` | LoggerModule | JWT ADMIN |
| `GET /currency` | CurrencyModule | JWT |
| `GET/POST /prices` | PricesModule | JWT / public |
| `POST /telegram/webhook` | TelegramModule | webhook secret |

## WebSocket Events (port 3033)

| Event (client → server) | Purpose |
|-------------------------|---------|
| `auth` | JWT auth |
| `join` | join room |
| `playground_init` | start playground session |
| `playground_audio` | send audio chunk |
| `playground_stop` | end session |

| Event (server → client) | Purpose |
|-------------------------|---------|
| `playground.event` | playground state (NOT openai.event) |
| `playground.audio_out` | TTS audio back |
| `openai.event` | ARI call events only |

**FE:** `features/PlaygroundSession`  
**BE:** `WsServerModule`

## FE entities without dedicated RTK API file

| Entity | Notes |
|--------|-------|
| `PublishSipUris` | Uses PbxServers API |
| `Filters`, `PeriodPicker` | UI only |
| `LangSwitcher`, `ThemeSwitcher` | UI only |
| `Content`, `ErrorGetData` | UI only |
| `BalanceAlert` | `balanceAlertApi.ts` |

## Contract drift hotspots

| Area | Risk |
|------|------|
| Operator Analytics insights | Recently changed (Phase 1) — types must stay in sync |
| Assistant pipeline fields | non-realtime/OmniVoice fields added incrementally |
| Billing records shape | `frontend_refactoring_prompt.md` — breakdown per response.done |
| `aggregatedCustomMetrics` | Backend endpoint missing — GAP-12 |

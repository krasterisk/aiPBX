# FEATURES — Product Feature Inventory

Last updated: 2026-06-24. Sources: `routeConfig.tsx`, `app.module.ts`, menubar, entities.

## Feature Matrix

### Public (no auth)

| Feature | Route | FE module | BE module | Status |
|---------|-------|-----------|-----------|--------|
| Main landing | `/` | `MainPage` | — | Live |
| About | `/about` | `AboutPage` | — | Live |
| Login / Signup | `/login`, `/signup` | `Auth`, `AuthByUsername` | `AuthModule` | Live |
| In-app docs | `/docs` | `DocsPage` → `public/docs/` | — | Live, screenshots placeholder |
| Legal (6 docs) | `/legal/*` | `LegalPage` | `LegalModule` | Live |
| Public pricing | `/pricing` | `PublicPricingPage` | `PricesModule` | Live |
| Speech Analytics landing | `/speech-analytics` | `SpeechAnalyticsLandingPage` | — | Live, no SEO |
| Voice Assistants landing | `/voice-assistants` | `VoiceAssistantsLandingPage` | — | Live, no SEO |

### Dashboards

| Feature | Route | FE | BE | Status |
|---------|-------|----|----|--------|
| Overview | `/dashboard/overview` | `DashboardOverviewPage` | `AiCdrModule` `/reports/dashboard` | Live |
| AI Analytics | `/dashboard/ai-analytics` | `AIAnalyticsPage` | `AiAnalyticsModule` | Live |
| Call Records (OA) | `/dashboard/call-records` | `OperatorAnalytics` | `OperatorAnalyticsModule` | Live |
| Dashboard Builder | embedded in OA | `OperatorAnalytics` | projects API | Partial — GAP-12, GAP-13 |
| AI Insights | banner in OA | `AiInsightsBanner` | insights endpoint | Live (Phase 1 done) |
| AI Insights Phase 2 | — | — | — | Deferred REQ-11 |

### Calls

| Feature | Route | FE | BE | Status |
|---------|-------|----|----|--------|
| Call history | `/calls` | `CallsPage` | `AiCdrModule` | Live |
| Export Excel | — | `callsExportSheet` | — | Live |
| Batch upload | — | batch UI | OA batch API | Live |
| CSAT | — | `Calls` feature | `AiAnalyticsModule` | Live |

### AI Bots (menubar group)

| Feature | Route | FE entity/feature | BE module | Status |
|---------|-------|-------------------|-----------|--------|
| Assistants CRUD | `/assistants` | `Assistants` | `AssistantsModule` | Live |
| Realtime pipeline | assistant form | `features/Assistants` | `OpenAiModule` + ARI | Live |
| Non-realtime pipeline | assistant form | spec in `.idea` | `NonRealtimeModule` | Live |
| OmniVoice / Gemma4 TTS | assistant form | implemented | `backend-tts-walkthrough` | Live |
| Custom TTS voice upload | assistant form | — | `POST /assistants/:id/tts-voice` | Live |
| Playground | `/playground` | `PlaygroundSession` | `PlaygroundModule` + WS | Live |
| Tools | `/tools` | `Tools` | `AiToolsModule` + handlers | Live |
| MCP Servers | `/mcp-servers` | `Mcp` | `McpClientModule` | Live |
| Composio OAuth | MCP UI | `Mcp` | `/mcp/composio/*` | Live |
| Bitrix24 connector | MCP UI | — | `/mcp/bitrix24/connect` | Live |
| Telegram MCP | MCP UI | — | `/mcp/telegram/connect` | Live |
| Knowledge Bases | `/knowledge-bases` | `KnowledgeBases` | `KnowledgeModule` (pgvector) | Live |
| Publish SIP URIs | `/publish/sip-uris` | `PublishSipUris` | `PbxServersModule` | Live |
| SIP Trunks | `/publish/sip-trunks` | `SipTrunks` | `SipTrunksModule` | Live |
| WebRTC Widget | `/publish/widgets` | `PublishWidgets` | `WidgetModule` + `WidgetKeysModule` | Live, GAP-20 |
| Interrupt response (VAD) | — | spec | — | GAP-21 |

### Analytics (menubar)

| Feature | Route | FE | BE | Status |
|---------|-------|----|----|--------|
| OA Projects | `/analytics/projects` | `OperatorAnalytics` | OA projects API | Live |
| OA API tokens | `/analytics/api` | `AnalyticsApiPage` | `oa_xxx` tokens | Live |
| Public API docs | — | `.idea/public_api_docs` | upload/analyze-url | Live |

### Billing (menubar)

| Feature | Route | FE | BE | Status |
|---------|-------|----|----|--------|
| Balance & history | `/payment` | `PaymentPage`, `UsageLimits` | `BillingModule` | Live |
| Stripe checkout | — | `CheckoutByStripe` | `PaymentsModule` | aipbx.net/.org |
| Robokassa | `/billing` | `CheckoutByRobokassa` | Robokassa endpoints | aipbx.ru |
| Organizations | payment page | `CreateOrganization` | `OrganizationsModule` | Live |
| Issue invoice (SBIS) | — | `IssueInvoice` | `AccountingModule` | Live RU B2B |
| Balance alerts | — | `BalanceAlert` | runway cron | Live |
| Usage in reports table | — | GAP-17 | `GET /billing` | Not done |

### Users (owner)

| Feature | Route | FE | BE | Status |
|---------|-------|----|----|--------|
| Sub-users CRUD | `/users` | `Users` | `UsersModule` | Live |
| Onboarding wizard | first login | `Onboarding` | — | Live, GAP-10 |

### Admin only

| Feature | Route | FE | BE | Status |
|---------|-------|----|----|--------|
| Admin panel | `/admin` | `AdminPage` | — | Stub GAP-25 |
| AI Models | `/models` | — | `AiModelsModule` | Live |
| Prices | `/prices` | — | `PricesModule` | Live |
| Our Organizations | `/our-organizations` | `OurOrganization` | `OurOrganizationsModule` | Live |
| PBX Servers | `/pbx-servers` | `PbxServers` | `PbxServersModule` | Live |
| AI Chats (helpdesk) | `/chats` | — | `ChatModule` (SSE) | Live |
| Admin top-up | — | `AdminTopUp` | `/users/admin/top-up` | Live |
| API Keys | — | — | `ApiKeyModule` | BE only, `.docs/API_KEYS.md` |
| Logs viewer | — | — | `LoggerModule` | BE only |

### Platform services (no dedicated page)

| Feature | BE module | Status |
|---------|-----------|--------|
| JWT auth (14d) | `AuthModule` | Live |
| Google / Telegram OAuth | `AuthModule` | Live |
| Multi-tenant (vpbxUserId) | guards + `shared/tenant` | Live |
| Currency FX rates | `CurrencyModule` | Live, daily cron |
| Telegram bot notifications | `TelegramModule` | Live |
| Email (activation, runway) | `MailerModule` | Live |
| File uploads (avatar, TTS) | `FilesModule` | Live |
| Whisper STT proxy | `WhisperModule` | Live, GPU |
| Static files | `/static` | Live |

### Disabled / orphan

| Module | Status | Notes |
|--------|--------|-------|
| `AmiModule` | Disabled | Commented in `app.module.ts` |
| `VoskServerModule` | Disabled | Alternative STT |
| `VpbxUsersModule` | Orphan | Not wired to app |

## Menubar Navigation (authenticated)

```
Дашборды → Overview | AI Analytics | Call Records
Звонки
AI Боты → Assistants | Playground | Tools | MCP | Knowledge Bases | Publish (SIP/Trunks/Widgets)
Аналитика → Projects | API
Оплата
Пользователи (owner)
Управление (ADMIN) → Users | Models | Prices | Our Orgs | PBXs | Chats
```

## i18n

Locales: en, ru, de, zh. User docs: ru + en in `public/docs/`.

## Version info

- Frontend: 3.5.3 (`package.json`)
- Backend: 2.3.3 (`package.json`)

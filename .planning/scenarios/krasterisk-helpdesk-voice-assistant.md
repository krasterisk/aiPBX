# Krasterisk Helpdesk — голосовой и чат-ассистент (setup guide)

**Статус:** Complete (Phase 7, plan 07-04)  
**Аудитория:** основатель / ops, настраивающий линию поддержки Krasterisk в aiPBX  
**Связанный код:** `aiPBX_backend` HelpdeskModule, `scripts/pbx-remote-handler/`

> Это **отдельный сценарий развёртывания**, не часть исходников NestJS.  
> Продакшен-деплой PBX/телефонии здесь не описан — только конфигурация ассистента и интеграций.

---

## 1. Prerequisites

| Требование | Где настроить |
|------------|---------------|
| HelpdeskModule задеплоен (миграции MySQL/Postgres применены) | `aiPBX_backend` |
| `ALFAWEBHOOK_BASE_URL` — поиск клиентов `GET /api/clients` | `.env` backend |
| API-ключ со scope **`helpdesk:tools`** | aiPBX → Настройки → API Keys |
| Ассистент (voice) на SIP/DID Krasterisk | aiPBX → Ассистенты |
| Для on-prem клиентов: `pbx-remote-handler` на стороне PBX | `scripts/pbx-remote-handler/` |
| Строка в `helpdesk_pbx_connections` (url + зашифрованный apiKey) | admin SQL / будущий UI |
| Получатели уведомлений (email / Telegram chat ID) | `PATCH /helpdesk/settings` (admin) |
| `HELPDESK_ENCRYPTION_KEY`, `FRONTEND_URL` | `.env` backend |

**Секреты в документе — только плейсхолдеры.** Реальные ключи создавайте в UI и не коммитьте.

---

## 2. Assistant system prompt (голос, RU)

Шаблон system prompt для голосового ассистента Krasterisk:

```text
Ты — первая линия поддержки компании Krasterisk (облачная АТС и голосовые роботы aiPBX).

Приветствие (D-22): «Добрый день, компания Krasterisk, меня зовут Алексей. Чем могу помочь?»

Правила:
1. В начале каждого звонка создай заявку helpdesk_create_ticket (status new, source ai_voice).
2. Спроси: «Контактный номер, с которого вы звоните, или другой?» (D-04)
   — callerPhone = оригинальный Caller ID;
   — contactPhone = альтернативный, если клиент назвал другой.
3. Идентифицируй клиента: helpdesk_identify_client (сначала по телефону, затем ИНН/название).
4. Если клиент не найден (D-03) — всё равно создай/веди заявку с clientName из разговора.
5. Для известного клиента: helpdesk_get_llm_context и helpdesk_get_client_info.
6. Диагностика: при необходимости PBX-инструменты (баланс, SIP, обещанный платёж).
7. При blocked=1 — предложи обещанный платёж 2 дня (до 5 по просьбе клиента) (D-06–D-08).
8. Обновляй заявку через helpdesk_add_message; при решении — закрой (resolved/closed).
9. Нецелевые звонки — category spam или заметка в description (D-29).
10. Перевод на человека — transfer_call (D-24), если клиент просит оператора или бот не справляется.
11. Продажи/тарифы — knowledge_base «Krasterisk Sales» (D-31).

Не озвучивай внутренние ID заявок клиенту без необходимости. Не называй API-ключи.
```

---

## 3. AiTools — таблица инструментов

| Инструмент | handler / тип | Когда вызывать |
|------------|---------------|----------------|
| Идентификация | `helpdesk_identify_client` (built-in) | После приветствия, по phone/inn/name |
| Контекст LLM | `helpdesk_get_llm_context` | После идентификации, перед диагностикой |
| Инфо о клиенте | `helpdesk_get_client_info` | Уточнение баланса, pbxUrl, licNum |
| Создать заявку | `helpdesk_create_ticket` | **В начале звонка** (D-23), assigneeId=null |
| Сообщение в заявку | `helpdesk_add_message` | Ход диалога, итог диагностики |
| VPBX user | `helpdesk_pbx_get_vpbx_user` | Баланс, debitingday, blocked |
| SIP-регистрации | `helpdesk_pbx_list_sip_registrations` | «Не регистрируется телефон» |
| Обещанный платёж | `helpdesk_pbx_promised_payment` | blocked=1, days 2–5 |
| Завершить канал | `helpdesk_pbx_hangup_channel` | Только с `confirm: true` (D-13) |
| База знаний | `knowledge_base` + `knowledgeBaseIds` | Тарифы, продукты, aiPBX |
| Перевод на оператора | `transfer_call` (существующий tool) | Запрос человека (D-24) |

**REST-эндпоинты** (для webhook-инструментов, если не built-in): `POST /helpdesk/tools/*` с заголовком `Authorization: Bearer <API_KEY>` и scope `helpdesk:tools`.

Пример `toolData` для built-in handler в aiPBX:

```json
{ "handler": "helpdesk_create_ticket" }
```

---

## 4. Call flow (текстовая диаграмма)

```
[Входящий звонок]
       │
       ▼
[Greeting D-22] ──► helpdesk_create_ticket (new, unassigned)
       │
       ▼
[Уточнить телефон D-04] ──► callerPhone + contactPhone
       │
       ▼
helpdesk_identify_client(phone → inn → name)
       │
       ├─► Найден ──► get_client_info + get_llm_context
       │                    │
       │                    ▼
       │              [Диагностика / KB / PBX tools]
       │                    │
       │         ├─► Решено ──► add_message + status resolved/closed
       │         ├─► Не решено ──► transfer_call (D-24)
       │         └─► blocked=1 ──► promised_payment (2–5 дней)
       │
       └─► Не найден (D-03) ──► заявка с clientName, диагностика по симптомам
                                    │
                                    └─► transfer_call при запросе человека
```

**Уведомления (D-32):** при создании заявки с `assigneeId = null` операторы получают email/Telegram (если настроено в `helpdesk_settings`).

---

## 5. Ticket lifecycle (D-23, D-25, D-29)

| Этап | Действие |
|------|----------|
| Старт звонка | `helpdesk_create_ticket`, status `new`, transcript по мере разговора |
| Диагностика | `helpdesk_add_message` (role user/assistant) |
| В работе | Оператор claim в `/admin/helpdesk` или бот → `in_progress` |
| Ожидание клиента | `waiting_client` |
| Решено | `resolved` + финальное сообщение |
| Закрыто | `closed` |
| Спам / нецелевой | category `spam` или пометка в description (D-29) |

Полный транскрипт сохраняйте в поле `transcript` при завершении звонка (D-25).

---

## 6. Chat bot variant (D-26)

Те же built-in handlers `helpdesk_*` и `knowledge_base`, другой prompt:

- Файл: скопируйте раздел 2, уберите голосовые формулировки, добавьте краткость для чата.
- `source`: `ai_chat` в `helpdesk_create_ticket`.
- `transfer_call` не используется — предложите callback или ссылку на `/admin/helpdesk` для оператора.

---

## 7. Krasterisk Sales Knowledge Base (D-31)

1. aiPBX → **Knowledge Bases** → создать базу **«Krasterisk Sales»**.
2. Загрузить документы: тарифы, описание облачной АТС, голосовой робот aiPBX, сравнение с конкурентами, FAQ по подключению.
3. В ассистенте добавить tool с `toolData`:

```json
{
  "handler": "knowledge_base",
  "knowledgeBaseIds": [<ID_базы_Krasterisk_Sales>]
}
```

4. Подключить tool к **голосовому** и **чат** ассистенту.

---

## 8. Promised payment script (D-06–D-08)

Когда `helpdesk_pbx_get_vpbx_user` возвращает `blocked: 1`:

```text
Сейчас исходящая связь ограничена из‑за недостатка средств на лицевом счёте.
Могу оформить обещанный платёж на 2 дня — это разблокирует исходящие.
Если нужно больше времени, максимум 5 дней. Оформить?
```

При согласии: `helpdesk_pbx_promised_payment` с `days` (2–5).  
`blocked=1` блокирует **исходящие**; входящие работают (D-06).  
Упоминайте `debitingday` только в контексте списания/биллинга (D-07).

---

## 9. pbx-remote-handler (on-prem / per-client PBX)

Для клиентов без облачного `pbxUrl` разверните агент на стороне PBX:

```bash
cd scripts/pbx-remote-handler
cp .env.example .env   # задать PBX_AGENT_API_KEY
npm install
npm start
```

В `helpdesk_pbx_connections` укажите `url` агента (например `http://127.0.0.1:3109`) и зашифрованный ключ.  
Backend проксирует: `GET /api/vpbx-user`, `GET /api/sip-registrations`, `POST /api/promised-payment`, `POST /api/hangup-channel`.

Подробности: `scripts/pbx-remote-handler/README.md`.

---

## 10. Manual test checklist

1. [ ] Создать API-ключ со scope `helpdesk:tools` (плейсхолдер `aipbx_***`).
2. [ ] Настроить ассистента: system prompt (раздел 2) + built-in helpdesk tools.
3. [ ] Подключить KB «Krasterisk Sales» (`knowledge_base`).
4. [ ] Тестовый звонок → заявка создана, status `new`, assigneeId null.
5. [ ] `identify_client` по номеру находит клиента в alfawebhook.
6. [ ] `get_llm_context` возвращает markdown после привязки клиента.
7. [ ] Уведомление email/TG при новой неназначенной заявке (если settings заполнены).
8. [ ] `transfer_call` на номер оператора из prompt.
9. [ ] `promised_payment` при blocked=1 (stub или реальный агент).
10. [ ] Закрытие заявки: сообщения + status `resolved`/`closed`; транскрипт в ticket.

---

## 11. Cloud vs on-prem

| Тип клиента | Идентификация | Диагностика |
|-------------|---------------|-------------|
| Cloud (`pbxUrl` в alfawebhook) | phone → alfawebhook | PBX tools через облачный agent URL |
| On-prem | phone / inn | `pbx-remote-handler` на стороне клиента, запись в `helpdesk_pbx_connections` |

---

## Ссылки

- Контекст фазы: `.planning/phases/07-helpdesk-admin-ticket-system-with-ai-intake-alfawebhook-clie/07-CONTEXT.md`
- Admin UI: `/admin/helpdesk`
- API tools: `POST /helpdesk/tools/*`

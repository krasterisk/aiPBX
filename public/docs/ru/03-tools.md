# Функции (Tools) — подключение внешних систем

> Функции позволяют ассистенту **выполнять реальные действия** во время разговора: записывать клиента в базу, проверять статус заказа, отправлять уведомления, переводить звонок. Без функций ассистент может только разговаривать — с функциями он становится полноценным оператором.

---

## Содержание

1. [Что такое функции и зачем они нужны?](#что-такое-функции-и-зачем-они-нужны)
2. [Типы функций](#типы-функций)
3. [Создание функции](#создание-функции)
4. [Форма настройки — полный обзор](#форма-настройки-полный-обзор)
5. [JSON-схема параметров](#json-схема-параметров)
6. [Аутентификация](#аутентификация)
7. [Встроенные функции (hangup, transfer)](#встроенные-функции)
8. [Примеры Function Calling](#примеры-function-calling)
9. [Привязка функций к ассистенту](#привязка-функций-к-ассистенту)

---

## Что такое функции и зачем они нужны?

Представьте: клиент звонит в пиццерию и говорит: «Хочу Маргариту 30 см на адрес Ленина 5». 

**Ассистент без функций:** «Хорошо, ваш заказ принят!» — но на самом деле ничего не произошло. Заказ не создан. Курьер ничего не знает.

**Ассистент с функциями:** «Хорошо, ваш заказ принят!» — и одновременно вызывает функцию `create_order`, которая:
- Создаёт заказ в вашей CRM
- Отправляет уведомление курьеру в Telegram
- Обновляет статус на сайте

### Типичные сценарии использования

| Действие | Функция | Что делает |
|----------|---------|-----------| 
| Записать на приём | `book_appointment` | Создаёт запись в Google Calendar или CRM |
| Проверить заказ | `check_order_status` | Обращается к вашей базе данных и возвращает статус |
| Отправить уведомление | `send_notification` | Шлёт сообщение в Telegram, email, SMS |
| Узнать расписание | `check_schedule` | Проверяет свободные слоты в календаре |
| Создать тикет | `create_ticket` | Регистрирует обращение в системе поддержки |
| Завершить звонок | `hangup_call` | Корректно завершает телефонный разговор |
| Перевести звонок | `transfer_call` | Переводит на оператора или другой номер |

---

## Типы функций

AI PBX поддерживает три типа функций:

### 1. Function (Webhook)

Самый распространённый тип. Ассистент вызывает ваш HTTP-сервер (webhook) с данными, собранными в разговоре.

**Поток:** Клиент говорит → ИИ понимает → Вызывает ваш API → Получает ответ → Говорит клиенту

**Когда использовать:** У вас есть свой сервер / API / CRM с поддержкой HTTP/REST.

**Пример:**

```text
Ассистент спросил имя и телефон →
  → POST https://ваш-сервер.com/api/book
  → { "name": "Иванов", "phone": "+79001234567", "date": "2026-03-15" }
  → Ответ: { "status": "ok", "message": "Записан на 15 марта" }
  → Ассистент: «Вы записаны на 15 марта!»
```

### 2. MCP (Model Context Protocol)

Подключение через MCP-протокол. MCP сервер предоставляет набор инструментов, которые ассистент может вызывать.

**Когда использовать:** Интеграция с готовыми MCP серверами (Composio, собственные MCP серверы).

Подробнее — в разделе [MCP Серверы](./04-mcp-servers.md).

### 3. Встроенные (Built-in)

Системные функции самой платформы: завершение звонка, перевод звонка. Не требуют настройки webhook.

---

## Создание функции

### Страница «Функции»

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Функции</div>
  <div class="form-mockup-list-item">
    <span class="item-name">book_appointment</span>
    <span class="form-mockup-badge badge-info">function</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">Записывает клиента на приём</div>
  </div>
  <div class="form-mockup-list-item">
    <span class="item-name">check_order_status</span>
    <span class="form-mockup-badge badge-info">function</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">Проверяет статус заказа</div>
  </div>
  <div class="form-mockup-list-item">
    <span class="item-name">send_telegram_notification</span>
    <span class="form-mockup-badge badge-success">mcp</span>
  </div>
  <div class="form-mockup-card">
    <div class="card-desc">Отправляет уведомление в Telegram</div>
  </div>
</div>

Нажмите **＋** для создания новой функции.

---

## Форма настройки — полный обзор

Форма функции разделена на **две колонки**: основные настройки (левая) и определение параметров (правая).

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Создать функцию</div>
  <div class="form-mockup-row" style="align-items: flex-start;">
    <div style="flex: 1;">
      <div class="form-mockup-section-title">Основные настройки</div>
      <div class="form-mockup-field" data-required>
        <label>Наименование</label>
        <div class="form-mockup-input">book_appointment</div>
      </div>
      <div class="form-mockup-field" data-required>
        <label>Тип</label>
        <div class="form-mockup-select">function ▾</div>
      </div>
      <div class="form-mockup-field" data-required>
        <label>Описание</label>
        <div class="form-mockup-textarea" style="min-height: 70px;">Записывает клиента на приём. Вызывается после сбора всей информации.</div>
      </div>
      <div class="form-mockup-field" data-required>
        <label>URL (адрес webhook)</label>
        <div class="form-mockup-input">https://api.example.com/book</div>
      </div>
      <div class="form-mockup-field" data-required>
        <label>Метод</label>
        <div class="form-mockup-select">POST ▾</div>
      </div>
      <div class="form-mockup-field">
        <label>Аутентификация</label>
        <div class="form-mockup-select">Bearer Token ▾</div>
      </div>
      <div class="form-mockup-field">
        <label>API Key</label>
        <div class="form-mockup-input">sk-xxxxxxxxxxxxxxxx</div>
      </div>
    </div>
    <div style="flex: 1;">
      <div class="form-mockup-section-title">Определение функции</div>
      <div class="form-mockup-field">
        <label>Параметры (JSON Schema)</label>
        <div class="form-mockup-textarea" style="min-height: 200px;">{
  "type": "object",
  "properties": {
    "client_name": {
      "type": "string",
      "description": "ФИО клиента"
    },
    "phone": {
      "type": "string"
    }
  },
  "required": ["client_name", "phone"]
}</div>
      </div>
      <div class="form-mockup-toggle active">
        <div class="toggle-track"><div class="toggle-thumb"></div></div>
        <span class="toggle-label">Strict mode</span>
      </div>
    </div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Сохранить</div>
    <div class="form-mockup-btn form-mockup-btn-secondary">Отмена</div>
  </div>
</div>

### Поля основной карточки

| Поле | Обязательное | Описание |
|------|-------------|----------|
| **Наименование** | Да | Техническое имя функции (латиница, без пробелов). Именно это имя ИИ будет вызывать. Используйте формат `snake_case`. Примеры: `book_appointment`, `check_status` |
| **Тип** | Да | `function` — webhook, `mcp` — MCP-протокол |
| **Описание** | Да | Текстовое описание для ИИ: **когда** и **зачем** вызывать функцию. ИИ читает это описание, чтобы решить, нужна ли функция в данный момент разговора. Чем точнее описание — тем правильнее ИИ вызывает функцию |
| **URL** | Да (для function) | Адрес вашего webhook/API, куда ассистент отправит HTTP-запрос |
| **Метод** | Да (для function) | HTTP-метод: GET, POST, PUT, DELETE. Обычно POST |
| **Аутентификация** | Нет | Тип авторизации при обращении к вашему серверу |
| **API Key** | Нет | Токен или ключ для аутентификации (при Bearer/Basic) |

### Определение функции (правая карточка)

| Поле | Описание |
|------|----------|
| **Параметры (JSON Schema)** | JSON-описание параметров, которые ИИ должен собрать в разговоре. Использует стандарт JSON Schema |
| **Strict mode** | Если включено — ИИ обязан передать ВСЕ обязательные параметры. Если выключено — может вызвать функцию с частичными данными |

---

## JSON-схема параметров

Параметры описываются в формате **JSON Schema**. Это стандартный способ описать «что функция ожидает на вход».

### Структура

```json
{
  "type": "object",
  "properties": {
    "имя_параметра": {
      "type": "тип_данных",
      "description": "Описание для ИИ — что это за параметр"
    }
  },
  "required": ["список", "обязательных", "параметров"]
}
```

### Типы данных

| Тип | Описание | Пример |
|-----|---------|--------|
| `string` | Текст | Имя, адрес, email |
| `number` | Число (с дробной частью) | Цена, координата |
| `integer` | Целое число | Количество, возраст |
| `boolean` | Да/Нет | Доставка: true/false |
| `array` | Список значений | Список позиций заказа |
| `object` | Вложенный объект | Адрес {улица, дом, кв} |

### Ограничение выбора (enum)

Можно указать точный список допустимых значений:

```json
{
  "priority": {
    "type": "string",
    "enum": ["low", "medium", "high", "critical"],
    "description": "Приоритет обращения"
  }
}
```

ИИ не придумает своё значение — выберет только из списка.

---

## Аутентификация

Ваш сервер может требовать авторизацию. AI PBX поддерживает три типа:

### 1. Без аутентификации

Ваш webhook доступен без ключа. Подходит для внутренних серверов или тестирования.

### 2. Bearer Token

Самый распространённый вариант. При каждом вызове в заголовок добавляется:

```text
Authorization: Bearer sk-ваш-секретный-ключ
```

### 3. Basic Auth

Используется реже. Добавляет заголовок:

```text
Authorization: Basic base64(username:password)
```

> Важно: Храните ключи в безопасности. Если ключ скомпрометирован — сгенерируйте новый.

---

## Встроенные функции

AI PBX предоставляет две системных функции, которые **не требуют настройки webhook** — они работают «из коробки» при подключении через Asterisk (SIP):

### hangup_call — Завершение звонка

Ассистент вызывает эту функцию, когда диалог завершён. Звонок корректно завершается на стороне АТС.

```json
{
  "name": "hangup_call",
  "description": "Завершает текущий телефонный звонок"
}
```

**Как использовать в промпте:**

```text
Когда разговор подошёл к концу и клиент попрощался,
вызови функцию hangup_call для завершения звонка.
```

> Примечание: Работает только через SIP (Asterisk). Для WebRTC виджетов клиент сам закрывает окно.

### transfer_call — Перевод звонка

Переводит текущий звонок на другой номер или внутренний extension.

```json
{
  "name": "transfer_call",
  "description": "Переводит звонок на указанный номер",
  "parameters": {
    "type": "object",
    "properties": {
      "extension": {
        "type": "string",
        "description": "Номер или extension для перевода"
      },
      "context": {
        "type": "string",
        "description": "Контекст диалплана Asterisk"
      }
    },
    "required": ["extension"]
  }
}
```

**Как использовать в промпте:**

```text
Если клиент хочет поговорить с живым оператором,
вызови transfer_call с extension "100" для перевода на менеджера.
```

> Совет: Вы можете настроить ассистента так, чтобы он переводил звонки на разные номера в зависимости от темы: техподдержка → 101, продажи → 102, бухгалтерия → 103.

---

## Примеры Function Calling

### Пример 1: Запись на приём

**Сценарий:** Клиника хочет, чтобы ассистент записывал пациентов.

```json
{
  "name": "book_appointment",
  "description": "Записывает клиента на приём. Вызывается после сбора всей необходимой информации.",
  "strict": true,
  "parameters": {
    "type": "object",
    "properties": {
      "client_name": {
        "type": "string",
        "description": "ФИО клиента"
      },
      "phone": {
        "type": "string",
        "description": "Номер телефона клиента"
      },
      "date": {
        "type": "string",
        "description": "Дата приёма в формате YYYY-MM-DD"
      },
      "time": {
        "type": "string",
        "description": "Время приёма в формате HH:MM"
      },
      "service_type": {
        "type": "string",
        "description": "Тип услуги: осмотр, консультация, процедура"
      }
    },
    "required": ["client_name", "phone", "date", "time"]
  }
}
```

**Как это работает в диалоге:**

```text
Ассистент: Здравствуйте! Стоматология «Дентал Плюс». Чем могу помочь?
Клиент:    Хочу записаться к стоматологу.
Ассистент: Конечно! Как вас зовут?
Клиент:    Иванов Пётр Сергеевич.
Ассистент: Отлично, Пётр Сергеевич! На какое число хотите записаться?
Клиент:    На пятницу.
Ассистент: Хорошо. Есть свободные слоты в 10:00 и 14:30. Какое время удобнее?
Клиент:    В 14:30.
           ↓
     [ИИ вызывает book_appointment]
     { "client_name": "Иванов Пётр Сергеевич",
       "phone": "+79001234567",
       "date": "2026-03-21",
       "time": "14:30",
       "service_type": "осмотр" }
           ↓
     [Ваш сервер подтверждает запись]
           ↓
Ассистент: Вы записаны на 21 марта в 14:30. Не забудьте паспорт и полис!
```

### Пример 2: Проверка статуса заказа

```json
{
  "name": "check_order_status",
  "description": "Проверяет статус заказа по его номеру. Используй, когда клиент спрашивает о своём заказе.",
  "strict": false,
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "Номер заказа (например, ORD-12345)"
      }
    },
    "required": ["order_id"]
  }
}
```

### Пример 3: Создание тикета в поддержке

```json
{
  "name": "create_ticket",
  "description": "Создаёт тикет в службе поддержки. Вызывай, если не можешь решить проблему самостоятельно.",
  "strict": true,
  "parameters": {
    "type": "object",
    "properties": {
      "user_email": {
        "type": "string",
        "description": "Email пользователя для связи"
      },
      "subject": {
        "type": "string",
        "description": "Краткое описание проблемы"
      },
      "description": {
        "type": "string",
        "description": "Подробное описание проблемы"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "medium", "high", "critical"],
        "description": "Приоритет тикета"
      }
    },
    "required": ["user_email", "subject", "description"]
  }
}
```

---

## Привязка функций к ассистенту

Созданные функции нужно **привязать к ассистенту**. Без привязки ассистент не знает о существовании функций.

### Как привязать:

1. Откройте нужного ассистента
2. В карточке **Основные настройки** найдите поле **«Функции»**
3. Начните вводить имя функции — появится выпадающий список
4. Выберите нужные функции
5. Сохраните ассистента

<div class="form-mockup">
  <div class="form-mockup-title">Привязка функций</div>
  <div class="form-mockup-field">
    <label>Функции</label>
    <div class="form-mockup-chips">
      <span class="form-mockup-chip selected">book_appointment ✕</span>
      <span class="form-mockup-chip selected">check_schedule ✕</span>
      <span class="form-mockup-chip selected">send_notification ✕</span>
    </div>
    <div class="form-mockup-input">Начните вводить...</div>
  </div>
</div>

> Совет: Не забудьте упомянуть привязанные функции в промпте ассистента! Например: «Используй функцию book_appointment, чтобы записать клиента». Это помогает ИИ понимать, когда и зачем вызывать функцию.

### Сколько функций можно подключить?

Ограничений нет, но рекомендуется:
- **3–7 функций** — оптимально. ИИ хорошо справляется с выбором
- **8–15 функций** — работает, но требует тщательного описания каждой функции
- **Больше 15** — может снижать точность выбора. Рассмотрите разделение на нескольких ассистентов

---

*Предыдущий раздел: [Ассистенты](./02-assistants.md) · Следующий раздел: [MCP Серверы →](./04-mcp-servers.md)*

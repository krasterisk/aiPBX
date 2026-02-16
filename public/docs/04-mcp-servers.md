# MCP Серверы — интеграции с внешними сервисами

> MCP (Model Context Protocol) Серверы позволяют ассистенту взаимодействовать с **сотнями внешних сервисов** — Gmail, Google Calendar, Telegram, Bitrix24, Slack, Notion и многими другими. Подключите сервис один раз, и ассистент сможет использовать его инструменты в разговоре.

---

## Содержание

1. [Что такое MCP?](#что-такое-mcp)
2. [Галерея интеграций (Composio)](#галерея-интеграций-composio)
3. [Подключение MCP сервера](#подключение-mcp-сервера)
4. [Форма настройки MCP сервера](#форма-настройки-mcp-сервера)
5. [Управление инструментами](#управление-инструментами)
6. [Собственный MCP сервер](#собственный-mcp-сервер)
7. [Привязка к ассистенту](#привязка-к-ассистенту)

---

## Что такое MCP?

**MCP (Model Context Protocol)** — это открытый стандарт, который позволяет ИИ подключаться к внешним сервисам через единый протокол. Думайте об MCP как о «USB для ИИ» — универсальный разъём, через который можно подключить любой инструмент.

### Как это работает?

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Архитектура MCP</div>
  <div class="form-mockup-row" style="justify-content: center; text-align: center;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Ассистент</div>
      <div class="card-desc">AI PBX</div>
    </div>
    <div style="display: flex; align-items: center; padding: 0 8px; color: var(--hint-redesigned); font-size: 20px;">→</div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">MCP Сервер</div>
      <div class="card-desc">Посредник</div>
    </div>
    <div style="display: flex; align-items: center; padding: 0 8px; color: var(--hint-redesigned); font-size: 20px;">→</div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Сервисы</div>
      <div class="card-desc">Gmail, Calendar, Telegram...</div>
    </div>
  </div>
</div>

**Без MCP:** Вам нужно для каждого сервиса писать свой webhook, разбираться с API, обрабатывать ответы.

**С MCP:** Подключаете готовый MCP сервер, и ассистент сразу получает набор инструментов — отправить письмо, создать событие, написать в чат.

---

## Галерея интеграций (Composio)

AI PBX интегрируется с **Composio** — платформой, которая предоставляет готовые MCP серверы для 250+ сервисов.

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">MCP Серверы — Галерея</div>
  <div class="form-mockup-chips">
    <span class="form-mockup-chip selected">Gmail — Connected</span>
    <span class="form-mockup-chip">Google Calendar</span>
    <span class="form-mockup-chip">Google Sheets</span>
    <span class="form-mockup-chip">Slack</span>
    <span class="form-mockup-chip">Notion</span>
    <span class="form-mockup-chip">Bitrix24</span>
    <span class="form-mockup-chip selected">Telegram — Connected</span>
    <span class="form-mockup-chip">WhatsApp</span>
    <span class="form-mockup-chip">Outlook</span>
  </div>
  <p style="text-align: center; font-size: 13px; color: var(--hint-redesigned); margin-top: 12px;">... и 250+ других сервисов</p>
</div>

### Процесс подключения через Composio

1. **Выберите сервис** из галереи (например, Gmail)
2. **Нажмите «Подключить»** — откроется окно авторизации сервиса
3. **Авторизуйтесь** в сервисе (Google просит войти и дать разрешения)
4. **Готово!** — MCP сервер создан. Его инструменты сразу доступны ассистенту

<div class="form-mockup">
  <div class="form-mockup-title">Подключение Gmail</div>
  <div class="form-mockup-card">
    <div class="card-title">Google хочет убедиться, что это вы</div>
    <div class="card-desc">
      your@gmail.com<br><br>
      AI PBX хочет получить доступ к:<br>
      ✅ Читать почту<br>
      ✅ Отправлять письма<br>
      ✅ Управлять ярлыками
    </div>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-secondary">Отмена</div>
    <div class="form-mockup-btn form-mockup-btn-primary">Разрешить</div>
  </div>
</div>

---

## Подключение MCP сервера

### Два способа создания

1. **Из галереи Composio** — выбрать готовый сервис (Gmail, Slack, etc.)
2. **Вручную** — указать адрес собственного MCP сервера

### Создание вручную

Нажмите **«Мои серверы» → ＋** для создания нового MCP сервера.

---

## Форма настройки MCP сервера

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">MCP Сервер — настройка</div>
  <div class="form-mockup-row" style="align-items: flex-start;">
    <div style="flex: 1;">
      <div class="form-mockup-section-title">Основные настройки</div>
      <div class="form-mockup-field" data-required>
        <label>Наименование</label>
        <div class="form-mockup-input">Мой Telegram бот</div>
      </div>
      <div class="form-mockup-field">
        <label>Описание</label>
        <div class="form-mockup-textarea" style="min-height: 60px;">Отправляет уведомления о новых заявках</div>
      </div>
    </div>
    <div style="flex: 1;">
      <div class="form-mockup-section-title">Подключение</div>
      <div class="form-mockup-field" data-required>
        <label>Адрес сервера (SSE URL)</label>
        <div class="form-mockup-input">https://mcp.example.com/sse</div>
      </div>
      <div class="form-mockup-field">
        <label>Тип аутентификации</label>
        <div class="form-mockup-select">Bearer Token ▾</div>
      </div>
      <div class="form-mockup-field">
        <label>API Key / Token</label>
        <div class="form-mockup-input">sk-xxxxxxxxxxxxx</div>
      </div>
      <div class="form-mockup-field">
        <label>Chat ID (для Telegram)</label>
        <div class="form-mockup-input">123456789</div>
      </div>
      <div class="form-mockup-actions" style="border: none;">
        <div class="form-mockup-btn form-mockup-btn-primary">Подключиться</div>
      </div>
      <div class="form-mockup-list-item">
        <span class="item-name">Статус</span>
        <span class="form-mockup-badge badge-success">Подключено</span>
      </div>
    </div>
  </div>
  <div class="form-mockup-divider"></div>
  <div class="form-mockup-section-title">Инструменты</div>
  <div class="form-mockup-toggle active">
    <div class="toggle-track"><div class="toggle-thumb"></div></div>
    <span class="toggle-label">send_message — Отправить сообщение в Telegram</span>
  </div>
  <div class="form-mockup-toggle active">
    <div class="toggle-track"><div class="toggle-thumb"></div></div>
    <span class="toggle-label">get_updates — Получить новые сообщения</span>
  </div>
  <div class="form-mockup-toggle">
    <div class="toggle-track"><div class="toggle-thumb"></div></div>
    <span class="toggle-label">edit_message — Редактировать отправленное сообщение</span>
  </div>
  <div class="form-mockup-toggle">
    <div class="toggle-track"><div class="toggle-thumb"></div></div>
    <span class="toggle-label">send_photo — Отправить фото</span>
  </div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-secondary">Синхронизировать инструменты</div>
    <div class="form-mockup-btn form-mockup-btn-primary">Сохранить</div>
  </div>
</div>

### Поля формы

| Поле | Описание |
|------|----------|
| **Наименование** | Понятное имя для внутреннего использования |
| **Описание** | Описание назначения сервера |
| **Адрес сервера (SSE URL)** | URL-адрес MCP сервера. Протокол SSE (Server-Sent Events) — для двусторонней связи |
| **Тип аутентификации** | `None`, `Bearer Token`, `Basic Auth` или `Chat ID` (для Telegram) |
| **API Key / Token** | Ключ или токен для авторизации |
| **Chat ID** | Для Telegram — ID чата, куда отправлять уведомления |

---

## Управление инструментами

После подключения MCP сервера вы видите список **инструментов**, которые он предоставляет. Каждый инструмент — это конкретное действие, которое ассистент может выполнить.

### Синхронизация

Нажмите **«Синхронизировать инструменты»**, чтобы загрузить актуальный список инструментов с MCP сервера. Это нужно делать:
- При первом подключении
- Если на сервере добавились или изменились инструменты

### Включение/выключение

Не все инструменты нужны вашему ассистенту. Переключателями отметьте только те, которые ему понадобятся.

> Совет: Чем меньше инструментов подключено одновременно, тем точнее ИИ выбирает нужный. Не включайте всё подряд — только то, что реально нужно.

### Просмотр деталей инструмента

Нажмите на инструмент, чтобы увидеть его параметры:

<div class="form-mockup">
  <div class="form-mockup-title">send_message</div>
  <div class="form-mockup-card">
    <div class="card-desc">Отправляет текстовое сообщение в указанный Telegram чат.</div>
  </div>
  <div class="form-mockup-section-title">Параметры</div>
  <div class="form-mockup-list-item"><span class="item-name">chat_id</span><span class="item-detail">string, обязательный — ID чата для отправки</span></div>
  <div class="form-mockup-list-item"><span class="item-name">text</span><span class="item-detail">string, обязательный — Текст сообщения</span></div>
  <div class="form-mockup-list-item"><span class="item-name">parse_mode</span><span class="item-detail">string, необязательный — HTML, Markdown или plain text</span></div>
  <div class="form-mockup-actions">
    <div class="form-mockup-btn form-mockup-btn-primary">Тестировать инструмент</div>
  </div>
</div>

### Тестирование инструмента

Вы можете протестировать каждый инструмент прямо из интерфейса, не подключая его к ассистенту:

<div class="form-mockup">
  <div class="form-mockup-title">Тестирование: send_message</div>
  <div class="form-mockup-field">
    <label>Входные параметры (JSON)</label>
    <div class="form-mockup-textarea" style="min-height: 80px;">{
  "chat_id": "123456789",
  "text": "Тестовое сообщение!"
}</div>
  </div>
  <div class="form-mockup-actions" style="border: none;">
    <div class="form-mockup-btn form-mockup-btn-primary">Выполнить</div>
  </div>
  <div class="form-mockup-section-title">Результат</div>
  <div class="form-mockup-card">
    <div class="card-title"><span class="form-mockup-badge badge-success" style="margin-right: 8px;">Успешно</span></div>
    <div class="card-desc"><code>{ "ok": true, "message_id": 42 }</code></div>
  </div>
</div>

---

## Собственный MCP сервер

Вы можете подключить **свой MCP сервер**, разработанный по стандарту MCP.

### Требования

1. Сервер должен поддерживать **SSE (Server-Sent Events)** протокол
2. Иметь доступный URL (HTTPS)
3. Предоставлять список инструментов по запросу `tools/list`
4. Обрабатывать вызовы инструментов по запросу `tools/call`

### Пример на Node.js

```javascript
// Минимальный MCP сервер
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0"
});

// Регистрация инструмента
server.tool("get_weather", { city: "string" }, async ({ city }) => {
  const weather = await fetchWeather(city);
  return { content: [{ type: "text", text: JSON.stringify(weather) }] };
});

// Запуск SSE транспорта
const transport = new SSEServerTransport("/sse", response);
await server.connect(transport);
```

---

## Привязка к ассистенту

Созданные MCP серверы привязываются к ассистенту так же, как функции:

1. Откройте нужного ассистента
2. В карточке **Основные настройки** найдите поле **«MCP Серверы»**
3. Выберите нужные серверы из списка
4. Сохраните

<div class="form-mockup">
  <div class="form-mockup-title">Привязка MCP серверов</div>
  <div class="form-mockup-field">
    <label>MCP Серверы</label>
    <div class="form-mockup-chips">
      <span class="form-mockup-chip selected">Telegram Bot ✕</span>
      <span class="form-mockup-chip selected">Google Calendar ✕</span>
    </div>
    <div class="form-mockup-input">Начните вводить...</div>
  </div>
</div>

Инструменты всех подключённых MCP серверов автоматически становятся доступны ассистенту.

---

## Примеры сценариев

### Сценарий 1: Уведомления о заявках в Telegram

**Поток:** Клиент звонит → Ассистент записывает данные → MCP сервер Telegram → `send_message` → Менеджер получает уведомление:

> Новая заявка! Клиент: Иванов П.С., +7 900 123-45-67. Проблема: стиральная машина не отжимает.

### Сценарий 2: Запись в Google Calendar

**Поток:** Клиент хочет записаться → Ассистент уточняет дату → `check_availability` → «Свободно в 14:00 и 16:30» → Клиент выбирает → `create_event` → Событие создано.

### Сценарий 3: Письмо с подтверждением через Gmail

**Поток:** Заказ оформлен → Ассистент спрашивает email → `send_email` → Клиент получает письмо с подтверждением заказа.

---

*Предыдущий раздел: [Функции (Tools)](./03-tools.md) · Следующий раздел: [Песочница →](./05-playground.md)*

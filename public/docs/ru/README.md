# AI PBX — Полная документация платформы

> **AI PBX** — облачная платформа для создания интеллектуальных голосовых ассистентов на базе больших языковых моделей (LLM). Ассистенты умеют вести живые диалоги по телефону, принимать заказы, записывать на приём, консультировать клиентов — и всё это без участия живого оператора.

---

## Содержание

| №  | Раздел | Описание |
|----|--------|----------|
| 1  | [Быстрый старт](./01-getting-started.md) | Регистрация, первый ассистент за 5 минут, основные понятия |
| 2  | [Ассистенты](./02-assistants.md) | Создание, настройка, промпты, модели, голоса, параметры |
| 3  | [Функции (Tools)](./03-tools.md) | Function Calling, Webhook, MCP — подключение внешних систем |
| 4  | [MCP Серверы](./04-mcp-servers.md) | Интеграции Composio, Telegram, Gmail, CRM и сотни других |
| 5  | [Песочница (Playground)](./05-playground.md) | Тестирование ассистентов в реальном времени |
| 6  | [Dashboards и аналитика](./06-dashboards.md) | Overview, AI Analytics, Call Records, графики, экспорт |
| 7  | [Публикация и интеграция](./07-publish.md) | SIP URI, WebRTC виджеты, PBX серверы, Asterisk |
| 8  | [Оплата и биллинг](./08-payments.md) | Баланс, пополнение, лимиты, история, организации |

---

## Архитектура платформы

<div class="form-mockup form-mockup-wide">
  <div class="form-mockup-title">Архитектура AI PBX</div>
  <div class="form-mockup-section-title">Клиенты</div>
  <div class="form-mockup-row" style="justify-content: center;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Телефон</div>
      <div class="card-desc">SIP</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Сайт</div>
      <div class="card-desc">WebRTC</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Мессенджеры</div>
      <div class="card-desc">Telegram, WhatsApp</div>
    </div>
  </div>
  <div class="form-mockup-divider"></div>
  <div class="form-mockup-section-title">Платформа</div>
  <div class="form-mockup-row" style="justify-content: center;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Ассистенты</div>
      <div class="card-desc">LLM</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Функции</div>
      <div class="card-desc">Webhook</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">MCP Серверы</div>
      <div class="card-desc">Composio</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Песочница</div>
      <div class="card-desc">Testing</div>
    </div>
  </div>
  <div class="form-mockup-card" style="text-align: center; margin-top: 8px;">
    <div class="card-title">AI Engine (GPT / Qwen / Yandex)</div>
    <div class="card-desc">Голос → Текст → LLM → Текст → Голос</div>
  </div>
  <div class="form-mockup-row" style="justify-content: center; margin-top: 8px;">
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Dashboards</div>
      <div class="card-desc">Графики</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Отчёты</div>
      <div class="card-desc">История</div>
    </div>
    <div class="form-mockup-card" style="flex: 1; text-align: center;">
      <div class="card-title">Оплата</div>
      <div class="card-desc">Баланс</div>
    </div>
  </div>
</div>

---

## Ключевые понятия

| Термин | Что это |
|--------|---------|
| **Ассистент** | Виртуальный голосовой оператор, работающий на базе ИИ. Один ассистент = одна «роль» (оператор пиццерии, приёмная клиники и т.д.) |
| **Промпт (Инструкция)** | Текстовая инструкция, определяющая поведение ассистента. Как должностная инструкция для сотрудника |
| **Функция (Tool)** | Действие, которое ассистент может выполнить во время разговора: записать клиента, проверить заказ, отправить уведомление |
| **MCP Сервер** | Внешний сервис (Telegram, Gmail, Google Calendar и др.), подключённый через протокол MCP |
| **SIP URI** | Адрес для подключения ассистента к телефонной сети (VoIP) |
| **WebRTC Виджет** | Кнопка «Позвонить» на вашем сайте — звонок идёт прямо из браузера |
| **Песочница** | Безопасная среда для тестирования ассистента перед запуском в продакшн |
| **VAD** | Voice Activity Detection — технология определения, когда человек говорит и когда молчит |
| **Токены** | Единицы обработки текста моделью ИИ. Чем больше текст в диалоге, тем больше токенов |

---

*Последнее обновление: Февраль 2026*

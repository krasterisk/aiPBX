# Речевая аналитика (Operator Analytics)

> Загружайте записи разговоров операторов, получайте транскрипт, оценку качества и свои метрики. Есть веб-интерфейс и API для автоматической выгрузки из АТС.

---

## Содержание

1. [Проекты аналитики](#проекты-аналитики)
2. [Загрузка и дашборд проекта](#загрузка-и-дашборд-проекта)
3. [API аналитики](#api-аналитики)
4. [Для интеграторов](#для-интеграторов)
5. [Вебхуки](#вебхуки)

---

## Проекты аналитики

**Зачем:** один проект = один контур анализа (например, «Колл-центр продаж» или «Поддержка L1»). В проекте свои записи, метрики и дашборд.

**Как открыть:** меню → **Аналитика** → **Проекты**.

![Мастер проекта](/docs/screenshots/project-wizard.png)

<div class="form-mockup">
  <div class="form-mockup-title">Новый проект</div>
  <div class="form-mockup-field"><label>Название</label><div class="form-mockup-input">Продажи Q1</div></div>
  <div class="form-mockup-field"><label>Язык записей</label><div class="form-mockup-input">Русский</div></div>
  <div class="form-mockup-actions"><div class="form-mockup-btn form-mockup-btn-primary">Создать</div></div>
</div>

**Сценарий:**
1. Создайте проект в мастере.
2. Загрузите один или несколько аудиофайлов (MP3, WAV) или подключите API (ниже).
3. Дождитесь статуса анализа — откройте дашборд проекта.

---

## Загрузка и дашборд проекта

![Дашборд оператора](/docs/screenshots/operator-dashboard.png)

На дашборде проекта вы увидите:
- KPI по звонкам (количество, средняя длительность, тональность).
- **AI Insights** — краткие выводы с возможностью перейти в [журнал звонков](./09-calls.md).
- **Конструктор виджетов** — добавьте свои метрики (теги, custom metrics).

Загрузка файлов: внутри проекта кнопка **«Загрузить запись»** или перетаскивание в зону импорта.

![Загрузка](/docs/screenshots/upload.png)

Связь с [дашбордом «Аналитика звонков»](./06-dashboards.md): там свод по всем проектам; здесь — детали одного проекта.

---

## API аналитики

**Зачем:** чтобы записи с вашей АТС попадали в проект без ручной загрузки.

**Как открыть в интерфейсе:** меню → **Аналитика** → **API**. Там создаётся токен, привязанный к **конкретному проекту**.

![API аналитики](/docs/screenshots/analytics-api.png)

Кратко:
1. Создайте токен для нужного проекта.
2. Передавайте его в заголовке `Authorization: Bearer oa_...`.
3. Отправляйте файл или URL записи на анализ (см. блок для интеграторов).

Токен нельзя «переназначить» на другой проект — для нового проекта выпустите новый токен.

---

## Для интеграторов

Ниже — сжатый справочник. Полные примеры curl есть на странице **API** в приложении.

### Аутентификация

```
Authorization: Bearer oa_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Анализ по URL (один файл, синхронно)

`POST /api/operator-analytics/analyze-url`

```json
{
  "url": "https://storage.example.com/call.mp3",
  "operatorName": "Иван",
  "language": "ru"
}
```

### Пакет URL (фон)

Передайте массив `urls` вместо `url` — получите `batchId`, статус проверяйте отдельным запросом.

### Загрузка файла

`POST /api/operator-analytics/analyze-file` — multipart, поле `file`, тот же заголовок Authorization.

### Вебхуки

После каждого разобранного звонка платформа может сразу отправить полный JSON на ваш HTTPS-эндпоинт. Настройка — в проекте: **Настройки → Webhooks**. Формат тела описан в разделе [Вебхуки](#вебхуки).

**Важно:** токен привязан к проекту при создании. Все звонки по этому токену попадают в этот проект.

---

<a id="oa-webhooks"></a>

## Вебхуки

**Зачем:** ваш CRM, BI или внутренний сервис получает разбор звонка в момент завершения анализа — без опроса API.

**Как включить:** меню → **Аналитика** → **Проекты** → нужный проект → **Настройки** → блок **Webhooks**.

1. Укажите URL (`https://...`).
2. При необходимости добавьте заголовки (например `Authorization: Bearer ...`).
3. Отметьте события. Для полного разбора звонка нужен **`analysis.completed`**.

Кнопка «Тест вебхука» в интерфейсе не отправляет реальный запрос — проверка идёт первым живым анализом.

### Транспорт

| | |
|---|---|
| Метод | `POST` |
| Тело | JSON, `Content-Type: application/json` |
| Заголовки | ваши из настроек проекта (плюс `Content-Type`) |
| Таймаут | 10 секунд |
| Повторы | до 3 попыток (паузы 1 с и 2 с) |
| Успех | любой HTTP 2xx |
| Подпись | нет HMAC — авторизуйте запрос своими заголовками |

Событие уходит только если URL заполнен и тип события включён в проекте. Ошибка вебхука не откатывает анализ.

Отвечайте быстро: если эндпоинт не вернёт 2xx за 10 с, запрос повторится. Делайте обработчик идемпотентным по `(event, recordId)` или `(event, projectId, month)` для бюджета.

### Общий конверт

Каждый запрос — один JSON:

```json
{
  "event": "analysis.completed",
  "projectId": 12,
  "timestamp": "2026-08-31T08:26:14.382Z",
  "data": {}
}
```

| Поле | Тип | Описание |
|---|---|---|
| `event` | string | `analysis.completed` \| `analysis.error` \| `budget.exceeded` \| `anomaly.detected` |
| `projectId` | number | ID проекта |
| `timestamp` | string | момент отправки, ISO-8601 UTC |
| `data` | object | полезная нагрузка события |

`projectId` на бэкенде — число, не строка.

---

### `analysis.completed` — полный разбор звонка

Уходит после успешного анализа файла, URL, пакета, повторного анализа и дедупликации (тот же аудио-хеш).

`data` содержит идентификаторы, транскрипт, скоры, кастомные метрики, обоснования и темы.

```json
{
  "event": "analysis.completed",
  "projectId": 12,
  "timestamp": "2026-08-31T08:26:14.382Z",
  "data": {
    "recordId": 4512,
    "filename": "call-20260831.wav",
    "metrics": {
      "greeting_quality": 82,
      "script_compliance": 71,
      "politeness_empathy": 90,
      "active_listening": 75,
      "objection_handling": 60,
      "product_knowledge": 88,
      "problem_resolution": 70,
      "speech_clarity_pace": 80,
      "closing_quality": 65,
      "customer_sentiment": "Positive",
      "csat": 4,
      "summary": "Клиент уточнил тариф и согласился на апгрейд.",
      "success": true
    },
    "customMetrics": {
      "upsell_attempt": true,
      "nps_hint": 8,
      "tier": "high"
    },
    "transcription": "operator: Добрый день\ncustomer: Здравствуйте, хочу сменить тариф",
    "turns": [
      { "speaker": "operator", "text": "Добрый день", "start": 0.2, "end": 1.1 },
      { "speaker": "customer", "text": "Здравствуйте, хочу сменить тариф", "start": 1.3, "end": 4.0 }
    ],
    "duration": 142.5,
    "operatorName": "Иванов А.",
    "clientPhone": "+79001234567",
    "language": "ru",
    "detectedLanguage": "ru",
    "recordUrl": "https://storage.example.com/call.wav",
    "sttProvider": "openai",
    "quality": { "quality": "ok", "confidence": 0.91, "reasons": [] },
    "assessments": {
      "greeting_quality": {
        "rationale": "Оператор представился и назвал компанию.",
        "quote": "Добрый день, компания А, меня зовут Иван"
      },
      "csat": {
        "rationale": "Клиент поблагодарил в конце.",
        "quote": "Спасибо большое"
      }
    },
    "customMetricsMeta": {
      "upsell_attempt": { "name": "Попытка апселла", "type": "boolean", "polarity": "positive" },
      "nps_hint": { "name": "NPS", "type": "number", "min": 0, "max": 10, "unit": "/10" },
      "tier": { "name": "Сегмент", "type": "enum", "enumValues": ["low", "high"] }
    },
    "topics": {
      "tags": ["tariff_change"],
      "tag_names": { "tariff_change": "Смена тарифа" },
      "keywords": ["тариф"]
    },
    "analysisConfidence": 0.88,
    "insufficientContent": false,
    "schemaVersion": 2,
    "promptVersion": "2026-08-12.1",
    "model": "gpt-4.1-mini",
    "diarizationSource": "channel",
    "customMetricsInvalid": null
  }
}
```

#### Поля `data`

| Поле | Тип | Описание |
|---|---|---|
| `recordId` | number | ID записи аналитики |
| `filename` | string | имя исходного файла |
| `metrics` | object | дефолтные скоры проекта + итог звонка |
| `customMetrics` | object \| null | значения кастомных метрик, ключ = `id` из схемы проекта |
| `transcription` | string \| null | сплошной текст; при диаризации — строки `speaker: text` |
| `turns` | array \| null | реплики `{ speaker, text, start?, end? }`; `speaker`: `operator` или `customer` |
| `duration` | number \| null | длительность аудио, секунды |
| `operatorName` | string \| null | имя оператора, если передали при загрузке |
| `clientPhone` | string \| null | телефон клиента, если передали |
| `language` | string \| null | языковая подсказка STT (`ru`, `auto`, …) |
| `detectedLanguage` | string \| null | язык, который определил STT |
| `recordUrl` | string \| null | URL записи, если анализ шёл по ссылке |
| `sttProvider` | string \| null | провайдер распознавания |
| `quality` | object \| null | `quality`: `ok` \| `low` \| `unusable`; `confidence` 0–1; `reasons` — коды |
| `assessments` | object \| null | обоснование и цитата по каждой метрике и по `csat` / `customer_sentiment` / `success` |
| `customMetricsMeta` | object \| null | снимок схемы кастомных метрик (тип, шкала, enum) |
| `topics` | object \| null | `tags` — id тем, `tag_names` — названия, `keywords` — найденные слова |
| `analysisConfidence` | number \| null | уверенность LLM, 0–1 |
| `insufficientContent` | boolean \| null | мало содержимого для устойчивой оценки |
| `schemaVersion` | number \| null | версия схемы кастомных метрик на момент анализа |
| `promptVersion` | string \| null | версия промпта/рубрик |
| `model` | string \| null | модель, которой разобрали звонок |
| `diarizationSource` | string \| null | `channel` \| `channel_energy` \| `channel_llm` \| `llm` |
| `customMetricsInvalid` | string[] \| null | id кастомных метрик с невалидным значением (`null` в `customMetrics`) |
| `regenerated` | true | только при повторном анализе |
| `deduplicatedFrom` | number | id исходной записи, если результат скопирован с дубля |

#### `metrics`

В объекте только **включённые** дефолтные метрики проекта (если ничего не выключали — все 9) плюс итог:

| Ключ | Тип | Шкала |
|---|---|---|
| `greeting_quality` | integer | 0–100 |
| `script_compliance` | integer | 0–100 |
| `politeness_empathy` | integer | 0–100 |
| `active_listening` | integer | 0–100 |
| `objection_handling` | integer | 0–100 |
| `product_knowledge` | integer | 0–100 |
| `problem_resolution` | integer | 0–100 |
| `speech_clarity_pace` | integer | 0–100 |
| `closing_quality` | integer | 0–100 |
| `customer_sentiment` | string | `Positive` \| `Neutral` \| `Negative` |
| `csat` | integer | 1–5 |
| `summary` | string | краткое резюме на языке звонка |
| `success` | boolean | обращение закрыто успешно |

Аудиофайл в вебхук **не** вкладывается. Стоимость и токены не отправляются.

---

### `analysis.error`

Фоновый анализ или скачивание URL не удалось.

```json
{
  "event": "analysis.error",
  "projectId": 12,
  "timestamp": "2026-08-31T08:26:14.382Z",
  "data": {
    "recordId": 4512,
    "error": "Request failed with status code 404"
  }
}
```

---

### `budget.exceeded`

Месячный расход проекта достиг лимита USD (не чаще одного раза за календарный месяц UTC).

```json
{
  "event": "budget.exceeded",
  "projectId": 12,
  "timestamp": "2026-08-31T08:26:14.382Z",
  "data": {
    "projectId": 12,
    "projectName": "Колл-центр А",
    "monthlyBudgetUsd": 100,
    "spentUsd": 105.123456,
    "month": "2026-08",
    "alertEmails": ["ops@example.com"]
  }
}
```

---

### `anomaly.detected`

Раз в сутки платформа сравнивает недавнее окно с предыдущим (падение CSAT / рост негатива).

```json
{
  "event": "anomaly.detected",
  "projectId": 12,
  "timestamp": "2026-08-31T04:00:01.120Z",
  "data": {
    "projectId": 12,
    "projectName": "Колл-центр А",
    "windowDays": 7,
    "recent": { "count": 20, "avgCsat": 3.5, "negativeRate": 15.2 },
    "baseline": { "count": 18, "avgCsat": 4.2, "negativeRate": 8.1 },
    "triggers": {
      "csatDrop": 16.67,
      "negativeSpike": 7.1
    }
  }
}
```

`csatDrop` — падение среднего CSAT в процентах к baseline; `negativeSpike` — рост доли негатива в процентных пунктах. Несработавший триггер приходит как `null`.

---

## См. также

- [Звонки](./09-calls.md) — журнал после анализа голосовых ботов
- [Дашборды](./06-dashboards.md) — сводная аналитика звонков
- [Быстрый старт](./01-getting-started.md) — выбор ветки «Речевая аналитика» в онбординге

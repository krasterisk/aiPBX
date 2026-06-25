# Documentation Screenshots

Скриншоты интерфейса aiPBX для документации (1280×800, redesign-v3).

## Файлы

| Файл | Описание |
|------|----------|
| `dashboard.png` | Дашборд — обзор метрик |
| `assistant-create.png` | Диалог создания ассистента |
| `assistant-publish-sip.png` | Публикация SIP / транк |
| `tool-create.png` | Создание HTTP-функции |
| `playground.png` | Playground — тестовый звонок |
| `reports-history.png` | Таблица истории звонков |
| `project-wizard.png` | Мастер проекта (речевая аналитика) |
| `operator-dashboard.png` | Дашборд оператора |
| `upload.png` | Загрузка записей для анализа |

## Обновление

```bash
# Моки из HTML-шаблонов (по умолчанию):
npx ts-node scripts/capture-docs-screenshots.ts

# Захват с локального dev-сервера:
npx ts-node scripts/capture-docs-screenshots.ts --base-url=http://localhost:3000
```

Скрипт: `scripts/capture-docs-screenshots.ts` (Playwright).

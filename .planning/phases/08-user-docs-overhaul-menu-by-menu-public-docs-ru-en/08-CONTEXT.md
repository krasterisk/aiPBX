# Phase 08: User docs overhaul — Context

**Gathered:** 2026-07-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Полная актуализация in-app пользовательской документации (`public/docs/`, маршрут `/docs`): пройти каждый пункт menubar **кроме «Управление»**, описать реальный функционал простым языком, дополнить разделы по аналитике, обновить иллюстрации.

Фронтенд-only: markdown-файлы, сайдбар `DOC_SECTIONS`, i18n ключи документации, скрипт захвата PNG. Без admin-документации, без dev-docs (`docs/`), без GTM-лендингов.

</domain>

<decisions>
## Implementation Decisions

### Навигация и структура
- **D-01:** Сайдбар `/docs` (`DOC_SECTIONS` в `getDocumentationContent.ts`) **зеркалит menubar 1:1** — те же группы и подпункты, что в `getMenubarItems.ts` (кроме «Управление»).
- **D-02:** Новые markdown-файлы: `09-calls.md`, `10-knowledge-bases.md`, `11-operator-analytics.md`; расширить существующие `01`–`08` по ROADMAP.
- **D-03:** Названия групп в сайдбаре docs = **те же строки, что в menubar** (через i18n `documentation` namespace, не упрощённые синонимы).
- **D-04:** «Звонки» и «Базы знаний» — **отдельные пункты верхнего уровня** (как в menubar).
- **D-05:** «Пользователи» (owner, не admin) — **подраздел в `01-getting-started.md`**, не отдельный файл в сайдбаре (уточнение по умолчанию: пользователь не ответил на follow-up; согласуется с ROADMAP).

### Языки
- **D-06:** Полный паритет **ru + en + de + zh** — создать/заполнить `public/docs/de/` и `public/docs/zh/` по образцу ru; fallback в коде остаётся на ru при отсутствии файла.

### Иллюстрации
- **D-07:** **Гибрид:** inline `form-mockup` HTML в markdown (основной способ показать UI в тексте) **+** PNG в `public/docs/screenshots/` для крупных экранов.
- **D-08:** PNG генерировать **приоритетно через HTML-макеты** в `scripts/capture-docs-screenshots.ts` (офлайн, стабильно в CI) — не зависеть от live auth для базового комплекта.
- **D-09:** Макеты должны выглядеть как **redesign-v3**, не процедурные заглушки Phase 2 (закрыть GAP-14 по качеству).

### Контент и тон
- **D-10:** **Слоистая аудитория:** основной текст для оператора/менеджера («куда нажать → что увидите»); блоки «Для интеграторов» в `07-publish.md` и `11-operator-analytics.md` (SIP, API, webhooks).
- **D-11:** Каждый раздел: зачем модуль, как открыть в меню, типовой сценарий, частые ошибки.
- **D-12:** Без AI-клише и длинных тире (—); живой русский; en/de/zh — адаптированный перевод, не сырой machine translate.
- **D-13:** Перекрёстные ссылки между разделами (ассистент → песочница → публикация → звонки → дашборд).

### Аналитика (Operator Analytics)
- **D-14:** Раздел `11-operator-analytics.md`: **UI-сценарии** (проекты, загрузка, дашборд, custom metrics, insights drill-down) **+ краткий справочник API** внутри docs (токены, `analyze-file`, batch status, webhooks) — не только ссылка наружу.
- **D-15:** Расширить `06-dashboards.md`: три экрана (Сводный, Аналитика ботов, Аналитика звонков), AI insights, drill-down в звонки.

### Legacy и cleanup
- **D-16:** **Удалить** дубликаты `public/docs/01-08.md` в корне — единственный источник: `public/docs/{ru,en,de,zh}/`.
- **D-17:** Обновить `public/docs/README.md` и языковые README; синхронизировать `DOCS-INDEX.md` после выполнения.

### Claude's Discretion
- Точные anchor-id для новых подразделов в `DOC_SECTIONS` (генерировать из заголовков markdown).
- Порядок волн планов 08-01…08-04 внутри ROADMAP-suggested breakdown.
- Детальный список PNG-файлов сверх текущего README (добавить calls, knowledge-base, analytics-api по мере написания разделов).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### In-app docs (target)
- `public/docs/ru/README.md` — оглавление RU
- `public/docs/en/README.md` — оглавление EN
- `public/docs/ru/01-getting-started.md` … `08-payments.md` — текущие разделы
- `public/docs/screenshots/README.md` — инвентарь PNG
- `scripts/capture-docs-screenshots.ts` — генерация макетов
- `scripts/generate-mock-screenshots.ts` — Node fallback (улучшить под D-09)

### Docs UI (must update)
- `src/widgets/DocumentationLayout/lib/getDocumentationContent.ts` — `DOC_SECTIONS`, `SECTION_FILES`
- `src/widgets/DocumentationLayout/ui/DocumentationContent/DocumentationContent.module.scss` — стили `form-mockup`
- `src/widgets/Menubar/model/selectors/getMenubarItems.ts` — эталон структуры меню

### Prior phase decisions
- `.planning/phases/02-onboarding-conversion/02-CONTEXT.md` — D-15/D-16 screenshots, GAP-14
- `.planning/phases/02-onboarding-conversion/02-VERIFICATION.md` — качество моков Phase 2 (не повторять регресс)

### API reference source (analytics embed)
- `aiPBX/.idea/public_api_docs.md.resolved` — эндпоинты OA для сокращённого справочника в docs

### Intel
- `.planning/intel/DOCS-INDEX.md` — реестр документации (обновить после фазы)
- `.planning/intel/FEATURES.md` — инвентарь фич для проверки полноты
- `.planning/GAPS.md` — GAP-14

### Roadmap
- `.planning/ROADMAP.md` — Phase 8 scope table

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `form-mockup` CSS в `DocumentationContent.module.scss` — уже рендерится из HTML в markdown (`06-dashboards.md` — образец).
- `fetchDocumentationMarkdown(sectionId, lang)` — загрузка `/docs/{lang}/{file}`; нужно расширить `SECTION_FILES` и `DOC_SECTIONS`.
- `scripts/capture-docs-screenshots.ts` — `MOCKS` record с variants dashboard/modal/table/wizard/playground; добавить variants для calls, knowledge-base, analytics.

### Established Patterns
- Нумерация файлов `01-`…`11-`; якоря в markdown на кириллице (см. существующие `subsections.anchor`).
- i18n: ключи `doc_*` в namespace documentation (проверить `public/locales/*/documentation.json`).

### Integration Points
- Menubar routes (`getRouteCalls`, `getRouteKnowledgeBases`, `getRouteAnalyticsProjects`, etc.) — ссылки «открыть в приложении» в тексте docs.
- Phase 3 features для описания: insights drill-down, dashboard builder, custom metrics, `OperatorUsageSection` billing.

### Menu coverage (non-admin) — checklist
- [ ] Дашборды → Сводный, Аналитика ботов, Аналитика звонков
- [ ] Звонки
- [ ] AI Боты → Ассистенты, Песочница, Функции, MCP, Базы знаний, Публикация (SIPs / Trunks / Виджеты)
- [ ] Аналитика → Проекты, API
- [ ] Оплата
- [ ] Пользователи (owner) → в getting-started

</code_context>

<specifics>
## Specific Ideas

- Пользователь (при создании фазы): «чтобы даже неподготовленному было понятно»; избегать шаблонных фраз ИИ; скриншоты как макеты реальных страниц.
- Phase 2 verification: текущие PNG слабее legacy placeholders — Phase 8 must raise fidelity bar.

</specifics>

<deferred>
## Deferred Ideas

- Admin documentation (Управление: helpdesk, PBX, модели, цены) — отдельная фаза при необходимости.
- Видео-туториалы.
- Developer docs (`aiPBX/docs/`, backend `.docs/`).
- GTM landing copy (Phase 4).
- Полный API connector wizard для OA (остаётся intro + справочник; deep setup — Phase 3+ hardening).

</deferred>

---

*Phase: 08-user-docs-overhaul*
*Context gathered: 2026-07-03*

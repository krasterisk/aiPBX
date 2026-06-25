# Onboarding Analytics — Funnel Events & Goal Setup

Документ для настройки целей в **Google Analytics 4** и **Яндекс.Метрике** для воронки онбординга aiPBX (оба продукта: Голосовые ассистенты и Речевая аналитика).

> **Важно:** цели настраиваются в интерфейсах GA4 и Метрики. Код только отправляет события через `trackEvent` из [`src/shared/config/analytics/initAnalytics.ts`](../src/shared/config/analytics/initAnalytics.ts).

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `YANDEX_METRIKA_ID` | ID счётчика Яндекс.Метрики (число) |
| `GA4_MEASUREMENT_ID` | Measurement ID GA4 (`G-XXXXXXXX`) |

Значения передаются в Webpack через `config/build/buildPlugins.ts` как `__YANDEX_METRIKA_ID__` и `__GA4_MEASUREMENT_ID__`. Если ID не заданы, `trackEvent` безопасно ничего не отправляет.

Инициализация счётчиков: `initAnalytics()` в [`src/shared/config/analytics/initAnalytics.ts`](../src/shared/config/analytics/initAnalytics.ts) — вызывается при старте приложения.

## Обёртка онбординга

Все события онбординга проходят через [`trackOnboardingEvent`](../src/features/Onboarding/lib/onboardingAnalytics.ts):

```typescript
trackOnboardingEvent(name, { productPath?, step?, ... })
```

Параметры `productPath` (`assistants` | `analytics`) и `step` передаются в GA4/Метрику как custom parameters.

---

## Полный список событий (D-13)

### Общие (оба продукта)

| Событие | Когда срабатывает | Источник |
|---------|-------------------|----------|
| `onboarding_started` | Пользователь открыл мастер онбординга | `onboardingSlice.startOnboarding` |
| `onboarding_product_assistants` | Выбран путь «Голосовые ассистенты» | `ProductForkStep` |
| `onboarding_product_analytics` | Выбран путь «Речевая аналитика» | `ProductForkStep` |
| `onboarding_step_{n}` | Переход на шаг N (1…max) | `onboardingSlice`, `ProductForkStep` |
| `onboarding_skipped` | Пользователь пропустил онбординг | `onboardingSlice.skipOnboarding` |
| `onboarding_completed` | Онбординг завершён | `onboardingSlice.completeOnboarding` |

### Путь «Голосовые ассистенты»

| Событие | Когда срабатывает | Источник |
|---------|-------------------|----------|
| `assistant_created` | Ассистент создан из шаблона/описания | `BusinessTypeStep` |
| `playground_call_success` | **Первый успешный тестовый звонок в Playground** | `Playground.tsx` |

### Путь «Речевая аналитика»

| Событие | Когда срабатывает | Источник |
|---------|-------------------|----------|
| `oa_project_created` | Проект аналитики создан | `OnboardingAnalyticsSteps` |
| `oa_file_uploaded` | Файл загружен для анализа | `OnboardingAnalyticsSteps` |
| `oa_first_analysis_complete` | **Первый анализ завершён** | `OnboardingAnalyticsFlow` |

---

## Основные конверсионные цели

| Цель | Событие | Продукт | Приоритет |
|------|---------|---------|-----------|
| **Первый звонок** | `playground_call_success` | Ассистенты | 🔴 Primary |
| **Первый анализ** | `oa_first_analysis_complete` | Аналитика | 🔴 Primary |
| Выбор продукта | `onboarding_product_assistants` / `onboarding_product_analytics` | Оба | 🟡 Secondary |
| Создание ассистента | `assistant_created` | Ассистенты | 🟡 Secondary |
| Создание проекта OA | `oa_project_created` | Аналитика | 🟡 Secondary |
| Завершение онбординга | `onboarding_completed` | Оба | 🟢 Tertiary |

---

## Настройка в Google Analytics 4

1. **Admin → Data display → Events** — убедитесь, что события поступают (DebugView при разработке).
2. **Admin → Data display → Events → Create event** (при необходимости) или пометьте существующие как conversions.
3. **Admin → Data display → Conversions** — включите:
   - `playground_call_success`
   - `oa_first_analysis_complete`
4. Для воронки создайте **Exploration → Funnel exploration**:
   ```
   onboarding_started
   → onboarding_product_* (assistants OR analytics)
   → onboarding_step_1
   → [assistant_created | oa_project_created]
   → [playground_call_success | oa_first_analysis_complete]
   ```

### Рекомендуемые custom dimensions (GA4)

| Dimension | Parameter |
|-----------|-----------|
| Product path | `productPath` |
| Onboarding step | `step` |

---

## Настройка в Яндекс.Метрике

1. **Настройки → Цели → JavaScript-событие**
2. Создайте цели с идентификатором события (совпадает с именем в коде):

| Название цели | Идентификатор |
|---------------|---------------|
| Первый звонок Playground | `playground_call_success` |
| Первый анализ OA | `oa_first_analysis_complete` |
| Старт онбординга | `onboarding_started` |
| Выбор ассистентов | `onboarding_product_assistants` |
| Выбор аналитики | `onboarding_product_analytics` |
| Ассистент создан | `assistant_created` |
| Проект OA создан | `oa_project_created` |
| Онбординг завершён | `onboarding_completed` |

3. Для воронки: **Отчёты → Воронки** — добавьте шаги в порядке из таблицы выше.

> Метрика получает события через `window.ym(id, 'reachGoal', name, params)` — см. `trackEvent` в `initAnalytics.ts`.

---

## Домены

Настройка целей нужна **на всех доменах**, где заданы `YANDEX_METRIKA_ID` и `GA4_MEASUREMENT_ID` (production, staging, не только ru).

---

## Проверка

```bash
# В браузере с заданными env:
# 1. Откройте DevTools → Network, фильтр metrika / google-analytics
# 2. Пройдите онбординг
# 3. Убедитесь, что события уходят с корректными именами

# GA4: Admin → DebugView (с debug_mode или расширением)
# Метрика: Настройки → Цели → проверка срабатывания
```

---

## Связанные файлы

- [`src/shared/config/analytics/initAnalytics.ts`](../src/shared/config/analytics/initAnalytics.ts) — инициализация GA4/Метрики, `trackEvent`
- [`src/features/Onboarding/lib/onboardingAnalytics.ts`](../src/features/Onboarding/lib/onboardingAnalytics.ts) — `trackOnboardingEvent`, `trackOnboardingStepEvent`
- [`src/features/Onboarding/model/slices/onboardingSlice.ts`](../src/features/Onboarding/model/slices/onboardingSlice.ts) — lifecycle-события
- [`.planning/phases/02-onboarding-conversion/02-CONTEXT.md`](../.planning/phases/02-onboarding-conversion/02-CONTEXT.md) — решения D-13, D-14

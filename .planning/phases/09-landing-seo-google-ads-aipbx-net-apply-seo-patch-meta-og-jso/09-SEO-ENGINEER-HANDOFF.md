# Handoff: SEO / Google Ads — aipbx.net (EN)

**Для:** SEO-инженер / performance marketer  
**От:** Product / engineering (Phase 09)  
**Дата:** 2026-07-21  
**Сегмент:** только **https://aipbx.net** (EN). RU (`aipbx.ru`) — отдельно, Phase 4.  
**Статус продакшена:** задеплоено; GSC верифицирован; URL Inspection выполнен; prerender EN meta в HTML подтверждён.

Полные черновики Ads: `09-ADS-ASSETS.md`  
Технический аудит: `09-SEO-AUDIT.md`

---

## 1. Executive summary

Сделана техническая готовность сайта к органике и Google Ads Search:

| Было | Стало |
|------|--------|
| SPA без HTML для ботов (пустой `#root`) | Build-time prerender 4 LP → боты видят title/meta/OG/JSON-LD |
| Meta/title часто RU на EN-хосте | EN locale для `.net` (i18n + форс при prerender) |
| sitemap/robots на `.ru` | `https://aipbx.net` |
| GA4/Ads неактивны | GA4 + Google Ads + conversion на signup |
| Нет OG-картинки | `/assets/og-default.png` 1200×630 |

**Задача SEO-инженера сейчас — не править код meta**, а завести кампанию, конверсии, расширения и следить за QS / Search terms / GSC.

---

## 2. Публичные URL (landing inventory)

| URL | Назначение | Ads final URL |
|-----|------------|---------------|
| https://aipbx.net/ | Brand / overview | Soft / brand (опционально) |
| https://aipbx.net/voice-assistants | AI voice assistant, SIP/Asterisk | Ad groups 1–2 |
| https://aipbx.net/speech-analytics | Speech analytics / call QA | Ad groups 3–4 |
| https://aipbx.net/pricing | Pricing | Sitelink / remarketing |
| https://aipbx.net/signup | Signup | Conversion path (не primary LP) |
| https://aipbx.net/docs | Docs | Sitelink (низкий приоритет) |

**Sitemap:** https://aipbx.net/sitemap.xml  
**Robots:** https://aipbx.net/robots.txt  

Disallow: `/dashboard`, `/assistants`, `/playground`, `/payment`, `/admin`.

---

## 3. Что именно сделано в коде (куда смотреть)

### 3.1 Meta / OG / canonical / hreflang / JSON-LD

| Что | Где |
|-----|-----|
| Запись title, description, OG, canonical, hreflang, JSON-LD | `src/shared/lib/seo/usePageMeta.ts` |
| Сигнал готовности для prerender | `src/shared/lib/seo/useSeoRenderReady.ts` |
| Вызовы на LP | `MainPage.tsx`, `VoiceAssistantsLandingPage.tsx`, `SpeechAnalyticsLandingPage.tsx`, `PublicPricingPage.tsx` |
| EN/RU тексты meta | `public/locales/en/main.json`, `public/locales/ru/main.json` (`*.meta.title/description`) |
| Базовый shell + Organization JSON-LD | `public/index.html` |
| Абсолютные URL от build-time константы | `__SITE_URL__` (не `window.location`) |

**hreflang:**  
- `en` → `https://aipbx.net{path}`  
- `ru` → `https://aipbx.ru{path}`  
- `x-default` → `https://aipbx.net{path}`

**OG image:** `https://aipbx.net/assets/og-default.png` (файл: `public/assets/og-default.png`).

### 3.2 Prerender (боты / Ads quality)

| Что | Где |
|-----|-----|
| Плагин prerender 4 роутов | `config/build/buildPlugins.ts` (`@prerenderer/webpack-plugin`) |
| Роуты | `/`, `/voice-assistants`, `/speech-analytics`, `/pricing` |
| Форс EN при `.net` build | `src/shared/config/i18n/i18n.ts` (детектор `siteUrl`) + Puppeteer `pageSetup` |
| Gate после сборки | `scripts/verify-prerender.js` (`npm run verify:prerender`) |
| Docker builder (Chrome) | `Dockerfile` — base `ghcr.io/puppeteer/puppeteer:21.11.0` |

Проверка «как бот»: View Source / `curl` — в HTML должны быть `<title>`, `meta description`, `canonical`, `application/ld+json` **без** кириллицы на `.net`.

### 3.3 Analytics & conversions

| Что | Где |
|-----|-----|
| GA4 + Google Ads config | `src/shared/config/analytics/initAnalytics.ts` |
| Ads conversion helper | `fireAdsConversion(label)` |
| Signup → GA4 + Ads | `src/features/Auth/lib/hooks/useSignupData.ts` |
| SPA page_view | App router (GA4 `send_page_view: false` + ручной `page_view`) |
| first_call | `src/pages/Playground/.../Playground.tsx` |
| payment_success | `src/pages/BillingPage/.../BillingPage.tsx` (успешная оплата) |

**Build / prod env (публичные client IDs):**

```text
SITE_URL=https://aipbx.net
GA4_MEASUREMENT_ID=G-G1KZQCKP5D
GOOGLE_ADS_ID=AW-16711221644
ADS_SIGNUP_LABEL=-B6_CK72wtMcEIyDxKA-
```

`send_to` для Ads: `AW-16711221644/-B6_CK72wtMcEIyDxKA-`

### 3.4 Crawl / static SEO

| Файл | Содержание |
|------|------------|
| `public/sitemap.xml` | locs на aipbx.net (/, pricing, speech-analytics, voice-assistants, docs, signup) |
| `public/robots.txt` | Allow LP + Sitemap directive; Disallow app areas |

### 3.5 CRO (quick wins в коде)

- Demo CTA на 3 LP (ключи `landing.demoCta.*` в `main` locale)  
- METRICS на Speech Analytics → i18n  
- Viewport без `user-scalable=no`

> **Известный UI-баг (не SEO для ботов):** в браузере может мелькать ключ `landing.demoCta.label` вместо текста — i18n/runtime. На prerendered meta это не влияет. Чинится отдельно в продукте.

---

## 4. Что уже сделано founder’ом (консоли)

- [x] Deploy production `aipbx.net` с SEO/prerender  
- [x] Google Search Console — верификация property  
- [x] URL Inspection + Request indexing по ключевым URL  
- [ ] Submit sitemap в GSC (если ещё не: Sitemaps → `https://aipbx.net/sitemap.xml`)  
- [ ] Live Google Ads campaign (ещё не создана — зона SEO/Ads)

---

## 5. Что делать SEO-инженеру в Google Ads

Опора: полный черновик **`09-ADS-ASSETS.md`**.

### 5.1 Аккаунт и связки

1. Google Ads account с ID **`AW-16711221644`** (или убедиться, что тег совпадает).  
2. Связать Ads ↔ GA4 property **`G-G1KZQCKP5D`**.  
3. Проверить, что на сайте в Network уходит gtag config для обоих ID (после signup — conversion).

### 5.2 Конверсии

| Приоритет | Действие | Как |
|-----------|----------|-----|
| **Primary (optimize)** | Signup | Conversion action с label **`-B6_CK72wtMcEIyDxKA-`** (website tag / already fired from code). Статус: Active, Include in “Conversions”. |
| Observation | `assistant_created`, `first_call`, `payment_success` | Импорт из GA4 → **не** ставить в bidding, пока мало объёма |

Оптимизировать Search **только** на signup, пока нет стабильных 30–50+ конверсий/мес.

### 5.3 Структура кампании (рекомендация)

- **1× Search EN**, Display/Partners off на старте  
- Язык: English  
- Гео: на усмотрение (US/UK/EU EN; RU не мешать с Direct RU)  
- Bidding: Maximize conversions → позже tCPA  
- Бюджет: founder

**4 ad groups** (см. `09-ADS-ASSETS.md`):

| # | Тема | Final URL |
|---|------|-----------|
| 1 | AI Voice Assistant | `/voice-assistants` |
| 2 | Asterisk / SIP voice bot | `/voice-assistants` |
| 3 | Speech Analytics | `/speech-analytics` |
| 4 | Call QA / scoring | `/speech-analytics` |

Там же: keyword clusters (exact/phrase), RSA headlines/descriptions, negatives, sitelinks/callouts.

### 5.4 Launch checklist (Ads)

1. Подтвердить conversion `signup` в Ads (тестовый signup → DebugView / Conversions).  
2. Создать кампанию + 4 ad groups из `09-ADS-ASSETS.md`.  
3. Final URL только `.net` LP (не `.ru`).  
4. Sitelinks: Pricing, Docs, Signup / Demo.  
5. Soft launch → Search terms → чистить negatives / exacts.  
6. Сверять Ads «Landing page» title с view-source LP (QS).  
7. **EEA:** перед масштабом — Consent Mode v2 (зафиксировано в `09-SEO-AUDIT.md` как founder/compliance, не сделано в коде Phase 09).

### 5.5 Что SEO **не** должен делать без eng

- Хардкодить meta в Ads вместо правок i18n (`public/locales/en/main.json`)  
- Менять sitemap на `.ru` в этом билде  
- Ждать SSR — сейчас стратегия = prerender snapshot  
- Оптимизировать bidding на `payment_success` на старте

Нужны правки title/H1/meta → тикет в eng: ключи в `en/main.json` + redeploy `[deploy:1]`.

---

## 6. Google Search Console (ongoing)

| Действие | Зачем |
|----------|--------|
| Sitemaps → submit `sitemap.xml` | Ускорить discovery |
| Coverage / Page indexing | Следить за ошибками 4xx/soft 404 |
| URL Inspection | После крупных SEO-деплоев |
| Experience / CWV | После CRO/image pass |
| International targeting / hreflang отчёты | en↔ru alternates уже в HTML |

---

## 7. Как быстро проверить «SEO живое» (5 мин)

```bash
# title + canonical в HTML (не только после JS)
curl -sL https://aipbx.net/voice-assistants | findstr /i "title canonical ld+json og:title"
```

Ожидаемо EN, например:  
`AI Voice Assistant for Business | Automate Calls 24/7 | AI PBX`

Инструменты:  
- [Rich Results Test](https://search.google.com/test/rich-results)  
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) (OG)  
- Ads Preview / Landing page experience

---

## 8. Out of scope / следующие фазы

| Тема | Статус |
|------|--------|
| Live Ads management | Founder / SEO — сейчас |
| Consent Mode v2 (EEA) | Не в коде; решить до scale |
| aipbx.ru / Metrika / RU GTM | Phase 4 |
| Deep CRO (FAQ, social proof, hero rewrite) | Backlog |
| CLS / image dimensions | Backlog (`09-SEO-AUDIT`) |

---

## 9. Контакты артефактов

| Документ | Путь |
|----------|------|
| Этот handoff | `.planning/phases/09-.../09-SEO-ENGINEER-HANDOFF.md` |
| Ads draft (keywords, RSA, negatives) | `09-ADS-ASSETS.md` |
| SEO audit | `09-SEO-AUDIT.md` |
| Decisions | `09-CONTEXT.md` |
| Verification | `09-VERIFICATION.md` |

**Вопросы по коду/deploy** → engineering.  
**Кампания, ставки, копирайт Ads, Search terms** → SEO / founder в Google Ads UI.

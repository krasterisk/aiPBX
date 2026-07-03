# GTM Content Plan — RU B2B (aipbx.ru)

Last updated: 2026-06-24.  
**Owner:** Solo founder publishes; agents draft content.

## Target audience

- Руководители колл-центров и отделов продаж
- IT-директора SMB
- Интеграторы Asterisk / IP-телефонии

## SEO keywords (priority)

| Keyword | Landing page |
|---------|--------------|
| голосовой AI ассистент | `/` |
| AI для колл-центра | `/speech-analytics` |
| голосовой бот Asterisk | `/voice-assistants` |
| анализ звонков менеджеров | `/speech-analytics` |
| речевая аналитика | `/speech-analytics` |
| автоответчик с ИИ | `/voice-assistants` |

## Content calendar (first 8 weeks)

| Week | Channel | Topic | Agent drafts |
|------|---------|-------|--------------|
| 1 | Site | Demo CTA on main landing | UI task GAP-42 |
| 2 | Habr | «Как мы построили AI PBX на Asterisk + NestJS» | Article draft |
| 3 | Case study | Колл-центр: −30% времени контроля QA | Interview founder |
| 4 | Telegram | Канал запуск + 3 поста о фичах | 3 post drafts |
| 5 | VC.ru | «Речевая аналитика без Data Science команды» | Article draft |
| 6 | Partner outreach | 10 писем интеграторам Asterisk | Email templates |
| 7 | YouTube/Rutube | 5-мин демо: первый бот за 15 мин | Script draft |
| 8 | Яндекс.Директ | Запуск по 5 ключевым запросам | Ad copy |

## Funnel goals (Яндекс.Метрика / GA4)

Configure via env: `YANDEX_METRIKA_ID`, `GA4_MEASUREMENT_ID`

| Goal | Event name | Trigger |
|------|------------|---------|
| Регистрация | `signup_complete` | Signup success |
| Первый ассистент | `assistant_created` | POST /assistants success |
| Первый звонок | `first_call` | Playground or CDR created |
| Оплата | `payment_success` | Balance top-up |

## Technical SEO checklist

- [x] `robots.txt` — `public/robots.txt`
- [x] `sitemap.xml` — `public/sitemap.xml`
- [x] Per-page meta — `usePageMeta` on public pages
- [ ] Submit sitemap to Яндекс.Вебмастер + Google Search Console (founder)
- [ ] Prerender/SSR for bots (Phase 4 — GAP-40)
- [ ] Schema.org JSON-LD on landing pages
- [ ] Replace docs screenshot placeholders (GAP-14)

## Sales materials to prepare

1. One-pager PDF (RU): продукт + цены + SBIS/счета
2. Demo script: 15 минут от регистрации до звонка
3. Comparison table: AI PBX vs IVR vs живой оператор
4. Partner commission proposal for Asterisk integrators

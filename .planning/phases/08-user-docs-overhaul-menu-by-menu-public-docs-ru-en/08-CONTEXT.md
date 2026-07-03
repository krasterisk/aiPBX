# Phase 8 — User docs overhaul

**Created:** 2026-07-03 via `/gsd-phase`

## Problem

`public/docs/` отстаёт от продукта: нет разделов по Звонкам, Базам знаний, Operator Analytics (Проекты/API), SIP Trunks; дашборды и аналитика описаны поверхностно; часть скриншотов устарела (GAP-14). Новый пользователь не понимает полный путь от регистрации до отчётов.

## Goal

Актуализировать in-app документацию по каждому пункту меню **кроме «Управление»**, на ru и en. Текст понятен без технического бэкграунда. Иллюстрации — макеты реальных экранов (redesign-v3), не абстрактные схемы.

## Menu coverage checklist

- [ ] **Дашборды** → Сводный, Аналитика ботов, Аналитика звонков
- [ ] **Звонки** → журнал CDR, фильтры, детали
- [ ] **AI Боты** → Ассистенты, Песочница, Функции, MCP, Базы знаний, Публикация (SIPs / Trunks / Виджеты)
- [ ] **Аналитика** → Проекты, API (токены, загрузка записей)
- [ ] **Оплата** → баланс, пополнение, организации
- [ ] **Пользователи** (owner) → приглашения, роли (кратко)
- [ ] **Исключено:** Управление (admin)

## Content rules

1. Пишем как инструкцию для оператора колл-центра, не для разработчика
2. Каждый раздел: «зачем», «как открыть», «типовой сценарий», «частые ошибки»
3. Без клише («мощный инструмент», «революционный подход»), без длинных тире
4. Термины из UI — в кавычках или таблице глоссария (README)
5. Скриншоты: `form-mockup` HTML → `scripts/capture-docs-screenshots.ts`

## Existing assets

| Asset | Path |
|-------|------|
| RU docs | `public/docs/ru/` |
| EN docs | `public/docs/en/` |
| Screenshot mocks | `public/docs/screenshots/` |
| Capture script | `scripts/capture-docs-screenshots.ts` |
| Intel index | `.planning/intel/DOCS-INDEX.md` |

## New files (expected)

| File | Topic |
|------|-------|
| `09-calls.md` | Звонки / CDR |
| `10-knowledge-bases.md` | Базы знаний |
| `11-operator-analytics.md` | Проекты + API аналитики |

## Out of scope

- Admin docs (helpdesk, PBX servers, AI models, prices)
- Developer docs (`docs/`, backend `.docs/`)
- GTM landing copy (Phase 4)
- Видео-туториалы

## Success criteria

- [ ] Оглавление README ru/en отражает все пункты меню (кроме admin)
- [ ] Каждый раздел проверен против живого UI (menubar routes)
- [ ] GAP-14 закрыт: актуальные макеты для ключевых экранов
- [ ] en-паритет с ru (не машинный перевод — адаптированный текст)

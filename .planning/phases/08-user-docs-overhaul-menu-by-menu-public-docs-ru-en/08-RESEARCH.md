# Phase 08 — Research: User docs overhaul

**Researched:** 2026-07-03  
**Domain:** In-app user documentation (`public/docs/`, `/docs` route)  
**Confidence:** HIGH (codebase-verified)

## RESEARCH COMPLETE

## Summary

Phase 8 is **frontend documentation + light code changes** to `DocumentationLayout`. No backend. Primary work: markdown content (ru/en/de/zh), sidebar structure aligned with menubar, HTML mockups + PNG generation, legacy cleanup.

## Current State

| Area | Finding |
|------|---------|
| Docs route | `DocsPage` → `DocumentationLayout` → fetches `/docs/{lang}/{NN-file}.md` |
| Sidebar | `DOC_SECTIONS` in `getDocumentationContent.ts` — **8 flat sections**, no menubar groups |
| i18n | `public/locales/{ru,en,de,zh}/docs.json` — keys for 8 sections only |
| Content | `public/docs/ru/` and `en/` have 01–08; **no de/zh folders** yet |
| Legacy | Root `public/docs/01-08.md` duplicates (D-16: remove) |
| Screenshots | `scripts/capture-docs-screenshots.ts` — 9 mocks; Phase 2 verification: low fidelity vs legacy placeholders |
| Menubar | `getMenubarItems.ts` — full tree including Calls, KB, OA, Publish sub-items |

## Gap Matrix (menubar vs docs)

| Menubar item | Doc file | Status |
|--------------|----------|--------|
| Дашборды (3 sub) | 06-dashboards.md | Exists, needs Phase 3 updates (insights, drill-down) |
| Звонки | — | **Missing** → 09-calls.md |
| AI Боты → Ассистенты | 02-assistants.md | Exists, audit |
| Песочница | 05-playground.md | Exists, audit |
| Функции | 03-tools.md | Exists, audit |
| MCP | 04-mcp-servers.md | Exists, audit |
| Базы знаний | — | **Missing** → 10-knowledge-bases.md |
| Публикация (SIP/Trunks/Widgets) | 07-publish.md | Partial — split trunks/widgets sections |
| Аналитика → Проекты, API | — | **Missing** → 11-operator-analytics.md |
| Оплата | 08-payments.md | Exists, audit Robokassa/SBIS |
| Пользователи (owner) | 01-getting-started.md | Add subsection |

## Implementation Approach

### 1. Sidebar restructure (D-01)

Replace flat `DOC_SECTIONS` with **nested groups** matching menubar:

```
dashboards (sub: overview, ai-analytics, call-records)
calls
ai-bots (sub: assistants, playground, tools, mcp, knowledge-bases, publish→sip/trunks/widgets)
analytics (sub: projects, api)
payments
getting-started (includes users subsection)
```

`SECTION_FILES` map adds:
- `calls` → `09-calls.md`
- `knowledge-bases` → `10-knowledge-bases.md`
- `analytics` → `11-operator-analytics.md`

`DocumentationSidebar` already supports `subsections` — extend `DOC_SECTIONS` type if nested publish group needs 3-level (group → publish → sip). **Recommendation:** flatten publish sub-items under `ai-bots` group as direct subsections (matches menubar depth).

### 2. Content template per section (D-11)

Each markdown file structure:

1. **Зачем** (1 short paragraph)
2. **Как открыть** (menu path with UI labels in quotes)
3. **Пошаговый сценарий** (numbered steps)
4. **Частые ошибки** (bullet list)
5. **form-mockup** block(s) — redesign-v3 colors (#4f46e5 accent, card layout per `DocumentationContent.module.scss`)
6. **См. также** — cross-links

**Tone:** operator-first; `### Для интеграторов` blocks in publish + analytics (D-10).

**Anti-patterns:** no «мощный инструмент», no em-dash (—), use hyphen or comma.

### 3. Illustrations (D-07, D-08, D-09)

- **Inline:** reuse `form-mockup` classes from `06-dashboards.md`
- **PNG:** extend `MOCKS` in `capture-docs-screenshots.ts`:
  - `calls` (table variant)
  - `knowledge-base` (modal)
  - `analytics-projects` (wizard)
  - `analytics-api` (modal/table)
  - `sip-trunks` (modal)
  - `widgets` (modal)
- Improve `renderMockHtml()` sidebar nav labels to match menubar RU strings
- Run: `npx ts-node scripts/capture-docs-screenshots.ts` (HTML mocks, no live auth)

### 4. Locales (D-06)

Create `public/docs/de/` and `public/docs/zh/` by copying structure from `en/`, then translate.
Add keys to `docs.json` for new sections: `doc_calls`, `doc_knowledge_bases`, `doc_analytics`, `doc_ai_bots`, group labels, publish sub-keys.

`fetchDocumentationMarkdown` fallback chain: requested lang → ru (unchanged).

### 5. API embed in analytics doc (D-14)

Source: `.idea/public_api_docs.md.resolved` — distill for end users:
- Token generation (UI path)
- `POST analyze-url` (single + batch)
- `POST analyze-file` / batch status
- Webhook mention (high level)
- Link to in-app `/dashboard/operator-analytics/api` for live token management

Do **not** duplicate full OpenAPI — keep ≤2 pages in user doc.

### 6. Phase 3 features to document in 06-dashboards / 11-operator-analytics

- AI Insights banner + drill-down to `/calls`
- Dashboard builder (project analytics)
- Custom metrics / tag cloud (if visible in UI)
- Operator usage / billing section in reports

Verify against live pages before writing.

## Validation Architecture

| Dimension | Approach |
|-----------|----------|
| Content completeness | Checklist in 08-CONTEXT.md menu coverage — all items `[x]` |
| i18n | All 4 `docs.json` have same key set |
| Nav parity | `DOC_SECTIONS` ids cover every non-admin menubar route |
| Screenshots | `ls public/docs/screenshots/*.png` ≥ 12 files; file size > 5KB each |
| Legacy | `public/docs/0*.md` at root absent |
| Lint | `npm run lint:ts` on touched TS files |

## Risks

| Risk | Mitigation |
|------|------------|
| 3-level nav in sidebar | Flatten publish under ai-bots subsections |
| de/zh translation quality | Adapt from en, founder review optional |
| Stale UI labels | Cross-check `getMenubarItems.ts` + route titles |
| GAP-14 repeat | Use improved HTML mocks, not procedural PNG fallback |

## Dependencies

- Phase 2: capture script exists
- Phase 3: analytics features described must match shipped UI

## Files to Modify (inventory)

| File | Change |
|------|--------|
| `src/widgets/DocumentationLayout/lib/getDocumentationContent.ts` | DOC_SECTIONS, SECTION_FILES |
| `public/locales/*/docs.json` | New i18n keys (4 locales) |
| `public/docs/{ru,en,de,zh}/*.md` | Content create/update |
| `public/docs/{ru,en,de,zh}/README.md` | TOC |
| `scripts/capture-docs-screenshots.ts` | New mock variants |
| `public/docs/screenshots/*` | Regenerated PNGs |
| `.planning/intel/DOCS-INDEX.md` | Post-phase update |
| Delete `public/docs/0[1-8].md` (root) | D-16 |

## RESEARCH COMPLETE

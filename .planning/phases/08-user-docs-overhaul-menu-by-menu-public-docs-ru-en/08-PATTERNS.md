# Phase 08 — Patterns

**Mapped:** 2026-07-03

## Pattern: Documentation sidebar section

**Analog:** `src/widgets/DocumentationLayout/lib/getDocumentationContent.ts` — existing `DOC_SECTIONS` + `SECTION_FILES`

**Apply to:** Extend with grouped sections; each `id` maps to one markdown file via `SECTION_FILES`.

## Pattern: form-mockup in markdown

**Analog:** `public/docs/ru/06-dashboards.md` lines 22–70

**CSS:** `src/widgets/DocumentationLayout/ui/DocumentationContent/DocumentationContent.module.scss` (`.form-mockup*`)

## Pattern: Docs i18n

**Analog:** `public/locales/ru/docs.json` — `doc_*` keys consumed by `DocumentationSidebar` via `useTranslation('docs')`

## Pattern: Screenshot capture

**Analog:** `scripts/capture-docs-screenshots.ts` — `MOCKS` + `renderMockHtml()` + Playwright screenshot

**Improve:** Add variants following existing `dashboard|modal|table|wizard|playground` pattern.

## Pattern: Menubar structure (source of truth for nav)

**Analog:** `src/widgets/Menubar/model/selectors/getMenubarItems.ts`

## PATTERN MAPPING COMPLETE

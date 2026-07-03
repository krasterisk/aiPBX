---
phase: 07
slug: helpdesk-admin-ticket-system-with-ai-intake-alfawebhook-clie
status: draft
shadcn_initialized: false
preset: redesign-v3-native
created: 2026-07-03
---

# Phase 07 — UI Design Contract

> Admin helpdesk operator UI — table + kanban, ticket detail with LLM context tabs. Derived from CONTEXT D-18–D-21 and existing redesign-v3 patterns.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (native SCSS) |
| Preset | redesign-v3-native |
| Component library | custom (`shared/ui/redesign-v3`) |
| Icon library | lucide-react |
| Font | project default (inherited from app shell) |

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps |
| sm | 8px | Chip/badge padding |
| md | 16px | Card padding, list gaps |
| lg | 24px | Section spacing |
| xl | 32px | Page header margin |
| 2xl | 48px | Kanban column gap |

Exceptions: use CSS vars `--space-1` through `--space-4` from existing redesign SCSS

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 14px | 400 | 1.5 |
| Label | 12px | 500 | 1.4 |
| Heading | 18px | 600 | 1.3 |
| Display (page title) | 24px | 600 | 1.2 |

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `--bg-redesigned` | Page background |
| Secondary (30%) | `--glass-overlay-medium` | Cards, kanban columns |
| Accent (10%) | `--accent-redesigned` | Primary CTA (Claim, Save), active tab |
| Destructive | `--destructive` or error token | Close ticket confirm only |

Accent reserved for: Claim button, Save note, active view toggle (table/kanban), priority urgent badge

### Status colors

| Status | Badge style |
|--------|-------------|
| new | neutral/blue tint |
| in_progress | accent outline |
| waiting_client | amber |
| resolved | green |
| closed | muted gray |

### Priority colors

| Priority | Visual |
|----------|--------|
| urgent | red badge |
| high | orange |
| normal | default |
| low | muted |

---

## Copywriting Contract

| Element | Copy (ru) | Copy (en) |
|---------|-----------|-----------|
| Primary CTA (pool) | «Взять в работу» | "Claim ticket" |
| View toggle table | «Таблица» | "Table" |
| View toggle kanban | «Канба» | "Kanban" |
| Empty state heading | «Заявок пока нет» | "No tickets yet" |
| Empty state body | «Новые обращения появятся здесь после звонков и чатов» | "New requests appear here from voice and chat intake" |
| Error state | «Не удалось загрузить заявки» + «Повторить» | "Failed to load tickets" + "Retry" |
| LLM tab summary | «Сводка» | "Summary" |
| LLM tab raw | «Контекст LLM» | "LLM context" |
| Destructive confirm | «Закрыть заявку?» | "Close this ticket?" |

---

## Screen Inventory

### `/admin/helpdesk` — List page

**Layout:**
- Page header: title "Helpdesk" + view toggle (Table | Kanban) right-aligned
- Filter bar: status Combobox (multi), category Combobox, priority Combobox, search Input (client name/INN/phone)
- Unassigned pool section (table view): rows with highlighted "unassigned" badge + Claim CTA per row
- Table columns: ID, Client, Category, Priority, Status, Assignee, Created, Actions
- Kanban: 4 columns (New, In progress, Resolved, Closed); cards show client name, category chip, priority badge, age

**Interactions:**
- Toggle persists in URL query `?view=table|kanban` or localStorage `helpdesk_view_mode`
- Claim: PATCH assignee to current admin; card moves from pool
- Row click → navigate `/admin/helpdesk/:id`

### `/admin/helpdesk/:id` — Detail page

**Layout:**
- Breadcrumb: Helpdesk / #{id}
- Header: status badge, priority badge, category, Claim (if unassigned)
- Two-column on desktop: left timeline (messages, transcript, status history); right client panel
- Client panel: alfawebhook fields (name, INN, pbxUrl link), phone numbers
- Tabs (D-16): Summary (rendered markdown) | LLM context (editable textarea, Save)
- Operator note Input + Add button
- Status actions: dropdown Combobox (in_progress, waiting_client, resolved, closed)

### Admin settings subsection (in detail or separate route `/admin/helpdesk/settings`)

- Notification emails: multi Input or comma-separated
- Telegram chat IDs: multi Input
- Save settings Button

---

## Component Mapping

| UI need | Use |
|---------|-----|
| Filters | `Combobox` multiple + searchable |
| Search | `Input` with Search icon addon |
| Buttons | `Button` redesign-v3 variants primary/ghost |
| Tooltips | `Tooltip` redesign-v3 |
| Cards | `@include glass-card-secondary` SCSS mixin |
| Client select (manual link) | `ClientSelectV3` if linking ticket to client |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not required |
| MUI | forbidden for new UI | per frontend-fsd rule |

---

## Accessibility

- Kanban cards keyboard-focusable; Enter opens detail
- View toggle as `role="tablist"`
- Status/priority badges include `aria-label`
- LLM context textarea labeled for screen readers

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS (ru+en table above)
- [x] Dimension 2 Visuals: PASS (screen inventory defined)
- [x] Dimension 3 Color: PASS (status/priority mapping)
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS (4px grid)
- [x] Dimension 6 Registry Safety: PASS (no shadcn)

**Approval:** approved 2026-07-03 (orchestrator-generated from CONTEXT D-18–D-21)

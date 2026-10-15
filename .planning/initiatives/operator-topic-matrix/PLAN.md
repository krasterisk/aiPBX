# Operator topic matrix

Revision: 4. Coordinator: Codex /root. Mode: codex-direct.

User scope: matrix of operators by topics with call drilldown; operator breakdown in topic panels and topic breakdown in operator panels; all available CDRs including missing topics/operators; hide matrix when project taxonomy is empty.

Tasks:
1. Add shared backend topic/operator normalization and full-period counts. Preserve quality scoring rules; counts include low/unusable records. Deduplicate each call's tags. Null represents missing topic/operator.
2. Add precise paginated CDR filters for missing topic/operator and topic intersection without the existing 5000-tag cap. Use the same stored JSON topic source as aggregates, with tenant/project/date scoping.
3. Extend frontend contract; add searchable/sortable matrix and reciprocal breakdowns with reusable call-list drilldown and navigation.
4. Verify aggregate edge cases, query filters, visibility, panel navigation and regression tests; scoped lint/type checks. Record baseline failures separately.

Required reads: project instructions, intel architecture/index, frontend architecture, dashboard/service/API/panel contracts. Dependencies: existing CDRs and metrics._topics, configured project.callTaxonomy. No AI reanalysis or DB schema change required.

Acceptance: counts include all filtered CDRs; unique total despite multiple topics; missing data included; no matrix without configured taxonomy; each nonzero cell opens exactly the matching calls with pagination and preserved filters; reciprocal panels reuse same counts; ru/en translations; existing dashboard interactions preserved.

## Revision 2: UI follow-up

User: move long hints into tooltips; place all topic/operator tables in tabs under "Темы звонков"; follow .docs/FRONTEND_ARCHITECTURE.md.
5. Consolidate overview, matrix, reciprocal breakdowns (with selectors) into the existing topics section using shared TabsPanel. User clarification: operator rating stays a separate section; do not include it in topic tabs. Preserve no-taxonomy behavior and call-panel navigation.
6. Reuse shared Tooltip, Button, Stack, Table, Textarea, Combobox and Check. Remove custom control/table replicas from the new matrix/breakdowns; preserve shadows; use responsive mixins. Tooltip all long explanatory topic/rating/call-list hints. Add all four locale translations.
7. Verify tab switching, selector/intersection navigation, hidden hints and keyboard/tooltips; frontend targeted regressions/types/lint and component browser views at mobile/tablet/desktop. Backend untouched in revision 2.

## Revision 3: unified main matrix (supersedes task 5 layout)

User approved continuing with one matrix instead of three main tables. Keep exactly two main topic tabs: "Темы" and "Операторы по темам". Remove standalone reciprocal tabs/selectors; retain reciprocal breakdowns in existing topic/operator panels. Operator names in the matrix open operator panels; cell/topic totals continue to open calls. Operator rating remains a separate section. Preserve missing-topic/operator buckets and no-taxonomy visibility. Tasks 6-7 remain applicable; backend untouched.


## Revision 4: visual hierarchy and topic charts

User requests more readable, expressive tables and graphical topic data. Tasks 8-10, coordinator only.
8. Style matrix, contextual breakdowns and separate operator ranking: contrasting headers, heat levels per topic column, identity accents, numeric badges, share bars and distinct project totals. Use existing shared UI, token palette/mixins; preserve actions, missing buckets, light/dark and responsive stacked rows without clipping shadows.
9. Add topic-volume bars with exact call drilldown and coverage donut (unique calls with at least one topic versus no topic). Include missing topics, zero and multi-topic cases; do not treat overlapping topic sums as mutually exclusive shares. Keep two existing main tabs, no new API/backend writes.
10. Verify chart counts/interactions, no-taxonomy/empty behavior, existing dashboard navigation, scoped types/lints, visual component preview at 600/800/desktop in light/dark. Preview artifacts under reports/unit/operator-topic-preview (ignored local evidence).

# Operator topic matrix

Revision: 6. Coordinator: Codex /root. Mode: codex-direct.

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


## Revision 5: scoped backend release (2026-10-15)

User explicitly authorizes a separate backend matrix commit, patch version increase and push with [deploy:3]. This supersedes prior no-commit/no-remote-write restrictions only for these scoped changes. Tasks 11-13, coordinator only.
11. Reconstruct the matrix-only backend diff on current HEAD; exclude unrelated helpdesk, insights, evidence, single-topic and build-info edits, including mixed service hunks. Preserve original working files and existing staged changes. Bump current package patch version.
12. Validate the exact candidate tree in an isolated local directory, including production TypeScript build, matrix/query/topic tests and dashboard regressions. Review staged diff/contracts and preserve hashes of excluded edits.
13. Commit only approved matrix paths and version, with [deploy:3] in the commit message; push the current backend branch without force. Verify remote commit and available deployment status, keeping local unrelated changes. No manual server mutations.


## Revision 6: frontend corrections (2026-10-15)

Task 14: align numeric matrix footers with body/header columns (including zero values), preserving stacked tablet/mobile labels; replace truncated numeric avatar labels with a neutral operator icon in matrix and rating, keeping name initials and navigation; remove all rating filters/state/controls, retaining header-click sorting and accessible header buttons on narrow screens. Coordinator only. Verify real component geometry at desktop and 600/800 px, numeric identity and sort/navigation regressions, scoped styles/lint/types. No new commit/push/deploy authorized for this frontend follow-up.

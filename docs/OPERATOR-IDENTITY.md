# Employee identity and internal number

Operator analytics cards and topic drill-downs use the optional stable `operatorId` returned by the backend. Names remain display labels; the per-call `operatorExtension` is shown separately in call lists/detail and can be supplied in manual uploads. Existing responses and links without identity continue using names. Same-name staff with distinct IDs keep distinct rows and drill-downs.

This frontend requires the compatible additive backend release first; target only aipbx.ru through GitHub Actions `[deploy:3]`. It does not change source credentials, models or GPU services. History backfill is a separately backed-up, account-scoped operation; recordings and metrics are not regenerated.

The API snapshot/generated declarations include optional identity/extension fields and ID query filters. Validate full unit tests, production build/prerender, ESLint and generated-type consistency before release, then verify the installed dashboard/filter flow. Coordinator/evidence is the helpdesk EM-20261019-333 identity plan; private production backups and staff mappings are never committed.

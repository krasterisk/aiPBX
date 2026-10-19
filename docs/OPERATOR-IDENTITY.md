# Employee identity and internal number

Operator analytics cards and topic drill-downs use the optional stable `operatorId` returned by the backend. Names remain display labels; the per-call `operatorExtension` is shown separately in call lists/detail and can be supplied in manual uploads. Existing responses and links without identity continue using names. Same-name staff with distinct IDs keep distinct rows and drill-downs.

This frontend requires the compatible additive backend release first; target only aipbx.ru through GitHub Actions `[deploy:3]`. It does not change source credentials, models or GPU services. History backfill is a separately backed-up, account-scoped operation; recordings and metrics are not regenerated.

The API snapshot/generated declarations include optional identity/extension fields and ID query filters. Validate full unit tests, production build/prerender, ESLint and generated-type consistency before release, then verify the installed dashboard/filter flow. Coordinator/evidence is the helpdesk EM-20261019-333 identity plan; private production backups and staff mappings are never committed.

aipbx.ru has restricted SSH. The RU-only Actions job publishes its ephemeral runner IPv4 and release identifiers, then waits up to 15 minutes for a verified, authorized IPv4/32 TCP/22 exception. The helper never edits the firewall or receives its credentials. Schedule automatic rule deletion after 20 minutes before opening access; remove it immediately after release. Other targets and existing trusted-address rules remain unchanged. See the corresponding backend release notes for the operator procedure.

# Documentation Screenshots

UI mocks for aiPBX docs (1280×800). Generated via `scripts/capture-docs-screenshots.ts`.

## Files

| File | Description |
|------|-------------|
| `dashboard.png` | Overview dashboard |
| `assistant-create.png` | Create assistant dialog |
| `assistant-publish-sip.png` | SIP URI publish |
| `tool-create.png` | HTTP tool create |
| `playground.png` | Playground test call |
| `reports-history.png` | Call history table |
| `calls.png` | Calls / CDR journal |
| `knowledge-base.png` | Knowledge bases list |
| `sip-trunks.png` | SIP trunk form |
| `widgets.png` | WebRTC widget |
| `project-wizard.png` | Analytics project wizard |
| `operator-dashboard.png` | Project analytics dashboard |
| `upload.png` | Upload recordings |
| `analytics-api.png` | Analytics API tokens |

## Regenerate

```bash
npx ts-node scripts/capture-docs-screenshots.ts
npx ts-node scripts/capture-docs-screenshots.ts --base-url=http://localhost:3000
```

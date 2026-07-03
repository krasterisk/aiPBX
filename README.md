# aiPBX Frontend

Cloud AI PBX platform — React 18, Feature-Sliced Design.

## Quick start

```bash
cp .env.example .env.local   # fill API_URL, keys
npm ci
npm run start:dev            # webpack dev server
```

## Scripts

| Script | Purpose |
|--------|---------|
| `start:dev` | Dev server (reads `.env.local`) |
| `build:prod` | Production build |
| `lint:ts` | ESLint |
| `test:unit` | Jest unit tests |
| `generate:api-types` | OpenAPI types from backend `openapi.json` |

## Planning (GSD)

Agent planning root: [`.planning/`](.planning/) — see `PROJECT.md`, `ROADMAP.md`, `intel/`.

Backend sibling repo: `../aiPBX_backend`

## Deploy

Push to `master` with tag `[deploy all]` or `[deploy:1|2|3]` in commit message.

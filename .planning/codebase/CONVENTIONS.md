# Coding Conventions

**Analysis Date:** 2026-06-24

Covers both repositories:
- **Frontend:** `c:\Users\Professional\WebstormProjects\aiPBX`
- **Backend:** `c:\Users\Professional\WebstormProjects\aiPBX_backend`

---

## Frontend (`aiPBX`)

### Architecture

Use **Feature-Sliced Design** with enforced layer boundaries (`app → pages → widgets → features → entities → shared`). Rules live in `.cursor/rules/frontend-fsd.mdc` and are enforced by custom ESLint plugins in `.eslintrc.js`.

**Import rules (prescriptive):**
- Import only from slice **public API** (`index.ts`) across layers — enforced by `krasterisk-plugin/public-api-imports`.
- Respect FSD layer order — enforced by `krasterisk-plugin/layer-imports`.
- Use `@/` path alias only — enforced by `krasterisk-plugin/path-checker`.
- In tests/stories, public-api rule is relaxed for files matching `**/*.test.*`, `**/*.story.*`, `**/StoreDecorator.tsx`.

### Naming Patterns

**Files:**
- React components: `PascalCase.tsx` — e.g. `src/shared/ui/redesign-v3/Button/Button.tsx`
- Redux slices: `{name}Slice.ts` — e.g. `src/features/Auth/model/slice/loginSlice.ts`
- Selectors: one folder per selector — `getLoginIsLoading/getLoginIsLoading.ts` with co-located `getLoginIsLoading.test.ts`
- API modules: `{entity}Api.ts` — e.g. `src/entities/User/api/usersApi.ts`
- Types/schemas: `{name}Schema.ts`, `{name}.ts` in `model/types/`
- SCSS modules: `{Component}.module.scss` co-located with component
- Lib utilities: `camelCase.ts` — e.g. `src/shared/lib/classNames/classNames.ts`
- Tests: co-located `*.test.ts` or `*.test.tsx`

**Functions:**
- Selectors: `get{Property}` — e.g. `getLoginIsLoading`, `getUserAuthData`
- Redux actions: verb phrases via `createSlice` reducers — `setUsername`, `setError`
- Hooks: `use{Feature}` — e.g. `useUserFilters`, `useBatchProgress`
- Event handlers in components: `on{Action}` props, `handle{Action}` local functions

**Variables:**
- `camelCase` for locals and state fields
- Prefix unused args/vars with `_` (ESLint ignores them)
- Redux slice `name` field: lowercase single word — e.g. `name: 'login'`

**Types:**
- Schema interfaces: `{Feature}Schema` — e.g. `LoginSchema`, `StateSchema`
- Entity types: PascalCase nouns — e.g. `User`, `Report`, `Analytics`
- Component props: `{Component}Props` — e.g. `ButtonProps`
- RTK tag types: PascalCase strings in `tagTypes` — e.g. `'Reports'`, `'OperatorAnalytics'`
- Use `DeepPartial<T>` from `@reduxjs/toolkit` for partial test/store state

**Constants:**
- Route helpers: `getRoute{Page}` in `src/shared/const/router`
- Enum-like values: `{Entity}{Field}Values` — e.g. `UserRolesValues` in `model/consts/consts.ts`

### Code Style

**Formatting:**
- Tool: Prettier `2.8.8` (`npm run prettier` in `package.json`)
- No committed `.prettierrc` — Prettier defaults apply
- TypeScript/TSX: **no semicolons**, **2-space indent** (observed across `src/`)
- SCSS: **4-space indent** per `.stylelintrc.json`

**Linting:**
- Config: `.eslintrc.js`
- Run: `npm run lint:ts` (Definition of Done gate per `.planning/DOD.md`)
- Fix: `npm run lint:ts:fix`
- SCSS: `npm run lint:scss` via Stylelint with `stylelint-config-standard-scss`
- Pre-commit: `lint-staged` runs Prettier + ESLint on `**/*.{ts,tsx}`

**Key ESLint rules:**
- `react-hooks/rules-of-hooks`: error
- `react-hooks/exhaustive-deps`: warn
- `i18next/no-literal-string`: warn in components (disabled in tests/stories)
- `unused-imports/no-unused-imports`: error
- Many `@typescript-eslint/strict-*` rules intentionally off — project uses `strict: true` in `tsconfig.json` but relaxed ESLint

**TypeScript:**
- Config: `tsconfig.json` — `strict: true`, `noImplicitAny: true`, path alias `@/* → ./src/*`
- Compile target: `es5`, module: `ESNext`
- Global build-time constants declared in `src/app/types/global.d.ts` — `__API__`, `__IS_DEV__`, `__SENTRY_DSN__`, etc.

### Import Organization

**Order (prescriptive):**
1. React / third-party packages
2. `@/` absolute imports (FSD public APIs)
3. Relative imports (`./`, `../`)
4. Styles last — `import cls from './Button.module.scss'`

**Path aliases:**
- `@/*` → `src/*` (tsconfig + webpack + Jest `moduleNameMapper`)

**Barrel exports:**
- Each FSD slice exposes a public API via `index.ts` — e.g. `src/entities/User/index.ts` re-exports reducer, selectors, types, hooks, and RTK hooks
- Do not deep-import across layer boundaries outside tests

### Module / Component Design

**React components:**
- Wrap exported components in `memo(forwardRef(...))` for shared UI — see `src/shared/ui/redesign-v3/Button/Button.tsx`
- Use `classNames()` helper from `src/shared/lib/classNames/classNames.ts` for conditional CSS module classes
- New shared UI goes in `src/shared/ui/redesign-v3/` only — do not add to `shared/ui/deprecated/`
- Prefer `redesign-v3` over raw MUI where equivalents exist

**Redux:**
- Slices via `createSlice` with explicit `initialState` typed to schema interface
- Export pattern:
  ```typescript
  export const { actions: loginActions } = loginSlice
  export const { reducer: loginReducer } = loginSlice
  ```
- Async logic: `createAsyncThunk` in `model/service/` — e.g. `src/features/Dashboard/model/services/initDashboardPage.ts`
- RTK Query: inject endpoints into shared `rtkApi` from `src/shared/api/rtkApi.ts` via `injectEndpoints` in `entities/*/api/*Api.ts`

**Public API files:**
- Re-export only what other layers need
- Keep UI components, hooks, types, and API hooks together in entity `index.ts`

### Error Handling

**React render errors:**
- Top-level `ErrorBoundary` in `src/app/providers/ErrorBoundary/ui/ErrorBoundary.tsx`
- Reports to Sentry via `src/shared/config/sentry/initSentry.ts`
- Auto-reloads once on `ChunkLoadError` (stale deployment chunks)
- Falls back to `PageError` widget

**API / network errors:**
- RTK Query uses `fetchBaseQuery` in `src/shared/api/rtkApi.ts` with Bearer token from `localStorage`
- Components handle mutation/query errors locally; common pattern checks `err?.status` before showing toast
- User feedback via `react-toastify` — `toast.success()`, `toast.error()` (e.g. `src/features/OperatorAnalytics/ui/OperatorApiTokens/OperatorApiTokens.tsx`)
- Optimistic updates undo on failure — e.g. `onQueryStarted` + `queryFulfilled.catch(patchResult.undo)` in `src/entities/Report/api/reportApi.ts`

**Fatal bootstrap:**
- Throw explicit `Error` when root container missing — `src/index.tsx`

### Logging

**Production errors:** Sentry (`@sentry/react`) initialized in `src/shared/config/sentry/initSentry.ts`

**Development:** No structured frontend logger; avoid `console.log` in committed code (not ESLint-enforced)

### Comments

**When to comment:**
- Non-obvious business logic (e.g. optimistic cache merge in RTK Query)
- JSDoc on shared UI prop interfaces where variant/size semantics matter — see `Button.tsx`

**Avoid:** narrating obvious code; Russian comments exist in legacy files but new comments should match surrounding file language

### i18n

- Keys in `public/locales/en/` and `public/locales/ru/`
- Use `useTranslation()` / `t('key')` — no hardcoded user-visible strings in components
- Test i18n: `src/shared/config/i18n/i18nTest` via `I18nextProvider` in `componentRender`
- Mock pattern in component tests:
  ```typescript
  jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'ru' } })
  }))
  ```

### Test IDs

- Use `data-testid` for E2E and component queries
- Cypress helper: `cypress/helpers/selectByTestId.ts`
- ESLint i18n rule ignores `data-testid` attribute

---

## Backend (`aiPBX_backend`)

### Architecture

NestJS 11 feature modules in `src/<feature>/` with `.module.ts`, `.controller.ts`, `.service.ts`. Conventions in `.cursor/rules/backend-nestjs.mdc`.

**Module layout (prescriptive):**
```
src/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── dto/
├── *.model.ts          # Sequelize models (where applicable)
├── lib/                # Pure utilities (*.util.ts)
└── <feature>.service.spec.ts
```

### Naming Patterns

**Files:**
- Services/controllers/modules: `{feature}.service.ts`, `{feature}.controller.ts`, `{feature}.module.ts`
- DTOs: `{action}-{entity}.dto.ts` or `{name}.dto.ts` in `dto/` — e.g. `src/users/dto/create-user.dto.ts`
- Unit tests: `{source}.spec.ts` co-located — e.g. `src/auth/auth.service.spec.ts`
- Pure libs: `kebab-case.ts` in `lib/` — e.g. `src/operator-analytics/lib/assess-transcription-quality.ts`
- Util suffix for helpers: `*.util.ts` — e.g. `balance-notification.util.ts`
- Tasks/cron: `*.task.ts` — e.g. `src/billing/billing-runway.task.ts`

**Classes:**
- PascalCase with Nest suffix — `AuthService`, `AuthController`, `CreateUserDto`
- Guards: `{Name}Guard` — `JwtAuthGuard`, `RolesGuard`, `ApiTokenGuard`

**Methods:**
- `camelCase` async service methods — `login`, `accumulateRealtimeTokens`
- Private helpers: `private` + `camelCase` — e.g. `safeRecordAcceptance` in `src/auth/auth.service.ts`

**Database fields:**
- `snake_case` in Sequelize models — e.g. `vpbx_user_id`, `activationCode` mixed (legacy); new code follows existing model

### Code Style

**Formatting:**
- Prettier `^3.5.1` — `npm run format` targets `src/**/*.ts` and `test/**/*.ts`
- No committed `.prettierrc` — Prettier defaults
- **Semicolons used**, **4-space indent** (observed in `src/`)

**Linting:**
- Flat config: `eslint.config.js` (ESLint 9)
- Run: `npm run lint` (auto-fixes with `--fix`)
- Minimal custom rules: `unused-imports/no-unused-imports` error; `@typescript-eslint/no-explicit-any` off
- `@darraghor/eslint-plugin-nestjs-typed` listed in devDependencies but not active in flat config

**TypeScript:**
- Config: `tsconfig.json` — `strictNullChecks: false`, `noImplicitAny: false` (looser than frontend)
- Decorators enabled: `experimentalDecorators`, `emitDecoratorMetadata`
- Module: `commonjs`, target: `es6`

### Import Organization

**Order (prescriptive):**
1. `@nestjs/*` framework imports
2. Third-party packages
3. Relative imports from sibling modules (`../users/users.service`)
4. Local relative imports (`./dto/...`)

**Style:** double-quote imports common in services; semicolon-terminated

### DTOs & Validation

- Class-based DTOs with `class-validator` decorators and `@ApiProperty` for Swagger
- Example pattern in `src/users/dto/create-user.dto.ts`:
  ```typescript
  export class CreateUserDto {
    @ApiProperty({ example: 'user@domain.com', description: 'E-mail address' })
    @IsString({ message: 'Must be a string' })
    @IsEmail({}, { message: 'Incorrect email' })
    readonly email?: string
  }
  ```
- Nested DTOs: `@ValidateNested()` + `@Type(() => ChildDto)`
- Global API prefix `/api` (documented in backend rules)

### Guards & Authorization

- Apply `@UseGuards(JwtAuthGuard)` or `@UseGuards(RolesGuard)` on controller methods — e.g. `src/legal/legal.controller.ts`, `src/ai-cdr/ai-cdr.controller.ts`
- Tenant scoping: always filter by `vpbxUserId`; cache keys must include tenant id (high-risk rule)

### Error Handling

**HTTP errors:**
- Throw `HttpException` with message + `HttpStatus` — primary pattern in services
  ```typescript
  throw new HttpException('Email is empty!', HttpStatus.BAD_REQUEST)
  ```
- Auth failures: `UnauthorizedException` — e.g. Telegram hash validation in `src/auth/auth.service.ts`
- Log warning before throw for expected client errors:
  ```typescript
  this.logger.warn('Email is empty')
  throw new HttpException('Email is empty!', HttpStatus.BAD_REQUEST)
  ```

**Non-fatal side effects:**
- Wrap in try/catch, log warning, continue — e.g. `safeRecordAcceptance` in `AuthService` does not fail login on legal acceptance persistence error

**Email/external failures:**
- Return `{ success: false }` or throw depending on caller contract — mailer throws `HttpException` on send failure

### Logging

**Framework:** NestJS `Logger` per class
```typescript
private readonly logger = new Logger(AuthService.name);
this.logger.warn('Email not found!');
```

**Audit:** `LoggerService` for user action audit trail (injected into services like `AuthService`)

### Comments

- Section dividers in large spec files and services (`// ═══ login ═══`)
- Russian comments present in legacy auth flow — match file language for new edits
- Swagger `@ApiOperation` on non-obvious endpoints

### Sequelize Models

- Models in `*.model.ts` with `@Table`, column decorators
- Inject via `@InjectModel(Model)` / `getModelToken(Model)` in services and tests

---

## Cross-Repo Conventions

| Concern | Frontend | Backend |
|---------|----------|---------|
| Lint gate (DoD) | `npm run lint:ts` | `npm run lint` |
| Unit tests (DoD) | `npm run test:unit` | `npm test` |
| API types | `src/shared/api/generated/schema.d.ts` via `npm run generate:api-types` | `openapi.json` exported via `npm run swagger:export` |
| Error tracking | Sentry React | Sentry NestJS (`@sentry/nestjs`) |
| Date placeholder | Use `2026-06-24` format in planning docs | Same |

**API contract changes (both repos):**
1. Update backend DTO + `@ApiProperty`
2. Regenerate or update frontend entity types + RTK endpoint
3. Add backend service unit test for business logic
4. Update `.planning/intel/API-MAP.md` for new endpoints

---

*Convention analysis: 2026-06-24*

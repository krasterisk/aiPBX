# Testing Patterns

**Analysis Date:** 2026-06-24

Covers both repositories:
- **Frontend:** `c:\Users\Professional\WebstormProjects\aiPBX`
- **Backend:** `c:\Users\Professional\WebstormProjects\aiPBX_backend`

---

## Test Framework Overview

| Layer | Frontend | Backend |
|-------|----------|---------|
| Unit runner | Jest `^29.4.2` + ts-jest | Jest `29.7.0` + ts-jest |
| Environment | jsdom | node |
| Component testing | `@testing-library/react` `^13.4.0` | N/A |
| Nest DI testing | N/A | `@nestjs/testing` `^11.0.10` |
| E2E (browser) | Cypress `^12.12.0` | Supertest `^7.0.0` (configured, no specs) |
| Visual regression | Loki + Storybook | Not used |

---

## Frontend (`aiPBX`)

### Test Framework

**Runner:**
- Jest `^29.4.2` with `ts-jest` preset
- Config: `config/jest/jest.config.ts`
- Setup: `config/jest/jest-setup.ts` (jest-dom matchers + `window.scrollTo` mock)

**Assertion library:**
- Jest built-in `expect`
- `@testing-library/jest-dom` matchers — `toBeInTheDocument()`, `toHaveClass()`

**Run commands:**
```bash
npm run test:unit              # All unit tests (DoD gate)
npm run test:e2e               # Cypress interactive (cypress open)
npm run test:ui                # Loki visual regression
npm run test:ui:ci             # Loki CI against storybook-static
npm run storybook              # Storybook dev for visual tests
```

### Test File Organization

**Location:** Co-located with source — `*.test.ts` / `*.test.tsx` next to implementation

**Naming:** `{moduleName}.test.ts` or `{moduleName}.test.tsx`

**Current coverage:** 21 unit test files under `src/` (sparse relative to codebase size)

**Structure examples:**
```
src/features/Auth/model/
├── slice/loginSlice.ts
├── slice/loginSlice.test.ts
└── selectors/login/getLoginIsLoading/
    ├── getLoginIsLoading.ts
    └── getLoginIsLoading.test.ts

src/shared/lib/classNames/
├── classNames.ts
└── classNames.test.ts

src/app/providers/router/ui/
├── AppRouter.tsx
└── AppRouter.test.tsx
```

**Match pattern:** `src/**/*(*.)@(spec|test).[tj]s?(x)` per Jest config

### Test Structure

**Pure function / lib tests:**
```typescript
// src/shared/lib/classNames/classNames.test.ts
import { classNames } from './classNames'

describe('classNames', () => {
  test('only first param', () => {
    expect(classNames('someClass')).toBe('someClass')
  })

  test('with mods and one false', () => {
    const expected = 'someClass class1 class2 hovered'
    expect(classNames('someClass', { hovered: true, hz: false }, ['class1', 'class2'])).toBe(expected)
  })
})
```

**Redux slice tests:**
```typescript
// src/features/Auth/model/slice/loginSlice.test.ts
import { LoginSchema } from '../types/loginSchema'
import { loginActions, loginReducer } from './loginSlice'

describe('loginSlice.test', () => {
  test('test set username', () => {
    const state: DeepPartial<LoginSchema> = { username: 'admin' }
    expect(loginReducer(state as LoginSchema, loginActions.setUsername('admin')))
      .toStrictEqual({ username: 'admin' })
  })
})
```

**Selector tests:**
```typescript
// src/features/Auth/model/selectors/login/getLoginIsLoading/getLoginIsLoading.test.ts
import { StateSchema } from '@/app/providers/StoreProvider'
import { getLoginIsLoading } from './getLoginIsLoading'

describe('getLoginIsLoading.test', () => {
  test('should return true', () => {
    const state: DeepPartial<StateSchema> = { loginForm: { isLoading: true } }
    expect(getLoginIsLoading(state as StateSchema)).toEqual(true)
  })

  test('work with empty state', () => {
    expect(getLoginIsLoading({} as StateSchema)).toEqual(false)
  })
})
```

**Patterns:**
- Use `describe` + `test` (not `it`) in frontend tests
- Cast partial state with `DeepPartial<T>` then `as FullType`
- Slice tests pass partial state directly to reducer (RTK allows this in tests)

### Component / Integration Tests

**Render helper:** `src/shared/lib/tests/componentRender/componentRender.tsx`

Wraps component with:
- `MemoryRouter` (configurable `route`)
- `StoreProvider` (configurable `initialState`, `asyncReducers`)
- `I18nextProvider` (test i18n instance)
- `ThemeProvider`

```typescript
// src/app/providers/router/ui/AppRouter.test.tsx
import { componentRender } from '@/shared/lib/tests/componentRender/componentRender'
import { screen } from '@testing-library/react'

jest.mock('@/pages/MainPage', () => ({
  MainPage: () => <main data-testid="MainPage" />,
}))

describe('app/router/AppRouter', function () {
  test('Redirect not auth user to MainPage', async () => {
    componentRender(<AppRouter />, {
      route: getRoutePayment(),
      initialState: {}
    })
    const page = await screen.findByTestId('MainPage')
    expect(page).toBeInTheDocument()
  })
})
```

**Simple component tests:** use `render` from `@testing-library/react` directly — `src/shared/ui/redesigned/Button/Button.test.tsx`

**Complex component tests:** mock i18n, provide fixture data — `src/entities/Report/ui/ReportShowAnalytics/ReportShowAnalytics.test.tsx`

### Mocking

**Framework:** Jest built-in `jest.mock`, `jest.fn`, `jest.mocked`

**Module mocks (pages/routes):**
```typescript
jest.mock('@/pages/MainPage', () => ({
  MainPage: () => <main data-testid="MainPage" />,
}))
```

**i18n mock:**
```typescript
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'ru', changeLanguage: jest.fn() }
  })
}))
```

**Axios / async thunks:** `src/shared/lib/tests/TestAsyncThunk/TestAsyncThunk.ts`
```typescript
jest.mock('axios')
const mockedAxios = jest.mocked(axios)

export class TestAsyncThunk<Return, Arg, RejectedValue> {
  dispatch = jest.fn()
  getState: () => StateSchema
  api: jest.MockedFunctionDeep<AxiosStatic>
  navigate = jest.fn()

  constructor(actionCreator, state?: DeepPartial<StateSchema>) { /* ... */ }

  async callThunk(arg: Arg) {
    const action = this.actionCreator(arg)
    return action(this.dispatch, this.getState, { api: this.api, navigate: this.navigate })
  }
}
```

**Jest config mocks:**
- CSS/SCSS → `identity-obj-proxy`
- SVG → `config/jest/jestEmptyComponent.tsx`
- `@/` → `<rootDir>/src/$1`

**Global test constants** (in `config/jest/jest.config.ts` `globals`):
- `__API__`, `__IS_DEV__`, `__PROJECT__: 'jest'`, `__SENTRY_DSN__`, etc.

**What to mock:**
- Page components in router tests (isolate routing logic)
- `react-i18next` when testing components with `t()` calls
- `axios` for `createAsyncThunk` services via `TestAsyncThunk`
- External pages/layers to respect FSD boundaries in unit scope

**What NOT to mock:**
- Reducers/selectors under test
- `classNames` and pure utilities
- Testing Library queries — prefer `getByTestId`, `getByText`, `findByTestId`

### Fixtures and Factories

**Inline fixtures** in test files — e.g. `operatorAnalytics` object in `ReportShowAnalytics.test.tsx`

**Cypress fixtures:** `cypress/fixtures/*.json` — `profile.json`, `manuals.json`

**No shared factory library** — create typed objects inline or in test file `// ── Fixtures ──` sections

### Coverage

**Requirements:** No enforced coverage threshold in Jest config

**Provider:** `v8` (`coverageProvider: 'v8'` in Jest config)

**HTML report:** `jest-html-reporters` writes to `reports/unit/report.html`

**View coverage:** Not configured via npm script — add `jest --coverage` if needed

### E2E Tests (Cypress)

**Location:** `cypress/e2e/`

**Config:** `cypress/tsconfig.json`, support files in `cypress/support/`

**Run:** `npm run test:e2e` (opens Cypress UI — not headless CI by default)

**Custom commands:** `cypress/support/commands.ts` aggregates `common`, `profile`, `manual`, `rating` command modules

**Auth helper:** `cy.login()` in `beforeEach` for authenticated flows — `cypress/e2e/common/routing.cy.ts`

**Selector pattern:**
```typescript
// cypress/helpers/selectByTestId.ts
cy.get(selectByTestId('MainPage')).should('exist')
```

**Component tests:** `cypress/component/EditableProfileCard.cy.tsx`

### Visual / Storybook Tests

**Storybook:** `config/storybook/`, run via `npm run storybook`

**Loki:** visual regression against Storybook builds — `package.json` `loki` config with Chrome Docker targets

**Store decorator for stories:** `src/shared/config/storybook/StoreDecorator/StoreDecorator.tsx` accepts `DeepPartial<StateSchema>`

### Test Types Summary

| Type | Framework | When to add |
|------|-----------|-------------|
| Unit (lib/slice/selector) | Jest | Every pure function, reducer, selector with branching logic |
| Component | Jest + RTL | Router guards, conditional render, form validation display |
| E2E | Cypress | Auth flows, critical navigation (manual/CI optional) |
| Visual | Loki + Storybook | New `redesign-v3` shared components (DoD item) |

---

## Backend (`aiPBX_backend`)

### Test Framework

**Runner:**
- Jest `29.7.0` with `ts-jest`
- Config embedded in `package.json` `jest` key
- `rootDir: "src"`, `testRegex: ".*\\.spec\\.ts$"`, `testEnvironment: "node"`

**Assertion library:** Jest built-in `expect`

**Run commands:**
```bash
npm test                       # All unit tests (DoD gate)
npm run test:watch             # Watch mode
npm run test:cov               # Coverage report → coverage/
npm run test:debug             # Node inspect + runInBand
npm run test:e2e               # E2E config (no specs present)
```

### Test File Organization

**Location:** Co-located `*.spec.ts` next to source in `src/`

**Naming:** `{service|lib|util}.spec.ts` — NOT `.test.ts`

**Current coverage:** 47 spec files across billing, auth, operator-analytics, accounting, users, mailer, ari, etc.

**Structure examples:**
```
src/auth/
├── auth.service.ts
└── auth.service.spec.ts

src/operator-analytics/lib/
├── assess-transcription-quality.ts
└── assess-transcription-quality.spec.ts

src/billing/
├── billing.service.ts
├── billing-fx.service.ts
├── billing-fx.service.spec.ts
└── billing-runway.util.spec.ts
```

### Test Structure

**Pure lib tests (no Nest DI):**
```typescript
// src/operator-analytics/lib/assess-transcription-quality.spec.ts
import { assessTranscriptionQuality, DEFAULT_TRANSCRIPTION_QUALITY_THRESHOLDS } from './assess-transcription-quality';

describe('assessTranscriptionQuality', () => {
    const thresholds = DEFAULT_TRANSCRIPTION_QUALITY_THRESHOLDS;

    it('returns ok for healthy transcript with strong STT signals', () => {
        const result = assessTranscriptionQuality({
            text: 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen',
            avgLogprob: -0.4,
            noSpeechProb: 0.1,
        }, thresholds);

        expect(result.quality).toBe('ok');
        expect(result.confidence).toBeGreaterThan(0.8);
    });
});
```

**NestJS service tests:**
```typescript
// src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
    let service: AuthService;
    let mockUsersService: any;

    const mockUser = {
        id: 1,
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        mockUsersService = { getCandidateByEmail: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                // ... other providers with useValue mocks
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    describe('login', () => {
        it('should throw when email is empty', async () => {
            await expect(service.login({ email: '' })).rejects.toThrow(HttpException);
        });
    });
});
```

**Sequelize model mocking:**
```typescript
import { getModelToken } from '@nestjs/sequelize';
import { AiCdr } from '../ai-cdr/ai-cdr.model';

{ provide: getModelToken(AiCdr), useValue: mockAiCdrRepository }
```

**Patterns:**
- Use `describe` + `it` (not `test`) in backend specs
- Nested `describe` blocks per public method — e.g. `describe('login', () => ...)`
- Section comment banners in large specs (`// ═══ login ═══`)
- `beforeEach` resets mock call counts and default return values
- `mockResolvedValue`, `mockReturnValue` for async dependencies

### Mocking

**Framework:** Jest + NestJS `Test.createTestingModule` with `{ provide: Token, useValue: mock }`

**Service mocks:** Plain objects with `jest.fn()` methods — typed as `any` for brevity

**Sequelize model mocks:** Objects with `findOne`, `findOrCreate`, `increment`, `update` as `jest.fn()`

**Environment variables:** Save/restore in `try/finally` — see Telegram hash tests in `auth.service.spec.ts`:
```typescript
const prevToken = process.env.TELEGRAM_BOT_TOKEN;
process.env.TELEGRAM_BOT_TOKEN = botToken;
try {
    // test
} finally {
    if (prevToken === undefined) delete process.env.TELEGRAM_BOT_TOKEN;
    else process.env.TELEGRAM_BOT_TOKEN = prevToken;
}
```

**Crypto helpers:** Define test-only helpers inside spec file — `buildTelegramHash()` in `auth.service.spec.ts`

**transformIgnorePatterns:** `node_modules/(?!(socks-proxy-agent)/)` for ESM deps

**What to mock:**
- All injected services and repositories
- `save`/`update`/`increment` on Sequelize model instances
- External mail/telegram/logger calls

**What NOT to mock:**
- Pure functions under test in `lib/*.spec.ts`
- The service class itself

### Fixtures and Factories

**Inline mock objects** at top of spec — `mockUser`, `mockCdr`, `mockRecord` in `billing.service.spec.ts`

**Eval fixtures:** typed arrays in `operator-analytics/eval/eval-metrics.spec.ts`

**No shared test fixtures directory** — keep fixtures co-located in spec files

### Coverage

**Requirements:** No enforced threshold; DoD requires unit tests for new service business logic

**Collect:** `npm run test:cov` — `collectCoverageFrom: ["**/*.(t|j)s"]`, output `coverage/`

**Priority areas with strong coverage:**
- `src/billing/` — multiple service + util specs
- `src/operator-analytics/` — lib + service + eval specs
- `src/auth/auth.service.spec.ts` — comprehensive auth flows
- `src/accounting/` — XML, PDF, SBIS specs

### E2E Tests

**Config:** `test/jest-e2e.json` — `testRegex: ".e2e-spec.ts$"`, `testEnvironment: "node"`

**Run:** `npm run test:e2e` with `cross-env NODE_ENV=production`

**Status:** No `*.e2e-spec.ts` files present in `test/` — infrastructure only

**Tool available:** `supertest` for HTTP integration tests when added

### Eval / Offline Tests

**Operator analytics eval:** `src/operator-analytics/eval/eval-metrics.spec.ts` + `npm run eval:operator` script for offline LLM eval runs (not part of standard `npm test` CI unless included)

---

## Cross-Repo Testing Conventions

### Definition of Done (`.planning/DOD.md`)

| # | Requirement | Verify |
|---|-------------|--------|
| 1 | TypeScript lint | FE: `npm run lint:ts` · BE: `npm run lint` |
| 2 | Unit tests pass | FE: `npm run test:unit` · BE: `npm test` |
| 10 | Service logic test | BE: add `*.spec.ts` for new business methods |
| 15 | Billing tests | BE: unit tests on billing service changes |

### When to Add Tests

**Frontend — add unit test when:**
- New pure lib function with branching logic (`src/shared/lib/`, `entities/*/lib/`)
- New Redux reducer or selector with non-trivial defaults
- RTK cache merge / serialization helpers
- Router guard behavior changes

**Frontend — add component test when:**
- Route access rules change (`AppRouter`)
- Component renders significantly different trees based on props/state

**Backend — add spec when (required by `.cursor/rules/backend-nestjs.mdc`):**
- Every new service method with business logic
- New pure lib/utility in `lib/` or `*.util.ts`
- Billing, auth, accounting changes (high-risk)
- DTO validation edge cases for critical paths

### Test Naming Conventions

| Repo | Suite | Case |
|------|-------|------|
| Frontend | `describe('classNames')` | `test('with mods and one false')` |
| Backend | `describe('AuthService')` | `it('should throw when email is empty')` |

Backend prefers `should {behavior}` phrasing; frontend uses shorter `test('description')` labels.

### Common Patterns

**Async error testing (backend):**
```typescript
await expect(service.login({ email: '' })).rejects.toThrow(HttpException);

try {
    await service.activate({ activationCode: '', email: 'test@example.com' });
} catch (e) {
    expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
}
```

**Async component testing (frontend):**
```typescript
const page = await screen.findByTestId('AboutPage')
expect(page).toBeInTheDocument()
```

**Partial Redux state (frontend):**
```typescript
const state: DeepPartial<StateSchema> = { loginForm: { isLoading: true } }
expect(getLoginIsLoading(state as StateSchema)).toEqual(true)
```

### Test Coverage Gaps (known)

| Area | Repo | Risk |
|------|------|------|
| Most RTK Query endpoints | Frontend | High — API integration untested at unit level |
| Most page/widget components | Frontend | Medium — rely on manual QA |
| `src/ari/`, `src/rtp-udp-server/` runtime | Backend | High — limited to `ari.service.spec.ts` |
| E2E HTTP flows | Backend | Medium — no e2e specs committed |
| Cypress E2E | Frontend | Low-Medium — exists but not in DoD CI gate |

### Adding New Tests — File Placement

| What | Frontend path | Backend path |
|------|---------------|--------------|
| Lib util test | `{lib}/{name}.test.ts` | `{lib}/{name}.spec.ts` or `{name}.util.spec.ts` |
| Service test | N/A (RTK in entities) | `src/{feature}/{feature}.service.spec.ts` |
| Selector test | `{selector}/{selector}.test.ts` | N/A |
| Component test | `{Component}.test.tsx` | N/A |
| E2E | `cypress/e2e/{area}/{name}.cy.ts` | `test/{feature}.e2e-spec.ts` |

---

*Testing analysis: 2026-06-24*

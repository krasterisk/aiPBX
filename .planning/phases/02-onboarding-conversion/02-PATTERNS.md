# Phase 2: Onboarding Conversion — Pattern Map

**Mapped:** 2026-06-24
**Files analyzed:** 28 new/modified targets from CONTEXT.md
**Analogs found:** 24 / 28

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/features/Onboarding/ui/OnboardingWizard/OnboardingWizard.tsx` | component | transform | same file (extend) | exact |
| `src/features/Onboarding/model/slices/onboardingSlice.ts` | store | CRUD/state | same + `projectWizardSlice.ts` | exact |
| `src/features/Onboarding/model/types/onboarding.ts` | model | — | same file | exact |
| `src/features/Onboarding/model/selectors/onboardingSelectors.ts` | selector | — | same file | exact |
| `src/features/Onboarding/ui/steps/ProductForkStep.tsx` *(new)* | component | request-response | `WelcomeStep.tsx` + `BusinessTypeStep.tsx` card grid | role-match |
| `src/features/Onboarding/ui/steps/SimpleExampleStep.tsx` *(new, replaces Telegram)* | component | request-response | `TelegramStep.tsx` + `PublishOverviewStep.tsx` | role-match |
| `src/features/Onboarding/ui/steps/WelcomeStep.tsx` | component | — | same file | exact |
| `src/features/Onboarding/ui/steps/BusinessTypeStep.tsx` | component | CRUD | same file | exact |
| `src/features/Onboarding/ui/steps/PublishOverviewStep.tsx` | component | — | same file | exact |
| `src/features/Onboarding/ui/steps/CompletionStep.tsx` | component | request-response | same file (refactor CTA priority) | exact |
| `src/features/Onboarding/ui/steps/AnalyticsProjectStep.tsx` *(new)* | component | CRUD | `ProjectWizard/WizardCreateFlow` | role-match |
| `src/features/Onboarding/ui/steps/AnalyticsUploadStep.tsx` *(new)* | component | file-I/O | `OperatorUploadForm.tsx` | exact |
| `src/features/Onboarding/ui/steps/AnalyticsDashboardTourStep.tsx` *(new)* | component | transform | `OperatorDashboard.tsx` + `redesign-v3/Tooltip` | partial |
| `src/features/Onboarding/ui/components/StepIndicator/StepIndicator.tsx` | component | — | same + `WizardPhaseIndicator.tsx` | exact |
| `src/features/Auth/lib/hooks/useSignupData.ts` | hook | request-response | same file | exact |
| `src/features/avatarDropdown/ui/AvatarDropdown/AvatarDropdown.tsx` | component | — | same file | exact |
| `src/app/App.tsx` | provider | — | same file | exact |
| `src/shared/config/analytics/initAnalytics.ts` | config/utility | event-driven | same file | exact |
| `src/features/Onboarding/lib/trackOnboardingEvent.ts` *(new helper)* | utility | event-driven | `initAnalytics.ts` `trackEvent` | exact |
| `src/features/PlaygroundSession/ui/PlaygroundSessionV2/PlaygroundSessionV2.tsx` | component | streaming | same + `usePlaygroundSession.ts` | role-match |
| `src/features/Calls/lib/useBatchProgress.ts` | hook | pub-sub/polling | same file | exact |
| `src/features/OperatorAnalytics/ui/ProjectWizard/ProjectWizard.tsx` | component | CRUD | same file (embed simplified) | exact |
| `src/entities/Report/model/slices/projectWizardSlice.ts` | store | CRUD | same file (reuse in onboarding) | exact |
| `src/features/OperatorAnalytics/ui/OperatorDashboard/OperatorDashboard.tsx` | component | request-response | same file (tour targets) | exact |
| `src/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.tsx` | provider | — | `OnboardingWizard` + `OperatorProjectManager` | exact |
| `src/shared/ui/redesign-v3/*` | component | — | `redesign-v3/README.md` + existing steps | role-match |
| `public/docs/screenshots/*` | asset | file-I/O | `public/docs/screenshots/README.md` | partial |
| `src/features/Onboarding/index.ts` | barrel | — | same file | exact |

---

## Pattern Assignments

### `src/features/Onboarding/ui/OnboardingWizard/OnboardingWizard.tsx` (component, transform)

**Analog:** same file — extend `stepsMap` and signup trigger; branch by `productPath`.

**DynamicModuleLoader + reducer injection** (lines 18-22, 77-96):

```typescript
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

const reducers: ReducersList = {
    onboarding: onboardingReducer
}

export const OnboardingWizard = memo((props: OnboardingWizardProps) => {
    const dispatch = useAppDispatch()

    // IMPORTANT: This runs in the parent's useEffect, which fires AFTER
    // DynamicModuleLoader's useEffect (child effects run first in React).
    // This guarantees the onboarding reducer is already mounted.
    useEffect(() => {
        const isSignup = localStorage.getItem('onboarding_is_signup')
        if (isSignup) {
            localStorage.removeItem('onboarding_is_signup')
            localStorage.removeItem(ONBOARDING_STORAGE_KEY)
            dispatch(onboardingActions.startOnboarding())
        }
    }, [dispatch])

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            <OnboardingWizardContent {...props} />
        </DynamicModuleLoader>
    )
})
```

**Step routing pattern** (lines 28-34, 51-71):

```typescript
const stepsMap: Record<number, React.FC<{ className?: string }>> = {
    0: WelcomeStep,
    1: BusinessTypeStep,
    2: TelegramStep,
    3: PublishOverviewStep,
    4: CompletionStep
}

// ...
const StepComponent = stepsMap[currentStep] || WelcomeStep
```

**Overlay shell + body scroll lock** (lines 40-48, 56-72):

```typescript
useEffect(() => {
    if (isActive) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
}, [isActive])

return (
    <VStack align="center" justify="center" max className={cls.OnboardingWizard}>
        <VStack className={cls.overlay}>{null}</VStack>
        <VStack max className={cls.wizardContainer}>
            {currentStep > 0 && (
                <VStack max className={cls.stickyHeader}>
                    <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
                </VStack>
            )}
            <VStack gap="24" className={cls.wizardContent}>
                <StepComponent />
            </VStack>
        </VStack>
    </VStack>
)
```

**Phase 2 extension:** Replace flat `stepsMap` with `productPath`-aware map (`assistants` vs `analytics`), insert `ProductForkStep` at step 0, read `productPath` from slice after fork. Keep `removeAfterUnmount={false}` so re-entry via AvatarDropdown works.

---

### `src/features/Onboarding/model/slices/onboardingSlice.ts` (store, CRUD/state)

**Analog:** same file + `src/entities/Report/model/slices/projectWizardSlice.ts` for analytics branch state.

**Initial state + step navigation** (lines 4-40):

```typescript
const initialState: OnboardingState = {
    isActive: false,
    currentStep: 0,
    selectedTemplateId: null,
    // ...
    skipped: false,
    createdAssistantId: null,
    isCreatingAssistant: false,
    error: null
}

reducers: {
    startOnboarding: (state) => {
        state.isActive = true
        state.currentStep = 0
    },
    nextStep: (state) => {
        if (state.currentStep < 4) {
            state.currentStep += 1
        }
    },
    prevStep: (state) => { /* ... */ },
    goToStep: (state, action: PayloadAction<number>) => {
        state.currentStep = action.payload
    },
```

**Completion + localStorage persistence** (lines 82-90):

```typescript
skipOnboarding: (state) => {
    state.skipped = true
    state.isActive = false
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
},
completeOnboarding: (state) => {
    state.isActive = false
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
}
```

**projectWizard open/close pattern to mirror** (`projectWizardSlice.ts` lines 33-59):

```typescript
openCreate: (state) => {
    Object.assign(state, { ...initialState, isOpen: true, editProjectId: undefined })
},
close: (state) => {
    state.isOpen = false
},
```

**Phase 2 extension:** Add `productPath: 'assistants' | 'analytics' | null`, `playgroundCallSuccess: boolean`, `oaFirstAnalysisComplete: boolean`, `oaProjectId: string | null`. Replace hardcoded step cap `4` with path-specific `TOTAL_STEPS`. Add `setProductPath`, `markPlaygroundSuccess`, `markAnalysisComplete` reducers. Optionally dispatch `projectWizardActions` from onboarding steps instead of duplicating project fields.

---

### `src/features/Onboarding/model/types/onboarding.ts` (model)

**Analog:** same file

```typescript
export interface OnboardingState {
  isActive: boolean
  currentStep: number // 0-4
  selectedTemplateId: string | null
  // ...
  skipped: boolean
  createdAssistantId: string | null
  error: string | null
}

export const ONBOARDING_STORAGE_KEY = 'onboarding_completed'
export const TOTAL_STEPS = 5
```

**Phase 2 extension:** Add `productPath`, success flags, export `ONBOARDING_SIGNUP_KEY = 'onboarding_is_signup'` constant (currently string literal in wizard). Path-specific `getTotalSteps(productPath)` helper.

---

### `src/features/Onboarding/ui/steps/ProductForkStep.tsx` *(new)* (component, request-response)

**Analog:** `WelcomeStep.tsx` (CTA layout) + `BusinessTypeStep.tsx` (card grid selection)

**Welcome CTA pattern** (`WelcomeStep.tsx` lines 16-68):

```typescript
export const WelcomeStep = memo(({ className }: WelcomeStepProps) => {
    const { t } = useTranslation('onboarding')
    const dispatch = useAppDispatch()

    const onStart = useCallback(() => {
        dispatch(onboardingActions.nextStep())
    }, [dispatch])

    const onSkip = useCallback(() => {
        dispatch(onboardingActions.skipOnboarding())
    }, [dispatch])

    return (
        <VStack gap="16" align="center" max className={className}>
            <Button variant="glass-action" size="l" onClick={onStart} addonRight={<ArrowRight size={18} />}>
                {t('welcome_start', 'Поехали!')}
            </Button>
            <Button variant="clear" size="s" onClick={onSkip} className={cls.skipLink}>
                {t('welcome_skip', 'Пропустить и настроить позже')}
            </Button>
        </VStack>
    )
})
```

**Card selection pattern** (`BusinessTypeStep.tsx` lines 46-56, 105-107):

```typescript
const businessCards = [
    { id: 'appliance_repair', Icon: Wrench, labelKey: 'business_repair' },
    // ...
]

const onSelectTemplate = useCallback((id: string) => {
    dispatch(onboardingActions.selectTemplate(id))
    dispatch(onboardingActions.setError(null))
}, [dispatch])
```

**Phase 2:** Two large product cards (Voice Assistants / Speech Analytics). On select: `dispatch(setProductPath(...))`, `trackEvent('onboarding_product_assistants' | 'onboarding_product_analytics')`, then `nextStep()`.

---

### `src/features/Onboarding/ui/steps/SimpleExampleStep.tsx` *(new)* (component, request-response)

**Analog:** `TelegramStep.tsx` (step shell) + `PublishOverviewStep.tsx` (educational cards)

**Step navigation shell** (`TelegramStep.tsx` pattern — back/next footer):

```typescript
const onNext = useCallback(() => {
    dispatch(onboardingActions.nextStep())
}, [dispatch])

const onBack = useCallback(() => {
    dispatch(onboardingActions.prevStep())
}, [dispatch])
```

**Educational card list** (`PublishOverviewStep.tsx` lines 22-50, 73-97):

```typescript
const publishMethods = [
    { Icon: Globe, titleKey: 'publish_widget_title', descKey: 'publish_widget_desc', /* ... */ },
    // ...
]

{publishMethods.map(({ Icon, titleKey, descKey, /* ... */ }) => (
    <HStack key={titleKey} gap="16" align="start" className={cls.publishCard}>
        <HStack justify="center" align="center" className={cls.publishCardIconBox}>
            <Icon size={20} />
        </HStack>
        <VStack gap="4">
            <Text title={t(titleKey, titleFallback)} size="s" bold />
            <Text text={t(descKey, descFallback)} size="xs" />
        </VStack>
    </HStack>
))}
```

**Phase 2:** Replace Telegram MCP connect with walkthrough cards for a concrete scenario. Optional Telegram mention as secondary link (not blocking). No `useTelegramConnect` required path.

---

### `src/features/Onboarding/ui/steps/BusinessTypeStep.tsx` (component, CRUD)

**Analog:** same file — assistant creation is the `assistant_created` event source.

**Assistant creation + advance** (lines 132-178):

```typescript
const onCreateFromTemplate = useCallback(async () => {
    dispatch(onboardingActions.setCreatingAssistant(true))
    dispatch(onboardingActions.setError(null))
    try {
        const result = await createAssistant([{
            ...initAssistant,
            name,
            instruction: finalPrompt,
            tools: []
        }]).unwrap()

        if (result?.[0]?.id) {
            dispatch(onboardingActions.setCreatedAssistantId(result[0].id))
            dispatch(onboardingActions.nextStep())
        }
    } catch (err: any) {
        dispatch(onboardingActions.setError(err?.data?.message || 'Error creating assistant'))
        dispatch(onboardingActions.setCreatingAssistant(false))
    }
}, [/* ... */])
```

**Phase 2:** After successful create, call `trackEvent('assistant_created', { productPath: 'assistants' })`. Wire `onboarding_step_{n}` on `nextStep`/`prevStep` in wizard or slice middleware.

---

### `src/features/Onboarding/ui/steps/CompletionStep.tsx` (component, request-response)

**Analog:** same file — invert CTA priority: Playground is mandatory success, not equal exit.

**Current multi-destination pattern** (lines 37-55, 138-175):

```typescript
const onGoPlayground = useCallback(() => {
    dispatch(onboardingActions.completeOnboarding())
    navigate(getRoutePlayground())
}, [dispatch, navigate])

<Button variant="glass-action" size="l" onClick={onGoPlayground} addonLeft={<Mic size={16} />}>
    {t('completion_go_playground', 'Перейти в Playground')}
</Button>

<HStack gap="12" justify="center">
    <Button variant="clear" size="s" onClick={onGoAssistants}>...</Button>
    <Button variant="clear" size="s" onClick={onGoDashboard}>...</Button>
</HStack>
```

**Phase 2 refactor:** Do NOT call `completeOnboarding()` until `playgroundCallSuccess`. Primary CTA deep-links to Playground with `createdAssistantId` query param. Post-success screen shows trunk/widget cards (reuse `PublishOverviewStep` card layout). Secondary exits remain after success only.

---

### `src/features/Onboarding/ui/steps/AnalyticsProjectStep.tsx` *(new)* (component, CRUD)

**Analog:** `src/features/OperatorAnalytics/ui/ProjectWizard/ProjectWizard.tsx` (`WizardCreateFlow`)

**Wizard init on mount** (lines 46-56):

```typescript
const initializedRef = useRef(false)
useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    dispatch(projectWizardActions.openCreate())
}, [dispatch])
```

**Template selection** (`WizardStep0_Templates.tsx` + `ProjectWizard.tsx` lines 141-148):

```typescript
case 'template':
    return (
        <WizardStep0_Templates
            selectedTemplateId={selectedTemplateId}
            onSelect={(tpl) => dispatch(projectWizardActions.applyTemplate(tpl))}
        />
    )
```

**Project create API** (`ProjectWizard.tsx` lines 115-134):

```typescript
const handleCreate = useCallback(async () => {
    try {
        await createProject({
            name: name.trim() || t('Новый проект'),
            description: description.trim(),
            systemPrompt: systemPrompt.trim(),
            customMetricsSchema: customMetrics,
            visibleDefaultMetrics: visibleDefaults,
            // webhook fields optional for onboarding
        }).unwrap()

        dispatch(projectWizardActions.close())
        onSuccess?.()
    } catch (err) {
        console.error('Wizard create error:', err)
    }
}, [/* ... */])
```

**Phase 2:** Embed simplified flow — template picker + name only; skip webhook/budget. On success: `trackEvent('oa_project_created')`, store `oaProjectId` in onboarding slice, advance step.

---

### `src/features/Onboarding/ui/steps/AnalyticsUploadStep.tsx` *(new)* (component, file-I/O)

**Analog:** `src/features/OperatorAnalytics/ui/OperatorUploadForm/OperatorUploadForm.tsx`

**Upload submit** (lines 93-124):

```typescript
const handleSubmit = useCallback(async () => {
    const formData = new FormData()
    files.forEach(({ file }) => { formData.append(files.length === 1 ? 'file' : 'files', file) })
    if (projectId) formData.append('projectId', projectId)
    try {
        const result = await uploadFiles(formData).unwrap()
        if ('batchId' in result && result.batchId) {
            onBatchStarted?.(result.batchId)
            onClose?.()
        }
    } catch (err: any) {
        toast.error(String(err?.data?.message || err?.message || t('Ошибка при загрузке')))
    }
}, [/* ... */])
```

**Drag-drop zone** (lines 138-160):

```typescript
<div
    className={dropZoneClasses}
    onDrop={onDrop}
    onDragOver={onDragOver}
    onClick={() => fileInputRef.current?.click()}
>
    <input ref={fileInputRef} type="file" multiple accept=".mp3,.wav,.ogg,.m4a" className={cls.hiddenInput} />
    <Text text={String(t('Перетащите файлы сюда'))} bold />
</div>
```

**Phase 2:** Pre-fill `projectId` from onboarding slice. Wire `onBatchStarted` to `useBatchProgress().startPolling`. On batch finished → `trackEvent('oa_file_uploaded')` + `oa_first_analysis_complete`.

---

### `src/features/Onboarding/ui/steps/AnalyticsDashboardTourStep.tsx` *(new)* (component, transform)

**Analog:** `OperatorDashboard.tsx` (tour targets) + `redesign-v3/Tooltip` (spotlight alternative)

**Dashboard section anchors** (`OperatorDashboard.tsx` lines 197-210, 261-299, 477-490):

```typescript
{data?.insightsAvailable && (
    <AiInsightsBanner projectName={activeProject?.name} queryParams={{ /* ... */ }} />
)}

<HStack gap={'12'} max wrap={'wrap'} className={cls.statsGrid}>
    <StatCard title={String(t('Всего звонков'))} value={data?.totalAnalyzed ?? 0} icon={<PhoneInTalkIcon />} />
    {/* ... more StatCards */}
</HStack>

{(data?.agentScorecards?.length ?? 0) > 0 && (
    <Card max variant={'glass'} border={'partial'} padding={'24'}>
        <OperatorScoreTable rows={data.agentScorecards!} />
    </Card>
)}
```

**Tooltip overlay primitive** (`redesign-v3/Tooltip/Tooltip.tsx` lines 21-28):

```typescript
export const Tooltip = memo((props: TooltipProps) => {
    const { children, title, placement = 'top', disabled = false } = props
    const [isVisible, setIsVisible] = useState(false)
    // portal-based positioning, mobile click-outside
```

**Phase 2:** No existing tour library — build lightweight step index + `data-tour-id` on dashboard widgets, or navigate to OA dashboard route with overlay. Empty-state preview before data is OK per D-10.

---

### `src/features/PlaygroundSession/` — call success detection (streaming, event-driven)

**Analog:** `PlaygroundSessionV2.tsx` + `usePlaygroundSession.ts` + `eventProcessor.ts`

**Session lifecycle** (`PlaygroundSessionV2.tsx` lines 106-119):

```typescript
const handleStartSession = useCallback(() => {
    processorRef.current = createInitialProcessorState()
    processorRef.current.metrics.sessionStartTime = Date.now()
    connect(selectedAssistant.id)
}, [connect, selectedAssistant])

const handleStopSession = useCallback(() => {
    disconnect()
}, [disconnect])
```

**Disconnect callback hook** (`usePlaygroundSession.ts` lines 277-283):

```typescript
socket.on('disconnect', () => {
    cleanupAudio()
    setStatus('idle')
    propsRef.current?.onDisconnect?.()
})
```

**Session metrics** (`eventProcessor.ts` — `metrics.turnCount`, `metrics.sessionStartTime`):

```typescript
// turnCount increments on conversation turns; use as success heuristic
next.metrics.turnCount += 1
```

**Phase 2 options (D-19 discretion):**
1. **UI callback (simplest):** In Playground page, if `onboarding` active + `turnCount >= N` + session ended → `trackEvent('playground_call_success')`.
2. **WebSocket:** Listen for `playground.event` with meaningful transcript/usage.
3. **Billing:** Deferred — no existing playground billing hook in frontend.

Pass `createdAssistantId` via route query from CompletionStep: `getRoutePlayground()` + search params.

---

### `src/features/Calls/lib/useBatchProgress.ts` — analysis complete (pub-sub/polling)

**Analog:** same file — used by `CallsPage.tsx` for `oa_first_analysis_complete`.

**Start polling after upload** (`CallsPage.tsx` lines 23-24, 109):

```typescript
const batch = useBatchProgress()
// ...
onBatchStarted={batch.startPolling}
```

**Batch finished detection** (`useBatchProgress.ts` lines 102-117):

```typescript
if (finished) {
    batchIdsRef.current.delete(batchId)
    const msg = t('Обработка завершена: {{completed}} из {{total}} файлов', {
        completed: status.completed,
        total: status.total
    })
    if (status.failed > 0) {
        toast.warning(msg)
    } else {
        toast.success(msg)
    }
    dispatch(reportApi.util.invalidateTags(['OperatorAnalytics', 'Reports']))
}
```

**Phase 2:** Extend `pollOneBatch` finished branch (or onboarding-specific wrapper) to fire `trackEvent('oa_first_analysis_complete')` when onboarding analytics path is active and `status.completed >= 1`.

---

### `src/shared/config/analytics/initAnalytics.ts` (config, event-driven)

**Analog:** same file — sole `trackEvent` implementation; not yet called anywhere else in codebase.

**Init** (lines 19-44):

```typescript
export function initAnalytics (): void {
  const metrikaId = typeof __YANDEX_METRIKA_ID__ !== 'undefined' ? __YANDEX_METRIKA_ID__ : ''
  const ga4Id = typeof __GA4_MEASUREMENT_ID__ !== 'undefined' ? __GA4_MEASUREMENT_ID__ : ''
  // Yandex: window.ym(id, 'init', { clickmap: true, trackLinks: true, ... })
  // GA4: window.gtag('config', ga4Id)
}
```

**Dual-platform event helper** (lines 46-57):

```typescript
export function trackEvent (name: string, params?: Record<string, string | number>): void {
  const metrikaId = typeof __YANDEX_METRIKA_ID__ !== 'undefined' ? __YANDEX_METRIKA_ID__ : ''
  const ga4Id = typeof __GA4_MEASUREMENT_ID__ !== 'undefined' ? __GA4_MEASUREMENT_ID__ : ''

  if (metrikaId && window.ym) {
    window.ym(Number(metrikaId), 'reachGoal', name, params)
  }
  if (ga4Id && window.gtag) {
    window.gtag('event', name, params)
  }
}
```

**Bootstrap** (`src/index.tsx` lines 11-14):

```typescript
import { initAnalytics } from '@/shared/config/analytics/initAnalytics'
initAnalytics()
```

**Phase 2 minimum events (D-13):** `onboarding_started`, `onboarding_product_*`, `onboarding_step_{n}`, `assistant_created`, `playground_call_success`, `oa_project_created`, `oa_file_uploaded`, `oa_first_analysis_complete`, `onboarding_completed`, `onboarding_skipped`. Create thin wrapper `trackOnboardingEvent(name, params)` in feature lib that adds `productPath` automatically.

---

### `src/features/Auth/lib/hooks/useSignupData.ts` (hook, request-response)

**Analog:** same file

**Signup → onboarding flag** (lines 62-65, 137-140):

```typescript
.then((data) => {
    localStorage.setItem('onboarding_is_signup', 'true')
    dispatch(userActions.setToken(data))
    navigate(getRouteAssistants())
})
```

**Phase 2:** Keep flag; wizard reads it and clears. Optionally store `productPath` preference if chosen pre-signup (deferred). All three signup paths (email, Google, Telegram) set the same key.

---

### `src/features/avatarDropdown/ui/AvatarDropdown/AvatarDropdown.tsx` (component)

**Analog:** same file — re-entry per D-02

```typescript
const onStartOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    dispatch(onboardingActions.startOnboarding())
}, [dispatch])

// Admin-only today:
...(isAdmin ? [{ content: t('Онбординг'), onClick: onStartOnboarding }] : [])
```

**Phase 2:** Expose single re-entry button to all users (not admin-only). Fork step inside wizard handles product re-selection.

---

### `src/app/App.tsx` (provider)

**Analog:** same file

```typescript
{(userData && !isDocsPage) ? (
    <>
        <MainLayout header={<Navbar />} content={<AppRouter />} sidebar={<Menubar />} />
        <OnboardingWizard />
    </>
) : (
    <AppRouter />
)}
```

**Pattern:** Onboarding is a fixed overlay above authenticated shell; no route change required.

---

### `src/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader.tsx` (provider)

**Analog:** same file + `OperatorProjectManager.tsx` (multi-reducer pattern)

**Synchronous reducer registration** (lines 30-41):

```typescript
const mountedReducers = store.reducerManager.getReducerMap()
Object.entries(reducers).forEach(([name, reducer]) => {
    const mounted = mountedReducers[name as StateSchemaKey]
    if (!mounted) {
        store.reducerManager.add(name as StateSchemaKey, reducer)
        newlyAddedRef.current.push(name)
    }
})
```

**OperatorProjectManager — dual reducer example** (lines 28-30, 136):

```typescript
const reducers: ReducersList = {
    projectWizard: projectWizardReducer
}

return (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
```

**Phase 2:** If analytics onboarding steps use `projectWizard` slice, extend OnboardingWizard reducers:

```typescript
const reducers: ReducersList = {
    onboarding: onboardingReducer,
    projectWizard: projectWizardReducer,  // when analytics branch active
}
```

Register `projectWizard` in `StateSchema` if not already (it is — see `StateSchema.ts`).

---

### `src/shared/ui/redesign-v3/` (component library)

**Analog:** `redesign-v3/README.md`, `Button/Button.tsx`

**D-17 rule:** New onboarding UI only in `shared/ui/redesign-v3/`. Existing steps use `shared/ui/redesigned/*` — migrate new steps and fork UI to v3.

**Button API** (`Button.tsx` lines 5-44):

```typescript
export type ButtonVariant = 'primary' | 'outline' | 'clear' | 'accent'
export type ButtonSize = 'm' | 'l' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    addonLeft?: ReactNode
    addonRight?: ReactNode
    fullWidth?: boolean
}
```

**Phase 2:** Use `redesign-v3/Button`, `Input`, `Combobox`, `Tooltip` for ProductForkStep and tour overlays. Keep existing assistant steps on `redesigned/*` until touched, or migrate consistently per step file.

---

### `src/features/Onboarding/ui/components/StepIndicator/StepIndicator.tsx` (component)

**Analog:** same file + `WizardPhaseIndicator.tsx` for analytics branch

```typescript
const progress = Math.min(100, Math.max(0, ((currentStep - 1) / (totalSteps - 2)) * 100))

{stepIcons.map((Icon, index) => {
    const stepIndex = index + 1
    return (
        <HStack className={classNames(cls.stepDot, {
            [cls.active]: stepIndex === currentStep,
            [cls.completed]: stepIndex < currentStep,
        })}>
            {stepIndex < currentStep ? <Check size={14} /> : <Icon size={14} />}
        </HStack>
    )
})}
```

**Phase 2:** Parameterize `stepIcons` per `productPath`. OA branch can reuse `WizardPhaseIndicator` phase chips inside embedded project step.

---

### `public/docs/screenshots/` (asset, file-I/O)

**Analog:** `public/docs/screenshots/README.md`

```
- dashboard-placeholder.png
- assistant-create-placeholder.png
- assistant-publish-sip-placeholder.png
- tool-create-placeholder.png
- playground-placeholder.png
- reports-history-placeholder.png
```

**Phase 2:** Replace placeholders with Playwright captures from dev build or composed mocks. Add OA captures: project wizard, upload form, operator dashboard. No code analog — follow existing filename convention in README.

---

## Shared Patterns

### FSD feature structure

**Source:** `src/features/Onboarding/`

```
features/Onboarding/
├── index.ts                    # public API
├── model/
│   ├── slices/onboardingSlice.ts
│   ├── selectors/onboardingSelectors.ts
│   └── types/onboarding.ts
└── ui/
    ├── OnboardingWizard/
    ├── steps/
    └── components/
```

**Apply to:** All new onboarding steps and lib helpers stay inside `features/Onboarding`. Reuse entities (`Assistants`, `Report`, `Mcp`) for API — do not duplicate RTK endpoints.

### i18n

**Source:** existing steps use `useTranslation('onboarding')`; OA uses `reports`.

```typescript
const { t } = useTranslation('onboarding')
<Text title={t('welcome_title', 'Добро пожаловать в AI PBX!')} />
```

**Apply to:** Extend `onboarding` namespace for fork/simple-example/post-playground strings. Reuse `reports` keys for embedded ProjectWizard strings.

### Wizard overlay styling

**Source:** `OnboardingWizard.module.scss` lines 7-37

```scss
.OnboardingWizard {
    position: fixed;
    inset: 0;
    z-index: var(--z-max);
}
.wizardContainer {
    max-width: var(--container-width-md);
    background: var(--card-bg);
    border-radius: var(--radius-xl);
    border: var(--glass-border-primary);
    animation: wizardAppear var(--duration-slow) var(--ease-spring);
}
```

**Apply to:** All new steps inherit `cls` from wizard module; analytics branch uses same overlay shell.

### Error display in steps

**Source:** `BusinessTypeStep.tsx` — `getOnboardingError` + inline error text; RTK `.unwrap()` catch sets `onboardingActions.setError`.

### Modal wizard embedding (OA reference)

**Source:** `OperatorProjectManager.tsx` lines 188-194

```typescript
<Modal isOpen={wizardIsOpen} onClose={handleCloseWizard} lazy size={'wide'}>
    <ProjectWizard editProject={wizardTarget} onClose={handleCloseWizard} />
</Modal>
```

**Apply to:** Analytics onboarding can embed `ProjectWizard` inline inside overlay instead of separate Modal — same component, different container.

### Analytics event wiring

**Source:** `initAnalytics.ts` `trackEvent`

**Apply to:** Call at every `startOnboarding`, `setProductPath`, `nextStep`/`prevStep`, `skipOnboarding`, `completeOnboarding`, assistant create success, playground success, OA project create, upload batch complete. Guard: no-op when neither Metrika nor GA4 configured (existing behavior).

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/features/Onboarding/ui/steps/AnalyticsDashboardTourStep.tsx` | component | transform | No spotlight/tour library in codebase; build from Tooltip + state or new lightweight overlay |
| `public/docs/screenshots/*.png` | asset | file-I/O | No screenshot capture tooling in repo; use Playwright externally per D-16 discretion |
| `src/features/Onboarding/lib/playgroundSuccessDetector.ts` *(optional)* | utility | event-driven | No existing onboarding↔playground bridge; compose from session metrics |
| Cross-product post-MVP suggestion flow | component | — | Explicitly deferred in CONTEXT |

---

## Metadata

**Analog search scope:** `src/features/Onboarding/`, `src/features/OperatorAnalytics/`, `src/features/PlaygroundSession/`, `src/features/Calls/`, `src/shared/config/analytics/`, `src/shared/lib/components/DynamicModuleLoader/`, `src/shared/ui/redesign-v3/`, `src/app/App.tsx`, `src/features/Auth/`, `public/docs/screenshots/`
**Files scanned:** ~45
**Pattern extraction date:** 2026-06-24

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProjectWizardSchema, MetricMethod } from '../types/projectWizardSchema'
import { MetricDefinition, DefaultMetricKey, WebhookEvent, ProjectTemplate, OperatorProject } from '../types/report'

const ALL_DEFAULT_METRICS: DefaultMetricKey[] = [
    'greeting_quality', 'script_compliance', 'politeness_empathy',
    'active_listening', 'objection_handling', 'product_knowledge',
    'problem_resolution', 'speech_clarity_pace', 'closing_quality'
]

const initialState: ProjectWizardSchema = {
    isOpen: false,
    editProjectId: undefined,
    method: null,
    methodStepDone: false,
    name: '',
    description: '',
    systemPrompt: '',
    customMetrics: [],
    visibleDefaultMetrics: [...ALL_DEFAULT_METRICS],
    webhookUrl: '',
    webhookHeaders: {},
    webhookEvents: [],
    selectedTemplateId: undefined,
    showWebhooks: false,
}

export const projectWizardSlice = createSlice({
    name: 'projectWizard',
    initialState,
    reducers: {
        // ── Open / Close / Reset ──────────────────────────────────
        openCreate: (state) => {
            Object.assign(state, {
                ...initialState,
                isOpen: true,
                editProjectId: undefined,
            })
        },
        openEdit: (state, action: PayloadAction<OperatorProject>) => {
            const p = action.payload
            state.isOpen = true
            state.editProjectId = p.id
            state.method = 'manual'
            state.methodStepDone = true
            state.name = p.name
            state.description = p.description ?? ''
            state.systemPrompt = p.systemPrompt ?? ''
            state.customMetrics = p.customMetricsSchema ?? []
            state.visibleDefaultMetrics = p.visibleDefaultMetrics ?? [...ALL_DEFAULT_METRICS]
            state.webhookUrl = p.webhookUrl ?? ''
            state.webhookHeaders = p.webhookHeaders ?? {}
            state.webhookEvents = p.webhookEvents ?? []
            state.selectedTemplateId = undefined
            state.showWebhooks = false
        },
        close: (state) => {
            state.isOpen = false
        },

        // ── Flow control ──────────────────────────────────────────
        setMethod: (state, action: PayloadAction<MetricMethod>) => {
            state.method = action.payload
            state.methodStepDone = action.payload === 'manual'
        },
        backToMethodSelect: (state) => {
            state.method = null
            state.methodStepDone = false
        },
        setMethodStepDone: (state, action: PayloadAction<boolean>) => {
            state.methodStepDone = action.payload
        },

        // ── Form field updates ────────────────────────────────────
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload
        },
        setSystemPrompt: (state, action: PayloadAction<string>) => {
            state.systemPrompt = action.payload
        },
        setCustomMetrics: (state, action: PayloadAction<MetricDefinition[]>) => {
            state.customMetrics = action.payload
        },
        setVisibleDefaultMetrics: (state, action: PayloadAction<DefaultMetricKey[]>) => {
            state.visibleDefaultMetrics = action.payload
        },
        toggleDefaultMetric: (state, action: PayloadAction<DefaultMetricKey>) => {
            const key = action.payload
            const idx = state.visibleDefaultMetrics.indexOf(key)
            if (idx >= 0) {
                state.visibleDefaultMetrics.splice(idx, 1)
            } else {
                state.visibleDefaultMetrics.push(key)
            }
        },
        setWebhookUrl: (state, action: PayloadAction<string>) => {
            state.webhookUrl = action.payload
        },
        setWebhookEvents: (state, action: PayloadAction<WebhookEvent[]>) => {
            state.webhookEvents = action.payload
        },
        setWebhookHeaders: (state, action: PayloadAction<Record<string, string>>) => {
            state.webhookHeaders = action.payload
        },
        setShowWebhooks: (state, action: PayloadAction<boolean>) => {
            state.showWebhooks = action.payload
        },
        setSelectedTemplateId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedTemplateId = action.payload
        },

        // ── Template apply ────────────────────────────────────────
        applyTemplate: (state, action: PayloadAction<ProjectTemplate>) => {
            const tpl = action.payload
            state.selectedTemplateId = tpl.id
            state.systemPrompt = tpl.systemPrompt
            state.customMetrics = tpl.customMetricsSchema
            state.visibleDefaultMetrics = tpl.visibleDefaultMetrics
            state.methodStepDone = true
        },

        // ── AI-generated metrics ──────────────────────────────────
        applyGeneratedMetrics: (state, action: PayloadAction<{ metrics: MetricDefinition[]; prompt: string }>) => {
            const { metrics, prompt } = action.payload
            if (metrics.length > 0) {
                state.customMetrics = metrics
            }
            if (prompt) {
                state.systemPrompt = prompt
            }
            state.methodStepDone = true
        },
    }
})

export const {
    actions: projectWizardActions,
    reducer: projectWizardReducer
} = projectWizardSlice

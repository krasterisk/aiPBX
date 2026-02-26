import { MetricDefinition, DefaultMetricKey, WebhookEvent } from '../types/report'

export type MetricMethod = 'template' | 'ai_interview' | 'manual'

export interface ProjectWizardSchema {
    // ── Wizard state ──────────────────────────────────────────
    isOpen: boolean
    editProjectId?: string

    // ── Flow control ──────────────────────────────────────────
    method: MetricMethod | null
    methodStepDone: boolean

    // ── Form fields ───────────────────────────────────────────
    name: string
    description: string
    systemPrompt: string
    customMetrics: MetricDefinition[]
    visibleDefaultMetrics: DefaultMetricKey[]
    webhookUrl: string
    webhookHeaders: Record<string, string>
    webhookEvents: WebhookEvent[]
    selectedTemplateId?: string
    showWebhooks: boolean
}

import { MetricDefinition, DefaultMetricKey, WebhookEvent, DigestConfig, AlertConfig, TagDefinition } from '../types/report'

export type MetricMethod = 'template' | 'ai_interview' | 'manual'

export const DEFAULT_DIGEST_CONFIG: DigestConfig = {
    enabled: false,
    emails: [],
    telegramChatIds: [],
    schedule: 'weekly',
    reportWindow: 'last_7_days',
    weeklyDay: 1,
    monthlyDay: 1,
    sendHour: 9,
}

export const DEFAULT_ALERT_CONFIG: AlertConfig = {
    enabled: false,
    inheritRecipientsFromDigest: true,
    emails: [],
    telegramChatIds: [],
    csatDrop: { enabled: true, dropPct: 20, windowDays: 7, minCalls: 5 },
    negativeSpike: { enabled: true, spikePp: 15, windowDays: 7, minCalls: 5 },
    budgetExceeded: { enabled: true },
}

export function mergeAlertConfig (raw?: AlertConfig | null): AlertConfig {
    if (!raw) {
        return {
            ...DEFAULT_ALERT_CONFIG,
            csatDrop: { ...DEFAULT_ALERT_CONFIG.csatDrop },
            negativeSpike: { ...DEFAULT_ALERT_CONFIG.negativeSpike },
            budgetExceeded: { ...DEFAULT_ALERT_CONFIG.budgetExceeded },
        }
    }
    return {
        ...DEFAULT_ALERT_CONFIG,
        ...raw,
        emails: raw.emails ?? [],
        telegramChatIds: raw.telegramChatIds ?? [],
        csatDrop: { ...DEFAULT_ALERT_CONFIG.csatDrop, ...raw.csatDrop },
        negativeSpike: { ...DEFAULT_ALERT_CONFIG.negativeSpike, ...raw.negativeSpike },
        budgetExceeded: { ...DEFAULT_ALERT_CONFIG.budgetExceeded, ...raw.budgetExceeded },
    }
}

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
    callTaxonomy: TagDefinition[]
    webhookUrl: string
    webhookHeaders: Record<string, string>
    webhookEvents: WebhookEvent[]
    selectedTemplateId?: string
    showWebhooks: boolean
    digestConfig: DigestConfig
    showDigest: boolean
    alertConfig: AlertConfig
}

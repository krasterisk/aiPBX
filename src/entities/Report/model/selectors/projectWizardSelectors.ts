import { StateSchema } from '@/app/providers/StoreProvider'
import type { AlertConfig } from '../types/report'

export const getWizardIsOpen = (state: StateSchema) => state.projectWizard?.isOpen ?? false
export const getWizardEditProjectId = (state: StateSchema) => state.projectWizard?.editProjectId
export const getWizardMethod = (state: StateSchema) => state.projectWizard?.method ?? null
export const getWizardMethodStepDone = (state: StateSchema) => state.projectWizard?.methodStepDone ?? false
export const getWizardName = (state: StateSchema) => state.projectWizard?.name ?? ''
export const getWizardDescription = (state: StateSchema) => state.projectWizard?.description ?? ''
export const getWizardSystemPrompt = (state: StateSchema) => state.projectWizard?.systemPrompt ?? ''
export const getWizardCustomMetrics = (state: StateSchema) => state.projectWizard?.customMetrics ?? []
export const getWizardVisibleDefaultMetrics = (state: StateSchema) => state.projectWizard?.visibleDefaultMetrics ?? []
export const getWizardCallTaxonomy = (state: StateSchema) => state.projectWizard?.callTaxonomy ?? []
export const getWizardWebhookUrl = (state: StateSchema) => state.projectWizard?.webhookUrl ?? ''
export const getWizardWebhookHeaders = (state: StateSchema) => state.projectWizard?.webhookHeaders ?? {}
export const getWizardWebhookEvents = (state: StateSchema) => state.projectWizard?.webhookEvents ?? []
export const getWizardSelectedTemplateId = (state: StateSchema) => state.projectWizard?.selectedTemplateId
export const getWizardShowWebhooks = (state: StateSchema) => state.projectWizard?.showWebhooks ?? false
export const getWizardDigestConfig = (state: StateSchema) => state.projectWizard?.digestConfig
export const getWizardShowDigest = (state: StateSchema) => state.projectWizard?.showDigest ?? false
export const getWizardAlertConfig = (state: StateSchema): AlertConfig | undefined =>
    (state.projectWizard as { alertConfig?: AlertConfig } | undefined)?.alertConfig

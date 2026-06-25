import { StateSchema } from '@/app/providers/StoreProvider'
import { OnboardingState, getMaxStepForPath, getTotalStepsForPath } from '../types/onboarding'

export const getOnboardingState = (state: StateSchema): OnboardingState | undefined =>
    state.onboarding

export const getOnboardingIsActive = (state: StateSchema) =>
    state.onboarding?.isActive ?? false

export const getOnboardingStep = (state: StateSchema) =>
    state.onboarding?.currentStep ?? 0

export const getOnboardingProductPath = (state: StateSchema) =>
    state.onboarding?.productPath ?? null

export const getOnboardingMaxStep = (state: StateSchema) =>
    getMaxStepForPath(state.onboarding?.productPath ?? null)

export const getOnboardingTotalSteps = (state: StateSchema) =>
    getTotalStepsForPath(state.onboarding?.productPath ?? null)

export const getOnboardingPlaygroundCallCompleted = (state: StateSchema) =>
    state.onboarding?.playgroundCallCompleted ?? false

export const getOnboardingOaAnalysisCompleted = (state: StateSchema) =>
    state.onboarding?.oaAnalysisCompleted ?? false

export const getOnboardingOaProjectId = (state: StateSchema) =>
    state.onboarding?.oaProjectId ?? null

export const getOnboardingPostSuccessStep = (state: StateSchema) =>
    state.onboarding?.postSuccessStep ?? null

export const getOnboardingTemplateId = (state: StateSchema) =>
    state.onboarding?.selectedTemplateId ?? null

export const getOnboardingCustomDescription = (state: StateSchema) =>
    state.onboarding?.customBusinessDescription ?? ''

export const getOnboardingCustomFeatures = (state: StateSchema) =>
    state.onboarding?.customFeatures ?? []

export const getOnboardingIsGenerating = (state: StateSchema) =>
    state.onboarding?.isGeneratingPrompt ?? false

export const getOnboardingGeneratedPrompt = (state: StateSchema) =>
    state.onboarding?.generatedPrompt ?? null

export const getOnboardingTelegramChatId = (state: StateSchema) =>
    state.onboarding?.telegramChatId ?? ''

export const getOnboardingTelegramConnected = (state: StateSchema) =>
    state.onboarding?.telegramConnected ?? false

export const getOnboardingCreatedAssistantId = (state: StateSchema) =>
    state.onboarding?.createdAssistantId ?? null

export const getOnboardingIsCreating = (state: StateSchema) =>
    state.onboarding?.isCreatingAssistant ?? false

export const getOnboardingError = (state: StateSchema) =>
    state.onboarding?.error ?? null

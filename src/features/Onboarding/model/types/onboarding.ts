export type OnboardingProductPath = 'assistants' | 'analytics'

export interface OnboardingState {
  isActive: boolean
  currentStep: number

  productPath: OnboardingProductPath | null
  playgroundCallCompleted: boolean
  oaAnalysisCompleted: boolean
  oaProjectId: string | null
  postSuccessStep: number | null

  // Step 1: Business type
  selectedTemplateId: string | null
  customBusinessDescription: string
  customFeatures: string[]
  isGeneratingPrompt: boolean
  generatedPrompt: string | null

  // Step 2: Telegram
  telegramConnected: boolean
  telegramChatId: string

  // Meta
  skipped: boolean
  createdAssistantId: string | null
  isCreatingAssistant: boolean
  error: string | null
}

export const ONBOARDING_STORAGE_KEY = 'onboarding_completed'
export const ONBOARDING_PRODUCT_KEY = 'onboarding_product_path'
export const ONBOARDING_SIGNUP_KEY = 'onboarding_is_signup'

/** @deprecated Use getTotalStepsForPath(productPath) */
export const TOTAL_STEPS = 5

export const FORK_STEP = 0
export const ASSISTANTS_MAX_STEP = 5
export const ANALYTICS_MAX_STEP = 4

export function getMaxStepForPath (productPath: OnboardingProductPath | null): number {
  if (productPath === 'analytics') return ANALYTICS_MAX_STEP
  if (productPath === 'assistants') return ASSISTANTS_MAX_STEP
  return FORK_STEP
}

export function getTotalStepsForPath (productPath: OnboardingProductPath | null): number {
  if (productPath === 'analytics') return ANALYTICS_MAX_STEP
  if (productPath === 'assistants') return ASSISTANTS_MAX_STEP
  return 1
}

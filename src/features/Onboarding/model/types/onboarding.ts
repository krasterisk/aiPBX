export interface OnboardingState {
  isActive: boolean
  currentStep: number // 0-4

  // Step 1: Business type
  selectedTemplateId: string | null // e.g. 'appliance_repair' or 'custom'
  customBusinessDescription: string
  customFeatures: string[] // user-added features on top of template defaults
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
export const TOTAL_STEPS = 5

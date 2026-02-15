import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OnboardingState, ONBOARDING_STORAGE_KEY } from '../types/onboarding'

const initialState: OnboardingState = {
    isActive: false,
    currentStep: 0,
    selectedTemplateId: null,
    customBusinessDescription: '',
    customFeatures: [],
    isGeneratingPrompt: false,
    generatedPrompt: null,
    telegramConnected: false,
    telegramChatId: '',
    skipped: false,
    createdAssistantId: null,
    isCreatingAssistant: false,
    error: null
}

export const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
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
        prevStep: (state) => {
            if (state.currentStep > 0) {
                state.currentStep -= 1
            }
        },
        goToStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload
        },
        selectTemplate: (state, action: PayloadAction<string>) => {
            state.selectedTemplateId = action.payload
            state.customBusinessDescription = ''
            state.customFeatures = []
            state.generatedPrompt = null
        },
        setCustomDescription: (state, action: PayloadAction<string>) => {
            state.customBusinessDescription = action.payload
        },
        addCustomFeature: (state, action: PayloadAction<string>) => {
            state.customFeatures.push(action.payload)
        },
        removeCustomFeature: (state, action: PayloadAction<number>) => {
            state.customFeatures.splice(action.payload, 1)
        },
        setCustomFeatures: (state, action: PayloadAction<string[]>) => {
            state.customFeatures = action.payload
        },
        setGeneratingPrompt: (state, action: PayloadAction<boolean>) => {
            state.isGeneratingPrompt = action.payload
        },
        setGeneratedPrompt: (state, action: PayloadAction<string>) => {
            state.generatedPrompt = action.payload
            state.isGeneratingPrompt = false
        },
        setTelegramChatId: (state, action: PayloadAction<string>) => {
            state.telegramChatId = action.payload
        },
        setTelegramConnected: (state, action: PayloadAction<boolean>) => {
            state.telegramConnected = action.payload
        },
        setCreatingAssistant: (state, action: PayloadAction<boolean>) => {
            state.isCreatingAssistant = action.payload
        },
        setCreatedAssistantId: (state, action: PayloadAction<string>) => {
            state.createdAssistantId = action.payload
            state.isCreatingAssistant = false
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        skipOnboarding: (state) => {
            state.skipped = true
            state.isActive = false
            localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
        },
        completeOnboarding: (state) => {
            state.isActive = false
            localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
        }
    }
})

export const { actions: onboardingActions } = onboardingSlice
export const { reducer: onboardingReducer } = onboardingSlice

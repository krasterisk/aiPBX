import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    OnboardingState,
    OnboardingProductPath,
    ONBOARDING_STORAGE_KEY,
    ONBOARDING_PRODUCT_KEY,
    getMaxStepForPath
} from '../types/onboarding'
import {
    trackOnboardingEvent,
    trackOnboardingStepEvent
} from '../../lib/onboardingAnalytics'

const initialState: OnboardingState = {
    isActive: false,
    currentStep: 0,
    productPath: null,
    playgroundCallCompleted: false,
    oaAnalysisCompleted: false,
    oaProjectId: null,
    postSuccessStep: null,
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
            state.productPath = null
            trackOnboardingEvent('onboarding_started')
        },
        nextStep: (state) => {
            const max = getMaxStepForPath(state.productPath)
            if (state.currentStep < max) {
                state.currentStep += 1
                trackOnboardingStepEvent(state.currentStep, state.productPath)
            }
        },
        prevStep: (state) => {
            const minStep = state.productPath ? 1 : 0
            if (state.currentStep > minStep) {
                state.currentStep -= 1
                trackOnboardingStepEvent(state.currentStep, state.productPath)
            }
        },
        goToStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload
            trackOnboardingStepEvent(state.currentStep, state.productPath)
        },
        setProductPath: (state, action: PayloadAction<OnboardingProductPath>) => {
            state.productPath = action.payload
            state.currentStep = 1
            localStorage.setItem(ONBOARDING_PRODUCT_KEY, action.payload)
        },
        setPlaygroundCallCompleted: (state, action: PayloadAction<boolean>) => {
            state.playgroundCallCompleted = action.payload
        },
        setOaAnalysisCompleted: (state, action: PayloadAction<boolean>) => {
            state.oaAnalysisCompleted = action.payload
        },
        setOaProjectId: (state, action: PayloadAction<string | null>) => {
            state.oaProjectId = action.payload
        },
        setPostSuccessStep: (state, action: PayloadAction<number | null>) => {
            state.postSuccessStep = action.payload
        },
        resetForReentry: (state) => {
            state.productPath = null
            state.currentStep = 0
            state.playgroundCallCompleted = false
            state.oaAnalysisCompleted = false
            state.oaProjectId = null
            state.postSuccessStep = null
            state.skipped = false
            localStorage.removeItem(ONBOARDING_STORAGE_KEY)
            localStorage.removeItem(ONBOARDING_PRODUCT_KEY)
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
            trackOnboardingEvent('onboarding_skipped', {
                productPath: state.productPath,
                step: state.currentStep
            })
        },
        completeOnboarding: (state) => {
            state.isActive = false
            localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
            trackOnboardingEvent('onboarding_completed', {
                productPath: state.productPath,
                step: state.currentStep
            })
        },
        pauseOnboardingOverlay: (state) => {
            state.isActive = false
        },
        resumeForPostSuccess: (state) => {
            state.isActive = true
            state.currentStep = getMaxStepForPath('assistants')
        }
    }
})

export const { actions: onboardingActions } = onboardingSlice
export const { reducer: onboardingReducer } = onboardingSlice

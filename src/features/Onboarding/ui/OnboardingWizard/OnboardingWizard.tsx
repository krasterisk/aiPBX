import React, { memo, useEffect } from 'react'
import cls from './OnboardingWizard.module.scss'
import { useSelector } from 'react-redux'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { onboardingActions, onboardingReducer } from '../../model/slices/onboardingSlice'
import {
    getOnboardingIsActive,
    getOnboardingStep
} from '../../model/selectors/onboardingSelectors'
import { ONBOARDING_STORAGE_KEY, TOTAL_STEPS } from '../../model/types/onboarding'
import { StepIndicator } from '../components/StepIndicator/StepIndicator'
import { WelcomeStep } from '../steps/WelcomeStep'
import { BusinessTypeStep } from '../steps/BusinessTypeStep'
import { TelegramStep } from '../steps/TelegramStep'
import { PublishOverviewStep } from '../steps/PublishOverviewStep'
import { CompletionStep } from '../steps/CompletionStep'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

const reducers: ReducersList = {
    onboarding: onboardingReducer
}

interface OnboardingWizardProps {
    className?: string
}

const stepsMap: Record<number, React.FC<{ className?: string }>> = {
    0: WelcomeStep,
    1: BusinessTypeStep,
    2: TelegramStep,
    3: PublishOverviewStep,
    4: CompletionStep
}

const OnboardingWizardContent = memo(({ className }: OnboardingWizardProps) => {
    const isActive = useSelector(getOnboardingIsActive)
    const currentStep = useSelector(getOnboardingStep)

    useEffect(() => {
        if (isActive) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isActive])

    if (!isActive) return null

    const StepComponent = stepsMap[currentStep] || WelcomeStep

    return (
        <VStack align="center" justify="center" max className={cls.OnboardingWizard}>
            <VStack className={cls.overlay}>{null}</VStack>
            <VStack max className={cls.wizardContainer}>
                {currentStep > 0 && (
                    <VStack max className={cls.stickyHeader}>
                        <StepIndicator
                            currentStep={currentStep}
                            totalSteps={TOTAL_STEPS}
                        />
                    </VStack>
                )}
                <VStack gap="24" className={cls.wizardContent}>
                    <VStack max className={cls.stepWrapper}>
                        <StepComponent />
                    </VStack>
                </VStack>
            </VStack>
        </VStack>
    )
})

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

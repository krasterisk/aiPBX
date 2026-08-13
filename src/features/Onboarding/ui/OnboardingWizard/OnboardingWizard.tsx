import React, { memo, useEffect, useMemo } from 'react'
import cls from './OnboardingWizard.module.scss'
import { useSelector } from 'react-redux'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { onboardingActions, onboardingReducer } from '../../model/slices/onboardingSlice'
import {
    getOnboardingIsActive,
    getOnboardingStep,
    getOnboardingProductPath,
    getOnboardingTotalSteps
} from '../../model/selectors/onboardingSelectors'
import {
    ONBOARDING_STORAGE_KEY,
    ONBOARDING_SIGNUP_KEY,
    OnboardingProductPath
} from '../../model/types/onboarding'
import { StepIndicator } from '../components/StepIndicator/StepIndicator'
import { ProductForkStep } from '../steps/ProductForkStep'
import { WelcomeStep } from '../steps/WelcomeStep'
import { BusinessTypeStep } from '../steps/BusinessTypeStep'
import { SimpleExampleStep } from '../steps/SimpleExampleStep'
import { PlaygroundGuideStep } from '../steps/PlaygroundGuideStep'
import { TrunkWidgetStep } from '../steps/TrunkWidgetStep'
import { OnboardingAnalyticsFlow } from '../analytics/OnboardingAnalyticsFlow'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

const reducers: ReducersList = {
    onboarding: onboardingReducer
}

interface OnboardingWizardProps {
    className?: string
}

const assistantsStepsMap: Record<number, React.FC<{ className?: string }>> = {
    1: WelcomeStep,
    2: BusinessTypeStep,
    3: SimpleExampleStep,
    4: PlaygroundGuideStep,
    5: TrunkWidgetStep
}

const analyticsStepsMap: Record<number, React.FC<{ className?: string }>> = {
    1: OnboardingAnalyticsFlow,
    2: OnboardingAnalyticsFlow,
    3: OnboardingAnalyticsFlow,
    4: OnboardingAnalyticsFlow,
    5: OnboardingAnalyticsFlow,
}

function resolveStepComponent (
    productPath: OnboardingProductPath | null,
    currentStep: number
): React.FC<{ className?: string }> {
    if (productPath === null || currentStep === 0) {
        return ProductForkStep
    }
    if (productPath === 'analytics') {
        return analyticsStepsMap[currentStep] ?? OnboardingAnalyticsFlow
    }
    return assistantsStepsMap[currentStep] ?? WelcomeStep
}

const OnboardingWizardContent = memo(({ className }: OnboardingWizardProps) => {
    const isActive = useSelector(getOnboardingIsActive)
    const currentStep = useSelector(getOnboardingStep)
    const productPath = useSelector(getOnboardingProductPath)
    const totalSteps = useSelector(getOnboardingTotalSteps)

    const StepComponent = useMemo(
        () => resolveStepComponent(productPath, currentStep),
        [productPath, currentStep]
    )

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

    const showStepIndicator = productPath !== null && currentStep > 0

    return (
        <VStack align="center" justify="center" max className={cls.OnboardingWizard}>
            <VStack className={cls.overlay}>{null}</VStack>
            <VStack className={cls.wizardContainer} align="stretch">
                {showStepIndicator && (
                    <VStack max className={cls.stickyHeader}>
                        <StepIndicator
                            currentStep={currentStep}
                            totalSteps={totalSteps + 1}
                        />
                    </VStack>
                )}
                <VStack max className={cls.wizardContent}>
                    <div className={cls.stepWrapper}>
                        <StepComponent />
                    </div>
                </VStack>
            </VStack>
        </VStack>
    )
})

export const OnboardingWizard = memo((props: OnboardingWizardProps) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const isSignup = localStorage.getItem(ONBOARDING_SIGNUP_KEY)
        if (isSignup) {
            localStorage.removeItem(ONBOARDING_SIGNUP_KEY)
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

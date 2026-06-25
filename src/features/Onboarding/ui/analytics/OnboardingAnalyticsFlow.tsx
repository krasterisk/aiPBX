import React, { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { projectWizardReducer } from '@/entities/Report'
import { getOnboardingStep, getOnboardingError } from '../../model/selectors/onboardingSelectors'
import {
    AnalyticsWelcomeOverviewStep,
    AnalyticsProjectSetupStep,
    AnalyticsMetricsStep,
    AnalyticsUploadStep
} from './OnboardingAnalyticsSteps'

const reducers: ReducersList = {
    projectWizard: projectWizardReducer
}

interface OnboardingAnalyticsFlowProps {
    className?: string
    onBatchStarted?: (batchId: string) => void
}

const OnboardingAnalyticsFlowContent = memo(({ className, onBatchStarted }: OnboardingAnalyticsFlowProps) => {
    const currentStep = useSelector(getOnboardingStep)
    const error = useSelector(getOnboardingError)

    const StepComponent = useMemo(() => {
        switch (currentStep) {
            case 1:
                return AnalyticsWelcomeOverviewStep
            case 2:
                return AnalyticsProjectSetupStep
            case 3:
                return AnalyticsMetricsStep
            case 4:
                return AnalyticsUploadStep
            default:
                return AnalyticsWelcomeOverviewStep
        }
    }, [currentStep])

    return (
        <VStack gap="16" max className={className}>
            {error && (
                <Text text={error} variant="error" align="center" size="s" />
            )}
            {currentStep === 4
                ? <AnalyticsUploadStep onBatchStarted={onBatchStarted} />
                : <StepComponent />}
        </VStack>
    )
})

export const OnboardingAnalyticsFlow = memo((props: OnboardingAnalyticsFlowProps) => (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
        <OnboardingAnalyticsFlowContent {...props} />
    </DynamicModuleLoader>
))

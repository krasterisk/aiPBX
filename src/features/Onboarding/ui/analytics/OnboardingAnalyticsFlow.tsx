import React, { memo, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { projectWizardReducer } from '@/entities/Report'
import { useBatchProgress } from '@/features/Calls/lib/useBatchProgress'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import {
    getOnboardingStep,
    getOnboardingError,
    getOnboardingOaProjectId,
    getOnboardingOaAnalysisCompleted
} from '../../model/selectors/onboardingSelectors'
import { trackOnboardingEvent } from '../../lib/onboardingAnalytics'
import { getRouteDashboardCallRecords } from '@/shared/const/router'
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
}

const OnboardingAnalyticsFlowContent = memo(({ className }: OnboardingAnalyticsFlowProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const currentStep = useSelector(getOnboardingStep)
    const error = useSelector(getOnboardingError)
    const projectId = useSelector(getOnboardingOaProjectId)
    const analysisCompleted = useSelector(getOnboardingOaAnalysisCompleted)
    const [navigatingToDashboard, setNavigatingToDashboard] = useState(false)

    const handleBatchFinished = useCallback((status: { completed: number; finishedAt?: string | null }) => {
        if (status.completed >= 1) {
            dispatch(onboardingActions.setOaAnalysisCompleted(true))
            trackOnboardingEvent('oa_first_analysis_complete', {
                productPath: 'analytics',
                projectId: projectId ?? undefined,
                completed: status.completed
            })
            setNavigatingToDashboard(true)
            dispatch(onboardingActions.pauseOnboardingOverlay())
            const params = new URLSearchParams({
                onboarding: 'analytics',
                tour: '1'
            })
            if (projectId) {
                params.set('projectId', projectId)
            }
            navigate(`${getRouteDashboardCallRecords()}?${params.toString()}`)
        }
    }, [dispatch, navigate, projectId])

    const batch = useBatchProgress({ onBatchFinished: handleBatchFinished })

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
                ? (
                    <AnalyticsUploadStep
                        onBatchStarted={batch.startPolling}
                        batchProgress={batch.progress}
                        batchIsActive={batch.isActive}
                        analysisComplete={analysisCompleted || navigatingToDashboard}
                    />
                )
                : <StepComponent />}
        </VStack>
    )
})

export const OnboardingAnalyticsFlow = memo((props: OnboardingAnalyticsFlowProps) => (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
        <OnboardingAnalyticsFlowContent {...props} />
    </DynamicModuleLoader>
))

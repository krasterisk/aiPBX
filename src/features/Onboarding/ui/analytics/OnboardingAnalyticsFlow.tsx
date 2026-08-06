import React, { memo, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { projectWizardReducer, BatchStatusResponse, useBatchProgress } from '@/entities/Report'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import {
    getOnboardingStep,
    getOnboardingError,
    getOnboardingOaProjectId
} from '../../model/selectors/onboardingSelectors'
import { trackOnboardingEvent } from '../../lib/onboardingAnalytics'
import { getRouteDashboardCallRecords } from '@/shared/const/router'
import {
    AnalyticsWelcomeOverviewStep,
    AnalyticsProjectSetupStep,
    AnalyticsMetricsStep,
    AnalyticsTopicsStep,
    AnalyticsUploadStep,
    AnalyticsUploadPhase
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
    const [uploadPhase, setUploadPhase] = useState<AnalyticsUploadPhase>('idle')
    const [analysisError, setAnalysisError] = useState<string | null>(null)

    const navigateToDashboardTour = useCallback(() => {
        dispatch(onboardingActions.pauseOnboardingOverlay())
        const params = new URLSearchParams({
            onboarding: 'analytics',
            tour: '1'
        })
        if (projectId) {
            params.set('projectId', projectId)
        }
        navigate(`${getRouteDashboardCallRecords()}?${params.toString()}`)
    }, [dispatch, navigate, projectId])

    const handleBatchFinished = useCallback((status: BatchStatusResponse) => {
        if (!status.finishedAt) {
            return
        }

        if (status.completed >= 1) {
            setUploadPhase('success')
            setAnalysisError(null)
            dispatch(onboardingActions.setOaAnalysisCompleted(true))
            trackOnboardingEvent('oa_first_analysis_complete', {
                productPath: 'analytics',
                projectId: projectId ?? undefined,
                completed: status.completed
            })
            navigateToDashboardTour()
            return
        }

        setUploadPhase('failed')
        setAnalysisError('analysis_failed')
        dispatch(onboardingActions.setError('analytics_analysis_failed'))
    }, [dispatch, navigateToDashboardTour, projectId])

    const batch = useBatchProgress({ onBatchFinished: handleBatchFinished })

    const handleBatchStarted = useCallback((batchId: string) => {
        setUploadPhase('processing')
        setAnalysisError(null)
        dispatch(onboardingActions.setError(null))
        batch.startPolling(batchId)
    }, [dispatch, batch])

    const handleRetryUpload = useCallback(() => {
        setUploadPhase('idle')
        setAnalysisError(null)
        dispatch(onboardingActions.setError(null))
    }, [dispatch])

    const handleViewDashboardAnyway = useCallback(() => {
        navigateToDashboardTour()
    }, [navigateToDashboardTour])

    const StepComponent = useMemo(() => {
        switch (currentStep) {
            case 1:
                return AnalyticsWelcomeOverviewStep
            case 2:
                return AnalyticsProjectSetupStep
            case 3:
                return AnalyticsMetricsStep
            case 4:
                return AnalyticsTopicsStep
            case 5:
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
            {currentStep === 5
                ? (
                    <AnalyticsUploadStep
                        onBatchStarted={handleBatchStarted}
                        batchProgress={batch.progress}
                        batchIsActive={batch.isActive}
                        uploadPhase={uploadPhase}
                        analysisError={analysisError}
                        onRetryUpload={handleRetryUpload}
                        onViewDashboard={handleViewDashboardAnyway}
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

import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { Loader } from '@/shared/ui/Loader'
import { AIMetricsOverview } from '@/features/Dashboard'
import { DashboardLayout } from '@/widgets/DashboardLayout'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { useAIAnalyticsFilters } from '../../libs/hooks/useAIAnalyticsFilters'
import { aiAnalyticsPageReducer } from '../../model/slices/aiAnalyticsPageSlice'
import { initAIAnalyticsPage } from '../../model/services/initAIAnalyticsPage'
import { dashboardPageReducer } from '@/features/Dashboard'

const reducers: ReducersList = {
    aiAnalyticsPage: aiAnalyticsPageReducer,
    dashboardPage: dashboardPageReducer,
}

const AIAnalyticsPageContent = memo(() => {
    const { t } = useTranslation('reports')
    const dispatch = useAppDispatch()

    const {
        aiAnalyticsData,
        isAIAnalyticsLoading,
        isAIAnalyticsFetching,
        isAIAnalyticsError,
        aiAnalyticsError,
        onRefetch,
    } = useAIAnalyticsFilters()

    useInitialEffect(() => {
        dispatch(initAIAnalyticsPage())
    })

    if (isAIAnalyticsError) {
        const errMsg = aiAnalyticsError && 'data' in aiAnalyticsError
            ? String((aiAnalyticsError.data as { message: string }).message)
            : ''
        return <ErrorGetData text={errMsg} onRefetch={onRefetch} />
    }

    return (
        <DashboardLayout title={String(t('AI Аналитика'))}>
            {isAIAnalyticsLoading && isAIAnalyticsFetching
                ? <HStack max justify={'center'}><Loader /></HStack>
                : <AIMetricsOverview
                    data={aiAnalyticsData}
                    isLoading={isAIAnalyticsLoading || isAIAnalyticsFetching}
                />
            }
        </DashboardLayout>
    )
})

const AIAnalyticsPage = memo(() => (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={true}>
        <AIAnalyticsPageContent />
    </DynamicModuleLoader>
))

export default AIAnalyticsPage

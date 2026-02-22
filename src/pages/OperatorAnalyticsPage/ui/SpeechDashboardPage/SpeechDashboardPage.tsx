import { memo } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { OperatorDashboard } from '@/features/OperatorAnalytics'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { operatorAnalyticsPageReducer } from '../../model/slices/operatorAnalyticsPageSlice'
import { useOperatorAnalyticsPage } from '../../libs/hooks/useOperatorAnalyticsPage'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { initOperatorAnalyticsPage } from '../../model/services/initOperatorAnalyticsPage'
import { FiltersGroup } from '@/features/Dashboard'
import { useTranslation } from 'react-i18next'

const reducers: ReducersList = { operatorAnalyticsPage: operatorAnalyticsPageReducer }

const Content = memo(() => {
    const { t } = useTranslation('reports')
    const { dashboardData, isDashboardLoading, isDashboardFetching, startDate, endDate, isInited, onChangeStartDate, onChangeEndDate, onChangePeriodTab, periodTab } = useOperatorAnalyticsPage({ skipCdr: true })
    return (
        <VStack gap={'16'} max>
            <FiltersGroup
                title={String(t('Речевая аналитика')) ?? undefined}
                tab={periodTab}
                isInited={isInited}
                startDate={startDate}
                endDate={endDate}
                onChangeTab={onChangePeriodTab}
                onChangeAssistant={() => { }}
                onChangeUserId={() => { }}
                onChangeStartDate={onChangeStartDate}
                onChangeEndDate={onChangeEndDate}
            />
            <OperatorDashboard
                data={dashboardData}
                isLoading={isDashboardLoading || isDashboardFetching}
                onChangeProjectId={() => { }}
            />
        </VStack>
    )
})

const SpeechDashboardPage = memo(() => {
    const dispatch = useAppDispatch()
    useInitialEffect(() => { dispatch(initOperatorAnalyticsPage()) })
    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={true}>
            <Content />
        </DynamicModuleLoader>
    )
})

export default SpeechDashboardPage

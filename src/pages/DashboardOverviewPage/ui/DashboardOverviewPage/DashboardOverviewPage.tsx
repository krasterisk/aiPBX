import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { DashboardLayout } from '@/widgets/DashboardLayout'
import { DashboardStatistics, DashboardCharts, useDashboardFilters, dashboardPageReducer } from '@/features/Dashboard'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Loader } from '@/shared/ui/Loader'

const reducers: ReducersList = { dashboardPage: dashboardPageReducer }

const DashboardOverviewContent = memo(() => {
    const { t } = useTranslation('reports')
    const { data, isLoading, isFetching } = useDashboardFilters()

    return (
        <DashboardLayout title={String(t('Сводный дашборд'))}>
            {isLoading && isFetching
                ? <HStack max justify={'center'}><Loader /></HStack>
                : <VStack gap={'16'} max>
                    <DashboardStatistics data={data} isLoading={isLoading || isFetching} />
                    <DashboardCharts data={data} />
                </VStack>
            }
        </DashboardLayout>
    )
})

const DashboardOverviewPage = memo(() => (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
        <DashboardOverviewContent />
    </DynamicModuleLoader>
))

export default DashboardOverviewPage

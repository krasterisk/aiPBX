import { memo, useState, useCallback } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { OperatorDashboard } from '@/features/OperatorAnalytics'
import { useGetOperatorDashboard } from '@/entities/Report'
import { FiltersGroup } from '@/features/Dashboard'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

type PeriodTab = 'day' | 'week' | 'month' | 'year' | 'custom'

const DashboardOverviewPage = memo(() => {
    const { t } = useTranslation('reports')

    const [periodTab, setPeriodTab] = useState<PeriodTab>('week')
    const [startDate, setStartDate] = useState(
        dayjs().startOf('week').format('YYYY-MM-DD')
    )
    const [endDate, setEndDate] = useState(
        dayjs().endOf('week').format('YYYY-MM-DD')
    )
    const [projectId, setProjectId] = useState('')

    const {
        data: dashboardData,
        isLoading: isDashboardLoading,
        isFetching: isDashboardFetching
    } = useGetOperatorDashboard(
        { startDate, endDate, projectId },
        { skip: !startDate || !endDate }
    )

    const onChangePeriodTab = useCallback((value: string) => {
        setPeriodTab(value as PeriodTab)
    }, [])

    const onChangeProjectId = useCallback((value: string) => {
        setProjectId(value)
    }, [])

    return (
        <VStack gap={'16'} max>
            <FiltersGroup
                title={String(t('Сводный Дашборд'))}
                tab={periodTab}
                isInited={true}
                startDate={startDate}
                endDate={endDate}
                onChangeTab={onChangePeriodTab}
                onChangeAssistant={() => { }}
                onChangeUserId={() => { }}
                onChangeStartDate={setStartDate}
                onChangeEndDate={setEndDate}
            />
            <OperatorDashboard
                data={dashboardData}
                isLoading={isDashboardLoading || isDashboardFetching}
                projectId={projectId}
                onChangeProjectId={onChangeProjectId}
            />
        </VStack>
    )
})

export default DashboardOverviewPage

import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { TabsUi, TabItem } from '@/shared/ui/redesigned/TabsUi'
import { Text } from '@/shared/ui/redesigned/Text'
import { OperatorDashboardResponse, OperatorCdrResponse } from '@/entities/Report'
import { OperatorDashboard } from '../OperatorDashboard/OperatorDashboard'
import { OperatorCdrTable } from '../OperatorCdrTable/OperatorCdrTable'
import { OperatorProjectManager } from '../OperatorProjectManager/OperatorProjectManager'
import { OperatorApiTokens } from '../OperatorApiTokens/OperatorApiTokens'
import { OverviewTab } from '@/pages/OperatorAnalyticsPage/model/types/operatorAnalyticsPageSchema'
import cls from './OperatorAnalyticsOverview.module.scss'

interface OperatorAnalyticsOverviewProps {
    className?: string
    dashboardData?: OperatorDashboardResponse
    cdrData?: OperatorCdrResponse
    isDashboardLoading?: boolean
    isCdrLoading?: boolean
    projectId?: string
    page?: number
    search?: string
    sortField?: string
    sortOrder?: 'ASC' | 'DESC'
    overviewTab: OverviewTab
    onChangeOverviewTab: (value: OverviewTab) => void
    onChangeProjectId: (value: string) => void
    onChangePage: (value: number) => void
    onChangeSearch?: (value: string) => void
    onChangeSort?: (field: string, order: 'ASC' | 'DESC') => void
}

export const OperatorAnalyticsOverview = memo((props: OperatorAnalyticsOverviewProps) => {
    const {
        dashboardData,
        cdrData,
        isDashboardLoading,
        isCdrLoading,
        projectId,
        page,
        search,
        sortField,
        sortOrder,
        overviewTab,
        onChangeOverviewTab,
        onChangeProjectId,
        onChangePage,
        onChangeSearch,
        onChangeSort
    } = props

    const { t } = useTranslation('reports')

    const tabs: TabItem[] = [
        { value: 'dashboard', content: <Text text={t('Дашборд')} /> },
        { value: 'cdr', content: <Text text={t('Записи звонков')} /> },
        { value: 'projects', content: <Text text={t('Проекты')} /> },
        { value: 'tokens', content: <Text text={t('API Токены')} /> }
    ]

    const onTabClick = useCallback((tab: TabItem) => {
        onChangeOverviewTab(tab.value as OverviewTab)
    }, [onChangeOverviewTab])

    return (
        <VStack max gap={'16'} className={cls.OperatorAnalyticsOverview}>
            <TabsUi
                wrap="wrap"
                tabs={tabs}
                value={overviewTab}
                onTabClick={onTabClick}
            />
            {overviewTab === 'dashboard' && (
                <OperatorDashboard
                    data={dashboardData}
                    isLoading={isDashboardLoading}
                    projectId={projectId}
                    onChangeProjectId={onChangeProjectId}
                />
            )}
            {overviewTab === 'cdr' && (
                <OperatorCdrTable
                    data={cdrData}
                    isLoading={isCdrLoading}
                    projectId={projectId}
                    page={page}
                    search={search}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onChangeProjectId={onChangeProjectId}
                    onChangePage={onChangePage}
                    onChangeSearch={onChangeSearch}
                    onChangeSort={onChangeSort}
                />
            )}
            {overviewTab === 'projects' && (
                <OperatorProjectManager />
            )}
            {overviewTab === 'tokens' && (
                <OperatorApiTokens />
            )}
        </VStack>
    )
})

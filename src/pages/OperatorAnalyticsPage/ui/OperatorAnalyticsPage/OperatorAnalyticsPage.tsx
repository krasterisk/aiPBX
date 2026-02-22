import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { Loader } from '@/shared/ui/Loader'
import { FiltersGroup } from '@/features/Dashboard'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { operatorAnalyticsPageReducer } from '../../model/slices/operatorAnalyticsPageSlice'
import { initOperatorAnalyticsPage } from '../../model/services/initOperatorAnalyticsPage'
import { useOperatorAnalyticsPage } from '../../libs/hooks/useOperatorAnalyticsPage'
import { useUrlSyncedAnalyticsState } from '../../libs/hooks/useUrlSyncedAnalyticsState'
import { OperatorAnalyticsOverview } from '@/features/OperatorAnalytics'
import cls from './OperatorAnalyticsPage.module.scss'

const reducers: ReducersList = {
    operatorAnalyticsPage: operatorAnalyticsPageReducer
}

const OperatorAnalyticsPageContent = memo(() => {
    const { t } = useTranslation('reports')
    useUrlSyncedAnalyticsState()

    const {
        periodTab,
        overviewTab,
        startDate,
        endDate,
        operatorName,
        projectId,
        page,
        search,
        sortField,
        sortOrder,
        isInited,
        dashboardData,
        isDashboardLoading,
        isDashboardFetching,
        isDashboardError,
        dashboardError,
        cdrData,
        isCdrLoading,
        isCdrFetching,
        isCdrError,
        onRefetch,
        onChangePeriodTab,
        onChangeOverviewTab,
        onChangeStartDate,
        onChangeEndDate,
        onChangeOperatorName,
        onChangeProjectId,
        onChangePage,
        onChangeSearch,
        onChangeSort
    } = useOperatorAnalyticsPage()

    if (isDashboardError) {
        const errMsg = dashboardError && 'data' in dashboardError
            ? String((dashboardError.data as { message: string }).message)
            : ''

        return (
            <ErrorGetData
                text={errMsg}
                onRefetch={onRefetch}
            />
        )
    }

    if (isInited && isDashboardLoading && isDashboardFetching) {
        return (
            <HStack max justify={'center'} align={'center'}>
                <Loader />
            </HStack>
        )
    }

    return (
        <VStack max gap={'16'} className={cls.OperatorAnalyticsPage}>
            <FiltersGroup
                title={t('Аналитика операторов') ?? undefined}
                tab={periodTab}
                isInited={isInited}
                startDate={startDate}
                endDate={endDate}
                onChangeTab={onChangePeriodTab}
                onChangeAssistant={() => { }}
                onChangeUserId={() => { }}
                onChangeEndDate={onChangeEndDate}
                onChangeStartDate={onChangeStartDate}
            />
            <OperatorAnalyticsOverview
                dashboardData={dashboardData}
                cdrData={cdrData}
                isDashboardLoading={isDashboardLoading || isDashboardFetching}
                isCdrLoading={isCdrLoading || isCdrFetching}
                projectId={projectId}
                page={page}
                search={search}
                sortField={sortField}
                sortOrder={sortOrder}
                overviewTab={overviewTab}
                onChangeOverviewTab={onChangeOverviewTab}
                onChangeProjectId={onChangeProjectId}
                onChangePage={onChangePage}
                onChangeSearch={onChangeSearch}
                onChangeSort={onChangeSort}
            />
        </VStack>
    )
})

const OperatorAnalyticsPage = memo(() => {
    const dispatch = useAppDispatch()

    useInitialEffect(() => {
        dispatch(initOperatorAnalyticsPage())
    })

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={true}>
            <OperatorAnalyticsPageContent />
        </DynamicModuleLoader>
    )
})

export default OperatorAnalyticsPage

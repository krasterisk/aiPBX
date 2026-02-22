import { memo } from 'react'
import { OperatorCdrTable } from '@/features/OperatorAnalytics'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { operatorAnalyticsPageReducer } from '../../model/slices/operatorAnalyticsPageSlice'
import { useOperatorAnalyticsPage } from '../../libs/hooks/useOperatorAnalyticsPage'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { initOperatorAnalyticsPage } from '../../model/services/initOperatorAnalyticsPage'

const reducers: ReducersList = { operatorAnalyticsPage: operatorAnalyticsPageReducer }

const Content = memo(() => {
    const {
        cdrData, isCdrLoading, isCdrFetching,
        periodTab, startDate, endDate, isInited, projectId, page, search, sortField, sortOrder,
        onChangePeriodTab, onChangeStartDate, onChangeEndDate,
        onChangeProjectId, onChangePage, onChangeSearch, onChangeSort
    } = useOperatorAnalyticsPage({ skipDashboard: true })

    return (
        <OperatorCdrTable
            data={cdrData}
            isLoading={isCdrLoading || isCdrFetching}
            tab={periodTab}
            startDate={startDate}
            endDate={endDate}
            isInited={isInited}
            projectId={projectId}
            page={page}
            search={search}
            sortField={sortField}
            sortOrder={sortOrder}
            onChangeTab={onChangePeriodTab}
            onChangeStartDate={onChangeStartDate}
            onChangeEndDate={onChangeEndDate}
            onChangeProjectId={onChangeProjectId}
            onChangePage={onChangePage}
            onChangeSearch={onChangeSearch}
            onChangeSort={onChangeSort}
        />
    )
})

const SpeechCdrPage = memo(() => {
    const dispatch = useAppDispatch()
    useInitialEffect(() => { dispatch(initOperatorAnalyticsPage()) })
    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={true}>
            <Content />
        </DynamicModuleLoader>
    )
})

export default SpeechCdrPage

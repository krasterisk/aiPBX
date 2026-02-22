import { useSelector } from 'react-redux'
import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
    getOperatorAnalyticsEndDate,
    getOperatorAnalyticsInited,
    getOperatorAnalyticsOperatorName,
    getOperatorAnalyticsOverviewTab,
    getOperatorAnalyticsPage,
    getOperatorAnalyticsProjectId,
    getOperatorAnalyticsSearch,
    getOperatorAnalyticsSortField,
    getOperatorAnalyticsSortOrder,
    getOperatorAnalyticsStartDate,
    getOperatorAnalyticsPeriodTab
} from '../../model/selectors/operatorAnalyticsPageSelectors'
import { operatorAnalyticsPageActions } from '../../model/slices/operatorAnalyticsPageSlice'
import { useGetOperatorCdrs, useGetOperatorDashboard } from '@/entities/Report'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'
import { OverviewTab, SortableField } from '../../model/types/operatorAnalyticsPageSchema'

interface UseOperatorAnalyticsPageOptions {
    skipDashboard?: boolean
    skipCdr?: boolean
}

export function useOperatorAnalyticsPage(options?: UseOperatorAnalyticsPageOptions) {
    const { skipDashboard = false, skipCdr = false } = options ?? {}
    const dispatch = useAppDispatch()
    const periodTab = useSelector(getOperatorAnalyticsPeriodTab)
    const overviewTab = useSelector(getOperatorAnalyticsOverviewTab)
    const startDate = useSelector(getOperatorAnalyticsStartDate)
    const endDate = useSelector(getOperatorAnalyticsEndDate)
    const operatorName = useSelector(getOperatorAnalyticsOperatorName)
    const projectId = useSelector(getOperatorAnalyticsProjectId)
    const page = useSelector(getOperatorAnalyticsPage)
    const search = useSelector(getOperatorAnalyticsSearch)
    const sortField = useSelector(getOperatorAnalyticsSortField)
    const sortOrder = useSelector(getOperatorAnalyticsSortOrder)
    const isInited = useSelector(getOperatorAnalyticsInited)

    const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('')
    const debouncedSearch = useDebounce((search: string) => { setDebouncedSearchValue(search) }, 500)

    const skip = !startDate || !endDate

    const {
        data: dashboardData,
        isLoading: isDashboardLoading,
        isFetching: isDashboardFetching,
        isError: isDashboardError,
        error: dashboardError,
        refetch: refetchDashboard
    } = useGetOperatorDashboard({ startDate, endDate, operatorName, projectId }, { skip: skip || skipDashboard })

    const {
        data: cdrData,
        isLoading: isCdrLoading,
        isFetching: isCdrFetching,
        isError: isCdrError,
        refetch: refetchCdr
    } = useGetOperatorCdrs({ startDate, endDate, operatorName, projectId, page, limit: 20, search: debouncedSearchValue, sortField, sortOrder }, { skip: skip || skipCdr })

    const onRefetch = useCallback(() => {
        refetchDashboard()
        refetchCdr()
    }, [refetchDashboard, refetchCdr])

    const onChangePeriodTab = useCallback((value: string) => {
        dispatch(operatorAnalyticsPageActions.setPeriodTab(value as any))
    }, [dispatch])

    const onChangeOverviewTab = useCallback((value: OverviewTab) => {
        dispatch(operatorAnalyticsPageActions.setOverviewTab(value))
    }, [dispatch])

    const onChangeStartDate = useCallback((value: string) => {
        dispatch(operatorAnalyticsPageActions.setStartDate(value))
    }, [dispatch])

    const onChangeEndDate = useCallback((value: string) => {
        dispatch(operatorAnalyticsPageActions.setEndDate(value))
    }, [dispatch])

    const onChangeOperatorName = useCallback((value: string) => {
        dispatch(operatorAnalyticsPageActions.setOperatorName(value))
    }, [dispatch])

    const onChangeProjectId = useCallback((value: string) => {
        dispatch(operatorAnalyticsPageActions.setProjectId(value))
    }, [dispatch])

    const onChangePage = useCallback((value: number) => {
        dispatch(operatorAnalyticsPageActions.setPage(value))
    }, [dispatch])

    const onChangeSearch = useCallback((value: string) => {
        dispatch(operatorAnalyticsPageActions.setSearch(value))
        debouncedSearch(value)
    }, [debouncedSearch, dispatch])

    const onChangeSort = useCallback((field: string, order: 'ASC' | 'DESC') => {
        dispatch(operatorAnalyticsPageActions.setSort({ field: field as SortableField, order }))
    }, [dispatch])

    return {
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
    }
}

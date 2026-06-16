import { useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
  getReportAssistantId,
  getReportAssistants,
  getReportEndDate,
  getReportsHasMore,
  getReportsInited,
  getReportsPageLimit,
  getReportsPageNum,
  getReportsPageSearch,
  getReportsPageView,
  getReportsTab,
  getReportStartDate,
  getReportUserId,
  getReportSortField,
  getReportSortOrder,
  getReportSource,
  getReportsListGeneration,
  getReportCsatFilter,
} from '../model/selectors/reportSelectors'
import { reportsPageActions } from '../model/slices/reportsPageSlice'
import { useGetReports } from '../api/reportApi'
import { serializeCsatFilter } from '../lib/csatFilter'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'
import { CdrSource } from '../model/types/report'
import type { CsatFilterValue } from '../lib/csatFilter'

export function useReportFilters() {
  const page = useSelector(getReportsPageNum)
  const limit = useSelector(getReportsPageLimit)
  const hasMore = useSelector(getReportsHasMore)
  const view = useSelector(getReportsPageView)
  const tab = useSelector(getReportsTab)
  const search = useSelector(getReportsPageSearch)
  const startDate = useSelector(getReportStartDate)
  const endDate = useSelector(getReportEndDate)
  const clientId = useSelector(getReportUserId)
  const assistantId = useSelector(getReportAssistantId)
  const assistants = useSelector(getReportAssistants)
  const isInited = useSelector(getReportsInited)
  const sortField = useSelector(getReportSortField)
  const sortOrder = useSelector(getReportSortOrder)
  const source = useSelector(getReportSource)
  const listGeneration = useSelector(getReportsListGeneration)
  const csatFilter = useSelector(getReportCsatFilter)

  const authData = useSelector(getUserAuthData)
  const isAdmin = useSelector(isUserAdmin)
  const userId = !isAdmin ? authData?.vpbx_user_id || authData?.id : clientId

  const dispatch = useAppDispatch()
  const [newSearch, setNewSearch] = useState<string>('')

  const [pollingInterval, setPollingInterval] = useState(0)

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch
  } = useGetReports({
    page,
    limit,
    search: newSearch,
    userId,
    assistantId,
    startDate,
    endDate,
    sortField,
    sortOrder,
    source,
    listGeneration,
    csat: serializeCsatFilter(csatFilter),
  }, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval
  })

  useEffect(() => {
    // Check for any items in 'processing' status. 
    // We check both the top-level status and the analytics status if available.
    if (data?.rows) {
      const hasProcessing = data.rows.some((report: any) =>
        report.status?.toLowerCase() === 'processing' ||
        report.analytics?.status?.toLowerCase() === 'processing'
      )

      if (hasProcessing) {
        if (pollingInterval !== 5000) setPollingInterval(5000)
      } else if (!isFetching && !isLoading) {
        if (pollingInterval !== 0) setPollingInterval(0)
      }
    }
  }, [data?.rows, isFetching, isLoading, pollingInterval])

  const onRefetch = useCallback(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (data && !isLoading && !isFetching) {
      const totalPages = Math.ceil(data.count / limit)
      const isHasMore = page < totalPages
      dispatch(reportsPageActions.setHasMore(isHasMore))
    }
  }, [data, dispatch, isLoading, isFetching, limit, page])

  const onLoadNext = useCallback(() => {
    console.log('onLoadNext')
    if (data && hasMore && !isLoading && !isFetching) {
      const totalPages = Math.ceil(data.count / limit)
      const isHasMore = page < totalPages
      dispatch(reportsPageActions.setHasMore(isHasMore))
      if (isHasMore) {
        dispatch(reportsPageActions.setPage(page + 1))
      }
    }
  }, [data, dispatch, hasMore, isFetching, isLoading, limit, page])

  const debouncedSearch = useDebounce((search: string) => { setNewSearch(search) }, 500)

  const onChangeSearch = useCallback((search: string) => {
    dispatch(reportsPageActions.setSearch(search))
    dispatch(reportsPageActions.resetListQuery())
    debouncedSearch(search)
  }, [debouncedSearch, dispatch])

  const onChangePage = useCallback((page: number) => {
    dispatch(reportsPageActions.setPage(page))
  }, [dispatch])

  const onChangeTab = useCallback((value: string) => {
    dispatch(reportsPageActions.setTab(value))
    dispatch(reportsPageActions.resetListQuery())
  }, [dispatch])

  const onChangeHasMore = useCallback((hasMore: boolean) => {
    dispatch(reportsPageActions.setHasMore(hasMore))
  }, [dispatch])

  const onChangeStartDate = useCallback((value: string) => {
    dispatch(reportsPageActions.setStartDate(value))
    dispatch(reportsPageActions.resetListQuery())
  }, [dispatch])

  const onChangeUserId = useCallback((clientId: string) => {
    dispatch(reportsPageActions.setUserId(clientId))
    dispatch(reportsPageActions.resetListQuery())
  }, [dispatch])

  const onChangeAssistant = useCallback((event: any, assistant: AssistantOptions[]) => {
    const newAssistantIds = assistant.map(item => item.id)
    dispatch(reportsPageActions.setAssistantId(newAssistantIds))
    dispatch(reportsPageActions.setAssistant(assistant))
    dispatch(reportsPageActions.resetListQuery())
  }, [dispatch])

  const onChangeEndDate = useCallback((value: string) => {
    dispatch(reportsPageActions.setEndDate(value))
    dispatch(reportsPageActions.resetListQuery())
  }, [dispatch])

  const onChangeSort = useCallback((field: string) => {
    dispatch(reportsPageActions.applySort(field))
  }, [dispatch])

  const onChangeSource = useCallback((value: CdrSource | undefined) => {
    dispatch(reportsPageActions.setSource(value))
    dispatch(reportsPageActions.resetListQuery())
  }, [dispatch])

  const onToggleCsatFilter = useCallback((value: CsatFilterValue) => {
    dispatch(reportsPageActions.toggleCsatFilter(value))
  }, [dispatch])

  const onClearCsatFilter = useCallback(() => {
    dispatch(reportsPageActions.clearCsatFilter())
  }, [dispatch])

  return {
    hasMore,
    page,
    limit,
    view,
    search,
    startDate,
    endDate,
    tab,
    isError,
    isLoading,
    error,
    data,
    clientId,
    isInited,
    assistantId,
    assistants,
    sortField,
    sortOrder,
    source,
    csatFilter,
    onChangeAssistant,
    onChangeUserId,
    onChangeStartDate,
    onChangeEndDate,
    onChangeTab,
    onChangeSearch,
    onChangeHasMore,
    onChangePage,
    onChangeSort,
    onChangeSource,
    onToggleCsatFilter,
    onClearCsatFilter,
    onRefetch,
    onLoadNext
  }
}

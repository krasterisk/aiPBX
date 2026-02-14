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
  getReportSortOrder
} from '../model/selectors/reportSelectors'
import { reportsPageActions } from '../model/slices/reportsPageSlice'
import { useGetReports } from '../api/reportApi'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'

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

  const authData = useSelector(getUserAuthData)
  const isAdmin = useSelector(isUserAdmin)
  const userId = !isAdmin ? authData?.vpbx_user_id || authData?.id : clientId

  const dispatch = useAppDispatch()
  const [newSearch, setNewSearch] = useState<string>('')

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
    sortOrder
  }, {
    refetchOnFocus: false,
    refetchOnReconnect: false
  })

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
    dispatch(reportsPageActions.setPage(1))
    debouncedSearch(search)
  }, [debouncedSearch, dispatch])

  const onChangePage = useCallback((page: number) => {
    dispatch(reportsPageActions.setPage(page))
  }, [dispatch])

  const onChangeTab = useCallback((value: string) => {
    dispatch(reportsPageActions.setTab(value))
    // const now = dayjs()
    // const newStart = now.startOf(value as OpUnitType).format('YYYY-MM-DD')
    // const newEnd = now.endOf(value as OpUnitType).format('YYYY-MM-DD')
    //
    // dispatch(reportsPageActions.setStartDate(newStart))
    // dispatch(reportsPageActions.setEndDate(newEnd))
    dispatch(reportsPageActions.setPage(1))
  }, [dispatch])

  const onChangeHasMore = useCallback((hasMore: boolean) => {
    dispatch(reportsPageActions.setHasMore(hasMore))
  }, [dispatch])

  const onChangeStartDate = useCallback((value: string) => {
    dispatch(reportsPageActions.setStartDate(value))
  }, [dispatch])

  const onChangeUserId = useCallback((clientId: string) => {
    dispatch(reportsPageActions.setUserId(clientId))
    dispatch(reportsPageActions.setPage(1))
  }, [dispatch])

  const onChangeAssistant = useCallback((event: any, assistant: AssistantOptions[]) => {
    const newAssistantIds = assistant.map(item => item.id)
    dispatch(reportsPageActions.setAssistantId(newAssistantIds))
    dispatch(reportsPageActions.setAssistant(assistant))
    dispatch(reportsPageActions.setPage(1))
  }, [dispatch])

  const onChangeEndDate = useCallback((value: string) => {
    dispatch(reportsPageActions.setEndDate(value))
  }, [dispatch])

  const onChangeSort = useCallback((field: string) => {
    if (sortField === field) {
      dispatch(reportsPageActions.setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC'))
    } else {
      dispatch(reportsPageActions.setSortField(field))
      dispatch(reportsPageActions.setSortOrder('ASC'))
    }
    dispatch(reportsPageActions.setPage(1))
  }, [dispatch, sortField, sortOrder])

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
    onChangeAssistant,
    onChangeUserId,
    onChangeStartDate,
    onChangeEndDate,
    onChangeTab,
    onChangeSearch,
    onChangeHasMore,
    onChangePage,
    onChangeSort,
    onRefetch,
    onLoadNext
  }
}

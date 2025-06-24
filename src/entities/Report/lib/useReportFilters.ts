import { useSelector } from 'react-redux'
import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
  getReportEndDate,
  getReportsHasMore, getReportsInited,
  getReportsPageLimit,
  getReportsPageNum,
  getReportsPageSearch,
  getReportsPageView,
  getReportsTab,
  getReportStartDate,
  getReportUserId
} from '../model/selectors/reportSelectors'
import { reportsPageActions } from '../model/slices/reportsPageSlice'
import { ContentView } from '../../Content'
import { useGetReports } from '../api/reportApi'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'
import { ClientOptions, getUserAuthData, isUserAdmin } from '@/entities/User'

export function useReportFilters () {
  const page = useSelector(getReportsPageNum)
  const limit = useSelector(getReportsPageLimit)
  const hasMore = useSelector(getReportsHasMore)
  const view = useSelector(getReportsPageView)
  const tab = useSelector(getReportsTab)
  const search = useSelector(getReportsPageSearch)
  const startDate = useSelector(getReportStartDate)
  const endDate = useSelector(getReportEndDate)
  const clientId = useSelector(getReportUserId)
  const isInited = useSelector(getReportsInited)

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
    startDate,
    endDate
  }, {
    refetchOnFocus: false,
    refetchOnReconnect: false
  })

  const onRefetch = useCallback(() => {
    refetch()
  }, [refetch])

  const onLoadNext = useCallback(() => {
    if (data && hasMore && !isLoading && !isFetching) {
      const totalPages = Math.ceil(data.count / limit)
      const isHasMore = page < totalPages
      dispatch(reportsPageActions.setHasMore(isHasMore))
      if (isHasMore) {
        dispatch(reportsPageActions.setPage(page + 1))
      }
    }
  }, [data, dispatch, hasMore, isFetching, isLoading, limit, page])

  const onChangeView = useCallback((view: ContentView) => {
    dispatch(reportsPageActions.setView(view))
  }, [dispatch])

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

  const onChangeUserId = useCallback((event: any, client: ClientOptions) => {
    const newUserId = client ? client.id || userId || '' : ''
    dispatch(reportsPageActions.setUserId(newUserId))
    dispatch(reportsPageActions.setPage(1))
  }, [dispatch, userId])

  const onChangeEndDate = useCallback((value: string) => {
    dispatch(reportsPageActions.setEndDate(value))
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
    onChangeUserId,
    onChangeStartDate,
    onChangeEndDate,
    onChangeView,
    onChangeTab,
    onChangeSearch,
    onChangeHasMore,
    onChangePage,
    onRefetch,
    onLoadNext
  }
}

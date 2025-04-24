import { useSelector } from 'react-redux'
import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
  getReportsHasMore,
  getReportsPageLimit,
  getReportsPageNum,
  getReportsPageSearch,
  getReportsPageView
} from '../model/selectors/reportSelectors'
import { reportsPageActions } from '../model/slices/reportsPageSlice'
import { ContentView } from '../../Content'
import { useGetReports } from '../api/reportApi'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'

export function useReportFilters () {
  const page = useSelector(getReportsPageNum)
  const limit = useSelector(getReportsPageLimit)
  const hasMore = useSelector(getReportsHasMore)
  const view = useSelector(getReportsPageView)
  const search = useSelector(getReportsPageSearch)

  const dispatch = useAppDispatch()
  const [newSearch, setNewSearch] = useState<string>('')

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch
  } = useGetReports({ page, limit, search: newSearch }, {
    refetchOnFocus: true,
    refetchOnReconnect: true
  })

  const onRefetch = useCallback(() => {
    refetch()
  }, [refetch])

  const onLoadNext = useCallback(() => {
    if (data && hasMore && !isLoading && !isFetching) {
      const isHasMore = page < data.count / limit
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

  const onChangeHasMore = useCallback((hasMore: boolean) => {
    dispatch(reportsPageActions.setHasMore(hasMore))
  }, [dispatch])

  return {
    hasMore,
    page,
    limit,
    view,
    search,
    isError,
    isLoading,
    error,
    data,
    onChangeView,
    onChangeSearch,
    onChangeHasMore,
    onChangePage,
    onRefetch,
    onLoadNext
  }
}

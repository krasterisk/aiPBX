import { useSelector } from 'react-redux'
import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
  getUsersHasMore,
  getUsersPageLimit,
  getUsersPageNum,
  getUsersPageOrder,
  getUsersPageSearch,
  getUsersPageSort,
  getUsersPageView,
  getUsersTab
} from '../../model/selectors/usersPageSelectors'
import { usersPageActions } from '../../model/slice/usersPageSlice'
import { ContentView } from '../../../Content'
import { useGetUsers } from '../../api/usersApi'
import { UserSortField } from '../../model/consts/consts'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'

export function useUserFilters () {
  const page = useSelector(getUsersPageNum)
  const limit = useSelector(getUsersPageLimit)
  const order = useSelector(getUsersPageOrder)
  const hasMore = useSelector(getUsersHasMore)
  const view = useSelector(getUsersPageView)
  const sort = useSelector(getUsersPageSort)
  const tab = useSelector(getUsersTab)
  const search = useSelector(getUsersPageSearch)

  const dispatch = useAppDispatch()
  const [newSearch, setNewSearch] = useState<string>('')

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch
  } = useGetUsers(
    {
      page, limit, sort, search: newSearch, order
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true
    })

  const onRefetch = useCallback(() => {
    refetch()
  }, [refetch])

  const onLoadNext = useCallback(() => {
    if (data && hasMore && !isLoading && !isFetching) {
      const isHasMore = page < data.count / limit
      dispatch(usersPageActions.setHasMore(isHasMore))
      if (isHasMore) {
        dispatch(usersPageActions.setPage(page + 1))
      }
    }
  }, [data, dispatch, hasMore, isFetching, isLoading, limit, page])

  const onChangeView = useCallback((view: ContentView) => {
    dispatch(usersPageActions.setView(view))
  }, [dispatch])

  const onChangeSort = useCallback((sort: UserSortField) => {
    dispatch(usersPageActions.setSort(sort))
    dispatch(usersPageActions.setPage(1))
  }, [dispatch])

  const debouncedSearch = useDebounce((search: string) => { setNewSearch(search) }, 500)

  const onChangeSearch = useCallback((search: string) => {
    dispatch(usersPageActions.setSearch(search))
    dispatch(usersPageActions.setPage(1))
    debouncedSearch(search)
  }, [debouncedSearch, dispatch])

  const onChangePage = useCallback((page: number) => {
    dispatch(usersPageActions.setPage(page))
  }, [dispatch])

  const onChangeHasMore = useCallback((hasMore: boolean) => {
    dispatch(usersPageActions.setHasMore(hasMore))
  }, [dispatch])

  // const onChangeOrder = useCallback((order: SortOrder) => {
  //   dispatch(usersPageActions.setOrder(order))
  //   dispatch(usersPageActions.setPage(1))
  // }, [dispatch])

  const onChangeTab = useCallback((value: string) => {
    dispatch(usersPageActions.setTab(value))
    dispatch(usersPageActions.setPage(1))
  }, [dispatch])

  return {
    hasMore,
    page,
    limit,
    view,
    sort,
    order,
    tab,
    search,
    isError,
    isLoading,
    error,
    data,
    onChangeView,
    onChangeSort,
    onChangeTab,
    onChangeSearch,
    onChangeHasMore,
    onChangePage,
    onRefetch,
    onLoadNext
  }
}

import { useSelector } from 'react-redux'
import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
  getToolsHasMore,
  getToolsPageLimit,
  getToolsPageNum,
  getToolsPageSearch,
  getToolsPageView,
  getToolsRefreshOnFocus,
  getToolsUserId
} from '../../model/selectors/toolsPageSelectors'
import { toolsPageActions } from '../../model/slices/toolsPageSlice'
import { useTools } from '../../api/toolsApi'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'
import { getUserAuthData } from '../../../User/model/selectors/getUserAuthData/getUserAuthData'
import { isUserAdmin } from '../../../User/model/selectors/roleSelector'
import { ContentView } from '../../../Content'
import { ClientOptions } from '../../../User/model/types/user'

export function useToolsFilters () {
  const page = useSelector(getToolsPageNum)
  const limit = useSelector(getToolsPageLimit)
  const hasMore = useSelector(getToolsHasMore)
  const view = useSelector(getToolsPageView)
  const refetchOnFocus = useSelector(getToolsRefreshOnFocus)
  const search = useSelector(getToolsPageSearch)
  const clientId = useSelector(getToolsUserId)
  const authData = useSelector(getUserAuthData)
  const isAdmin = useSelector(isUserAdmin)

  const userId = !isAdmin ? authData?.id || authData?.id : clientId

  const dispatch = useAppDispatch()
  const [newSearch, setNewSearch] = useState<string>('')

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch
  } = useTools({
    page,
    limit,
    search: newSearch,
    userId
  }, {
    // pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
    refetchOnFocus,
    refetchOnReconnect: true
  })

  const onRefetch = useCallback(() => {
    refetch()
  }, [refetch])

  const onLoadNext = useCallback(() => {
    if (data && hasMore && !isLoading && !isFetching) {
      const isHasMore = page < data.count / limit
      dispatch(toolsPageActions.setHasMore(isHasMore))
      if (isHasMore) {
        dispatch(toolsPageActions.setPage(page + 1))
      }
    }
  }, [data, dispatch, hasMore, isFetching, isLoading, limit, page])

  const onChangeView = useCallback((view: ContentView) => {
    dispatch(toolsPageActions.setView(view))
  }, [dispatch])

  const onChangeUserId = useCallback((event: any, client: ClientOptions) => {
    // const newUserId = client ? client.id || userId || '' : ''
    dispatch(toolsPageActions.setUser(client))
    dispatch(toolsPageActions.setPage(1))
  }, [dispatch])

  const debouncedSearch = useDebounce((search: string) => { setNewSearch(search) }, 500)

  const onChangeSearch = useCallback((search: string) => {
    dispatch(toolsPageActions.setSearch(search))
    dispatch(toolsPageActions.setPage(1))
    debouncedSearch(search)
  }, [debouncedSearch, dispatch])

  const onChangePage = useCallback((page: number) => {
    dispatch(toolsPageActions.setPage(page))
  }, [dispatch])

  const onChangeHasMore = useCallback((hasMore: boolean) => {
    dispatch(toolsPageActions.setHasMore(hasMore))
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
    clientId,
    onChangeView,
    onChangeSearch,
    onChangeHasMore,
    onChangePage,
    onRefetch,
    onLoadNext,
    onChangeUserId
  }
}

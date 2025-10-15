import { useSelector } from 'react-redux'
import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
  getPbxServersHasMore,
  getPbxServersPageLimit,
  getPbxServersPageNum,
  getPbxServersPageSearch,
  getPbxServersPageView,
  getPbxServersRefreshOnFocus,
  getPbxServersUserId
} from '../../model/selectors/pbxServersPageSelectors'
import { pbxServersPageActions } from '../../model/slices/pbxServersPageSlice'
import { usePbxServers } from '../../api/pbxServersApi'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'
import { ContentView } from '../../../Content'
import { ClientOptions } from '../../../User/model/types/user'

export function usePbxServersFilters () {
  const page = useSelector(getPbxServersPageNum)
  const limit = useSelector(getPbxServersPageLimit)
  const hasMore = useSelector(getPbxServersHasMore)
  const view = useSelector(getPbxServersPageView)
  const refetchOnFocus = useSelector(getPbxServersRefreshOnFocus)
  const search = useSelector(getPbxServersPageSearch)
  const clientId = useSelector(getPbxServersUserId)

  const userId = clientId || undefined

  const dispatch = useAppDispatch()
  const [newSearch, setNewSearch] = useState<string>('')

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch
  } = usePbxServers({
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
      dispatch(pbxServersPageActions.setHasMore(isHasMore))
      if (isHasMore) {
        dispatch(pbxServersPageActions.setPage(page + 1))
      }
    }
  }, [data, dispatch, hasMore, isFetching, isLoading, limit, page])

  const onChangeView = useCallback((view: ContentView) => {
    dispatch(pbxServersPageActions.setView(view))
  }, [dispatch])

  const onChangeUserId = useCallback((event: any, client: ClientOptions) => {
    // const newUserId = client ? client.id || userId || '' : ''
    dispatch(pbxServersPageActions.setUser(client))
    dispatch(pbxServersPageActions.setPage(1))
  }, [dispatch])

  const debouncedSearch = useDebounce((search: string) => { setNewSearch(search) }, 500)

  const onChangeSearch = useCallback((search: string) => {
    dispatch(pbxServersPageActions.setSearch(search))
    dispatch(pbxServersPageActions.setPage(1))
    debouncedSearch(search)
  }, [debouncedSearch, dispatch])

  const onChangePage = useCallback((page: number) => {
    dispatch(pbxServersPageActions.setPage(page))
  }, [dispatch])

  const onChangeHasMore = useCallback((hasMore: boolean) => {
    dispatch(pbxServersPageActions.setHasMore(hasMore))
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

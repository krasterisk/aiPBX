import { useSelector } from 'react-redux'
import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
  getAssistantsHasMore,
  getAssistantsPageLimit,
  getAssistantsPageNum,
  getAssistantsPageSearch,
  getAssistantsPageView,
  getAssistantsRefreshOnFocus,
  getAssistantsUserId
} from '../../model/selectors/assistantsPageSelectors'
import { assistantsPageActions } from '../../model/slices/assistantsPageSlice'
import { useAssistants } from '../../api/assistantsApi'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'
import { getUserAuthData } from '../../../User/model/selectors/getUserAuthData/getUserAuthData'
import { isUserAdmin } from '../../../User/model/selectors/roleSelector'
import { ContentView } from '../../../Content'
import { User } from '@/entities/User'

export function useAssistantFilters () {
  const page = useSelector(getAssistantsPageNum)
  const limit = useSelector(getAssistantsPageLimit)
  const hasMore = useSelector(getAssistantsHasMore)
  const view = useSelector(getAssistantsPageView)
  const refetchOnFocus = useSelector(getAssistantsRefreshOnFocus)
  const search = useSelector(getAssistantsPageSearch)
  const clientId = useSelector(getAssistantsUserId)
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
  } = useAssistants({
    page,
    limit,
    search: newSearch
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
      dispatch(assistantsPageActions.setHasMore(isHasMore))
      if (isHasMore) {
        dispatch(assistantsPageActions.setPage(page + 1))
      }
    }
  }, [data, dispatch, hasMore, isFetching, isLoading, limit, page])

  const onChangeView = useCallback((view: ContentView) => {
    dispatch(assistantsPageActions.setView(view))
  }, [dispatch])

  const onChangeUserId = useCallback((event: any, client: User) => {
    // const newUserId = client ? client.id || userId || '' : ''
    dispatch(assistantsPageActions.setUserId(client.id))
    dispatch(assistantsPageActions.setPage(1))
  }, [dispatch])

  const debouncedSearch = useDebounce((search: string) => { setNewSearch(search) }, 500)

  const onChangeSearch = useCallback((search: string) => {
    dispatch(assistantsPageActions.setSearch(search))
    dispatch(assistantsPageActions.setPage(1))
    debouncedSearch(search)
  }, [debouncedSearch, dispatch])

  const onChangePage = useCallback((page: number) => {
    dispatch(assistantsPageActions.setPage(page))
  }, [dispatch])

  const onChangeHasMore = useCallback((hasMore: boolean) => {
    dispatch(assistantsPageActions.setHasMore(hasMore))
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

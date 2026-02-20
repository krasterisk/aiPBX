import { useSelector } from 'react-redux'
import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
    getMcpServersHasMore,
    getMcpServersPageLimit,
    getMcpServersPageNum,
    getMcpServersPageSearch,
    getMcpServersPageView,
    getMcpServersRefreshOnFocus,
    getMcpServersUserId
} from '../../model/selectors/mcpServersPageSelectors'
import { mcpServersPageActions } from '../../model/slices/mcpServersPageSlice'
import { useMcpServers } from '../../api/mcpApi'
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce'

export function useMcpServersFilters () {
    const page = useSelector(getMcpServersPageNum)
    const limit = useSelector(getMcpServersPageLimit)
    const hasMore = useSelector(getMcpServersHasMore)
    const view = useSelector(getMcpServersPageView)
    const refetchOnFocus = useSelector(getMcpServersRefreshOnFocus)
    const search = useSelector(getMcpServersPageSearch)
    const clientId = useSelector(getMcpServersUserId)

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
    } = useMcpServers({
        page,
        limit,
        search: newSearch,
        userId
    }, {
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
            dispatch(mcpServersPageActions.setHasMore(isHasMore))
            if (isHasMore) {
                dispatch(mcpServersPageActions.setPage(page + 1))
            }
        }
    }, [data, dispatch, hasMore, isFetching, isLoading, limit, page])

    const onChangeUserId = useCallback((id: string) => {
        dispatch(mcpServersPageActions.setUser({ id, name: '' }))
        dispatch(mcpServersPageActions.setPage(1))
    }, [dispatch])

    const debouncedSearch = useDebounce((search: string) => { setNewSearch(search) }, 500)

    const onChangeSearch = useCallback((search: string) => {
        dispatch(mcpServersPageActions.setSearch(search))
        dispatch(mcpServersPageActions.setPage(1))
        debouncedSearch(search)
    }, [debouncedSearch, dispatch])

    const onChangePage = useCallback((page: number) => {
        dispatch(mcpServersPageActions.setPage(page))
    }, [dispatch])

    const onChangeHasMore = useCallback((hasMore: boolean) => {
        dispatch(mcpServersPageActions.setHasMore(hasMore))
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
        onChangeSearch,
        onChangeHasMore,
        onChangePage,
        onRefetch,
        onLoadNext,
        onChangeUserId
    }
}

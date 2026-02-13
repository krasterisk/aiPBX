import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { fetchNextPublishWidgetsPage } from '../service/fetchNextPublishWidgetsPage/fetchNextPublishWidgetsPage'
import { publishWidgetsPageActions } from '../slices/publishWidgetsPageSlice'
import {
    getPublishWidgetsPageHasMore,
    getPublishWidgetsPageIsLoading,
    getPublishWidgetsPageError,
    getPublishWidgetsPageSearch,
    getPublishWidgetsPageClientId
} from '../selectors/publishWidgetsPageSelectors'
import { useWidgetKeys } from '@/entities/WidgetKeys'
import { getUserAuthData, isUserAdmin } from '@/entities/User'

export const usePublishWidgetsFilters = () => {
    const dispatch = useAppDispatch()
    const isLoading = useSelector(getPublishWidgetsPageIsLoading)
    const error = useSelector(getPublishWidgetsPageError)
    const hasMore = useSelector(getPublishWidgetsPageHasMore)
    const search = useSelector(getPublishWidgetsPageSearch)
    const clientId = useSelector(getPublishWidgetsPageClientId)

    const userData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const { data: widgets = [], isLoading: isWidgetsLoading, error: widgetsError, isError, refetch } = useWidgetKeys()

    // Filter widgets based on user permissions
    let filteredWidgets = widgets

    if (!isAdmin) {
        filteredWidgets = widgets.filter(w => String(w.userId) === String(userData?.id))
    } else if (clientId) {
        filteredWidgets = widgets.filter(w => String(w.userId) === clientId)
    }

    // Filter by search
    const searchedWidgets = search
        ? filteredWidgets.filter(w =>
            w.name.toLowerCase().includes(search.toLowerCase()) ||
            w.assistant?.name?.toLowerCase().includes(search.toLowerCase())
        )
        : filteredWidgets

    const data = {
        count: searchedWidgets.length,
        rows: searchedWidgets
    }

    const onLoadNext = useCallback(() => {
        dispatch(fetchNextPublishWidgetsPage())
    }, [dispatch])

    const onRefetch = useCallback(() => {
        refetch()
    }, [refetch])

    const onSearchChange = useCallback((value: string) => {
        dispatch(publishWidgetsPageActions.setSearch(value))
    }, [dispatch])

    const onClientIdChange = useCallback((clientId: string) => {
        dispatch(publishWidgetsPageActions.setClientId(clientId))
    }, [dispatch])

    return {
        isLoading: isWidgetsLoading || isLoading,
        isError,
        error: widgetsError || error,
        data,
        hasMore,
        onLoadNext,
        onRefetch,
        search,
        onSearchChange,
        clientId,
        onClientIdChange
    }
}

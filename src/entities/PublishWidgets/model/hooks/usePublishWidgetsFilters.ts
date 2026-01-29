import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { fetchNextPublishWidgetsPage } from '../service/fetchNextPublishWidgetsPage/fetchNextPublishWidgetsPage'
import { publishWidgetsPageActions } from '../slices/publishWidgetsPageSlice'
import {
    getPublishWidgetsPageHasMore,
    getPublishWidgetsPageIsLoading,
    getPublishWidgetsPageError,
    getPublishWidgetsPageSearch
} from '../selectors/publishWidgetsPageSelectors'
import { useWidgetKeys } from '@/entities/WidgetKeys'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { useAssistantsAll } from '@/entities/Assistants'

export const usePublishWidgetsFilters = () => {
    const dispatch = useAppDispatch()
    const isLoading = useSelector(getPublishWidgetsPageIsLoading)
    const error = useSelector(getPublishWidgetsPageError)
    const hasMore = useSelector(getPublishWidgetsPageHasMore)
    const search = useSelector(getPublishWidgetsPageSearch)

    const userData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const { data: widgets = [], isLoading: isWidgetsLoading, error: widgetsError, isError, refetch } = useWidgetKeys()
    const { data: assistants = [] } = useAssistantsAll({})

    // Filter widgets based on user permissions
    const filteredWidgets = isAdmin
        ? widgets
        : widgets.filter(w => {
            const assistant = assistants.find(a => a.id === String(w.assistantId))
            return assistant?.userId === userData?.id
        })

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

    return {
        isLoading: isWidgetsLoading || isLoading,
        isError,
        error: widgetsError || error,
        data,
        hasMore,
        onLoadNext,
        onRefetch,
        search,
        onSearchChange
    }
}

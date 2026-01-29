import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { publishSipUrisPageActions } from '../slices/publishSipUrisPageSlice'
import { getPublishSipUrisPageSearch } from '../selectors/publishSipUrisPageSelectors'
import { useAssistantsAll } from '@/entities/Assistants'
import { getUserAuthData, isUserAdmin } from '@/entities/User'

export const usePublishSipUrisFilters = () => {
    const dispatch = useAppDispatch()
    const search = useSelector(getPublishSipUrisPageSearch)
    const userData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const { data: assistants = [], isLoading, isError, error, refetch } = useAssistantsAll({})

    const filteredAssistants = isAdmin
        ? assistants
        : assistants.filter(a => a.userId === userData?.id)

    // Filter by search
    const searchedAssistants = search
        ? filteredAssistants.filter(a =>
            a.name?.toLowerCase().includes(search.toLowerCase()) ||
            a.sipAccount?.sipUri?.toLowerCase().includes(search.toLowerCase())
        )
        : filteredAssistants

    const assistantsWithSip = searchedAssistants.filter(a => a.sipAccount)

    const onSearchChange = useCallback((value: string) => {
        dispatch(publishSipUrisPageActions.setSearch(value))
    }, [dispatch])

    return {
        isLoading,
        isError,
        error,
        data: assistantsWithSip,
        search,
        onSearchChange,
        onRefetch: refetch
    }
}

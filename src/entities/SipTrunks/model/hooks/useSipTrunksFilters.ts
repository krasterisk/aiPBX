import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { sipTrunksPageActions } from '../slices/sipTrunksPageSlice'
import { getSipTrunksPageSearch, getSipTrunksPageClientId } from '../selectors/sipTrunksPageSelectors'
import { useSipTrunks } from '../../api/sipTrunksApi'
import { getUserAuthData, isUserAdmin } from '@/entities/User'

export const useSipTrunksFilters = () => {
    const dispatch = useAppDispatch()
    const search = useSelector(getSipTrunksPageSearch)
    const clientId = useSelector(getSipTrunksPageClientId)
    const userData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const { data: trunks = [], isLoading, isError, error, refetch } = useSipTrunks()

    // Filter by user permissions and selected client
    let filteredTrunks = trunks
    if (!isAdmin) {
        filteredTrunks = trunks.filter(t => String(t.userId) === String(userData?.id))
    } else if (clientId) {
        filteredTrunks = trunks.filter(t => String(t.userId) === clientId)
    }

    // Filter by search
    const searchedTrunks = search
        ? filteredTrunks.filter(t =>
            t.name?.toLowerCase().includes(search.toLowerCase()) ||
            t.sipServerAddress?.toLowerCase().includes(search.toLowerCase())
        )
        : filteredTrunks

    const onSearchChange = useCallback((value: string) => {
        dispatch(sipTrunksPageActions.setSearch(value))
    }, [dispatch])

    const onClientIdChange = useCallback((value: string) => {
        dispatch(sipTrunksPageActions.setClientId(value))
    }, [dispatch])

    return {
        isLoading,
        isError,
        error,
        data: searchedTrunks,
        search,
        clientId,
        onSearchChange,
        onClientIdChange,
        onRefetch: refetch
    }
}

import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
    getAIAnalyticsAssistantId,
    getAIAnalyticsAssistants,
    getAIAnalyticsEndDate,
    getAIAnalyticsInited,
    getAIAnalyticsStartDate,
    getAIAnalyticsTab,
    getAIAnalyticsUserId
} from '../../model/selectors/aiAnalyticsPageSelectors'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'
import { aiAnalyticsPageActions } from '../../model/slices/aiAnalyticsPageSlice'
import { useGetAIAnalyticsDashboard } from '@/entities/Report'

export function useAIAnalyticsFilters() {
    const tab = useSelector(getAIAnalyticsTab)
    const clientId = useSelector(getAIAnalyticsUserId)
    const startDate = useSelector(getAIAnalyticsStartDate)
    const endDate = useSelector(getAIAnalyticsEndDate)
    const isInited = useSelector(getAIAnalyticsInited)
    const assistantId = useSelector(getAIAnalyticsAssistantId)
    const assistants = useSelector(getAIAnalyticsAssistants)
    const authData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const userId = !isAdmin ? authData?.vpbx_user_id || authData?.id : clientId

    const dispatch = useAppDispatch()

    const {
        data: aiAnalyticsData,
        isLoading: isAIAnalyticsLoading,
        isFetching: isAIAnalyticsFetching,
        isError: isAIAnalyticsError,
        error: aiAnalyticsError,
        refetch: refetchAIAnalytics
    } = useGetAIAnalyticsDashboard({
        startDate,
        endDate,
        userId,
        assistantId
    }, { skip: !startDate || !endDate })

    const onRefetch = useCallback(() => {
        refetchAIAnalytics()
    }, [refetchAIAnalytics])

    const onChangeUserId = useCallback((clientId: string) => {
        dispatch(aiAnalyticsPageActions.setUserId(clientId))
    }, [dispatch])

    const onChangeAssistant = useCallback((event: any, assistant: AssistantOptions[]) => {
        const newAssistantIds = assistant.map(item => item.id)
        dispatch(aiAnalyticsPageActions.setAssistantId(newAssistantIds))
        dispatch(aiAnalyticsPageActions.setAssistant(assistant))
    }, [dispatch])

    const onChangeTab = useCallback((value: string) => {
        dispatch(aiAnalyticsPageActions.setTab(value))
    }, [dispatch])

    const onChangeStartDate = useCallback((value: string) => {
        dispatch(aiAnalyticsPageActions.setStartDate(value))
    }, [dispatch])

    const onChangeEndDate = useCallback((value: string) => {
        dispatch(aiAnalyticsPageActions.setEndDate(value))
    }, [dispatch])

    return {
        tab,
        isAIAnalyticsError,
        isAIAnalyticsLoading,
        isAIAnalyticsFetching,
        aiAnalyticsError,
        aiAnalyticsData,
        isInited,
        userId,
        assistantId,
        assistants,
        startDate,
        endDate,
        onRefetch,
        onChangeUserId,
        onChangeAssistant,
        onChangeStartDate,
        onChangeEndDate,
        onChangeTab
    }
}

import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
    getAIAnalyticsAssistantId,
    getAIAnalyticsAssistants,
    getAIAnalyticsInited,
    getAIAnalyticsUserId,
    getAIAnalyticsSource
} from '../../model/selectors/aiAnalyticsPageSelectors'
import {
    getDashboardEndDate,
    getDashboardStartDate,
    getDashboardTab,
} from '@/features/Dashboard/model/selectors/dashboardPageSelectors'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'
import { aiAnalyticsPageActions } from '../../model/slices/aiAnalyticsPageSlice'
import { useGetAIAnalyticsDashboard, CdrSource } from '@/entities/Report'

export function useAIAnalyticsFilters() {
    // Период берём из общего dashboardPageSlice (синхронизировано с шапкой)
    const tab = useSelector(getDashboardTab)
    const startDate = useSelector(getDashboardStartDate)
    const endDate = useSelector(getDashboardEndDate)

    // Специфичные фильтры — из своего slice
    const clientId = useSelector(getAIAnalyticsUserId)
    const isInited = useSelector(getAIAnalyticsInited)
    const assistantId = useSelector(getAIAnalyticsAssistantId)
    const assistants = useSelector(getAIAnalyticsAssistants)
    const authData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)
    const source = useSelector(getAIAnalyticsSource)

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
        assistantId,
        source
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

    const onChangeSource = useCallback((source: CdrSource | undefined) => {
        dispatch(aiAnalyticsPageActions.setSource(source))
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
        source,
        onRefetch,
        onChangeUserId,
        onChangeAssistant,
        onChangeSource,
        onChangeTab
    }
}

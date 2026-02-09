import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
  getDashboardActiveTab,
  getDashboardAssistantId,
  getDashboardEndDate,
  getDashboardInited,
  getDashboardStartDate,
  getDashboardTab,
  getDashboardUserId,
  getDashboardAssistants
} from '../../model/selectors/dashboardPageSelectors'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'
import { dashboardPageActions } from '../../model/slices/dashboardPageSlice'
import { useDashboard, useGetAIAnalyticsDashboard } from '@/entities/Report'
import { DashboardTab } from '../../model/types/dashboardPageSchema'

export function useDashboardFilters() {
  const tab = useSelector(getDashboardTab)
  const activeTab = useSelector(getDashboardActiveTab)
  const clientId = useSelector(getDashboardUserId)
  const startDate = useSelector(getDashboardStartDate)
  const endDate = useSelector(getDashboardEndDate)
  const isInited = useSelector(getDashboardInited)
  const assistantId = useSelector(getDashboardAssistantId)
  const assistants = useSelector(getDashboardAssistants)
  const authData = useSelector(getUserAuthData)
  const isAdmin = useSelector(isUserAdmin)

  const userId = !isAdmin ? authData?.vpbx_user_id || authData?.id : clientId

  const dispatch = useAppDispatch()

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useDashboard({
    startDate,
    endDate,
    tab,
    userId,
    assistantId
  }, { skip: !startDate || !endDate || !tab })

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
  }, { skip: !startDate || !endDate || activeTab !== 'ai-analytics' })

  const onRefetch = useCallback(() => {
    refetch()
    if (activeTab === 'ai-analytics') {
      refetchAIAnalytics()
    }
  }, [refetch, refetchAIAnalytics, activeTab])

  const onChangeUserId = useCallback((clientId: string) => {
    dispatch(dashboardPageActions.setUserId(clientId))
  }, [dispatch])

  const onChangeAssistant = useCallback((event: any, assistant: AssistantOptions[]) => {
    const newAssistantIds = assistant.map(item => item.id)
    dispatch(dashboardPageActions.setAssistantId(newAssistantIds))
    dispatch(dashboardPageActions.setAssistant(assistant))
  }, [dispatch])

  const onChangeTab = useCallback((value: string) => {
    dispatch(dashboardPageActions.setTab(value))
  }, [dispatch])

  const onChangeActiveTab = useCallback((value: DashboardTab) => {
    dispatch(dashboardPageActions.setActiveTab(value))
  }, [dispatch])

  const onChangeStartDate = useCallback((value: string) => {
    dispatch(dashboardPageActions.setStartDate(value))
  }, [dispatch])

  const onChangeEndDate = useCallback((value: string) => {
    dispatch(dashboardPageActions.setEndDate(value))
  }, [dispatch])

  return {
    tab,
    activeTab,
    isError,
    isLoading,
    isFetching,
    error,
    data,
    isInited,
    userId,
    assistantId,
    assistants,
    startDate,
    endDate,
    aiAnalyticsData,
    isAIAnalyticsLoading,
    isAIAnalyticsFetching,
    isAIAnalyticsError,
    aiAnalyticsError,
    onChangeTab,
    onChangeActiveTab,
    onRefetch,
    onChangeUserId,
    onChangeAssistant,
    onChangeStartDate,
    onChangeEndDate
  }
}

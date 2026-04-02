import { memo, ReactNode, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { VStack } from '@/shared/ui/redesigned/Stack'
import {
    FiltersGroup,
    dashboardPageReducer,
    dashboardPageActions,
    initDashboardPage,
    getDashboardStartDate,
    getDashboardEndDate,
    getDashboardTab,
    getDashboardUserId,
    getDashboardInited,
    getDashboardAssistantId,
    getDashboardAssistants,
    getDashboardSource,
} from '@/features/Dashboard'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'
import { CdrSource } from '@/entities/Report'

const reducers: ReducersList = {
    dashboardPage: dashboardPageReducer
}

interface DashboardLayoutInnerProps {
    title: string
    children: ReactNode
}

const DashboardLayoutInner = memo(({ title, children }: DashboardLayoutInnerProps) => {
    const dispatch = useAppDispatch()

    const tab = useSelector(getDashboardTab)
    const isInited = useSelector(getDashboardInited)
    const clientId = useSelector(getDashboardUserId)
    const assistantId = useSelector(getDashboardAssistantId)
    const assistants = useSelector(getDashboardAssistants)
    const startDate = useSelector(getDashboardStartDate)
    const endDate = useSelector(getDashboardEndDate)
    const source = useSelector(getDashboardSource)
    const authData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)

    const userId = !isAdmin ? authData?.vpbx_user_id || authData?.id : clientId

    const onChangeTab = useCallback((value: string) => {
        dispatch(dashboardPageActions.setTab(value))
    }, [dispatch])

    const onChangeStartDate = useCallback((value: string) => {
        dispatch(dashboardPageActions.setStartDate(value))
    }, [dispatch])

    const onChangeEndDate = useCallback((value: string) => {
        dispatch(dashboardPageActions.setEndDate(value))
    }, [dispatch])

    const onChangeUserId = useCallback((clientId: string) => {
        dispatch(dashboardPageActions.setUserId(clientId))
    }, [dispatch])

    const onChangeAssistant = useCallback((event: any, assistant: AssistantOptions[]) => {
        const newAssistantIds = assistant.map(item => item.id)
        dispatch(dashboardPageActions.setAssistantId(newAssistantIds))
        dispatch(dashboardPageActions.setAssistant(assistant))
    }, [dispatch])

    const onChangeSource = useCallback((source: CdrSource | undefined) => {
        dispatch(dashboardPageActions.setSource(source))
    }, [dispatch])

    useInitialEffect(() => {
        dispatch(initDashboardPage())
    })

    return (
        <VStack gap={'16'} max>
            <FiltersGroup
                title={title}
                tab={tab}
                isInited={isInited}
                userId={userId}
                assistantId={assistantId}
                assistants={assistants}
                startDate={startDate}
                endDate={endDate}
                source={source}
                onChangeTab={onChangeTab}
                onChangeAssistant={onChangeAssistant}
                onChangeUserId={onChangeUserId}
                onChangeStartDate={onChangeStartDate}
                onChangeEndDate={onChangeEndDate}
                onChangeSource={onChangeSource}
            />
            {children}
        </VStack>
    )
})

interface DashboardLayoutProps {
    title: string
    children: ReactNode
}

export const DashboardLayout = memo(({ title, children }: DashboardLayoutProps) => (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
        <DashboardLayoutInner title={title}>{children}</DashboardLayoutInner>
    </DynamicModuleLoader>
))

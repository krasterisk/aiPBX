import { memo, ReactNode } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import {
    FiltersGroup,
    useDashboardFilters,
    dashboardPageReducer,
    initDashboardPage,
} from '@/features/Dashboard'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'

const reducers: ReducersList = {
    dashboardPage: dashboardPageReducer
}

interface DashboardLayoutInnerProps {
    title: string
    children: ReactNode
}

const DashboardLayoutInner = memo(({ title, children }: DashboardLayoutInnerProps) => {
    const dispatch = useAppDispatch()

    const {
        tab,
        isInited,
        userId,
        assistantId,
        assistants,
        startDate,
        endDate,
        source,
        onChangeTab,
        onChangeAssistant,
        onChangeUserId,
        onChangeStartDate,
        onChangeEndDate,
        onChangeSource,
    } = useDashboardFilters()

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

import { memo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { Loader } from '@/shared/ui/Loader'
import { FiltersGroup, AIMetricsOverview } from '@/features/Dashboard'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { useAIAnalyticsFilters } from '../../libs/hooks/useAIAnalyticsFilters'
import { aiAnalyticsPageReducer } from '../../model/slices/aiAnalyticsPageSlice'
import { initAIAnalyticsPage } from '../../model/services/initAIAnalyticsPage'
import cls from './AIAnalyticsPage.module.scss'

const reducers: ReducersList = {
    aiAnalyticsPage: aiAnalyticsPageReducer
}

const AIAnalyticsPageContent = memo(() => {
    const {
        isInited,
        tab,
        userId,
        assistantId,
        assistants,
        startDate,
        endDate,
        onChangeAssistant,
        onChangeUserId,
        onChangeTab,
        onChangeStartDate,
        onChangeEndDate,
        source,
        onChangeSource,
        aiAnalyticsData,
        isAIAnalyticsLoading,
        isAIAnalyticsFetching,
        isAIAnalyticsError,
        aiAnalyticsError,
        onRefetch
    } = useAIAnalyticsFilters()

    if (isAIAnalyticsError) {
        const errMsg = aiAnalyticsError && 'data' in aiAnalyticsError
            ? String((aiAnalyticsError.data as { message: string }).message)
            : ''

        return (
            <ErrorGetData
                text={errMsg}
                onRefetch={onRefetch}
            />
        )
    }

    if (isInited && isAIAnalyticsLoading && isAIAnalyticsFetching) {
        return (
            <HStack max justify={'center'} align={'center'}>
                <Loader />
            </HStack>
        )
    }

    return (
        <VStack max gap={'16'} className={cls.AIAnalyticsPage}>
            <FiltersGroup
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
                onChangeEndDate={onChangeEndDate}
                onChangeStartDate={onChangeStartDate}
                onChangeSource={onChangeSource}
            />

            <AIMetricsOverview
                data={aiAnalyticsData}
                isLoading={isAIAnalyticsLoading || isAIAnalyticsFetching}
            />
        </VStack>
    )
})

const AIAnalyticsPage = memo(() => {
    const dispatch = useAppDispatch()

    useInitialEffect(() => {
        dispatch(initAIAnalyticsPage())
    })

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={true}>
            <AIAnalyticsPageContent />
        </DynamicModuleLoader>
    )
})

export default AIAnalyticsPage

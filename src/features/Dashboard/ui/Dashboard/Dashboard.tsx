import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { useDashboardFilters } from '../../libs/hooks/useDashboardFilters'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { Loader } from '@/shared/ui/Loader'
import { FiltersGroup } from '../FiltersGroup/FiltersGroup'
import { DashboardStatistics } from '../DashboardStatistics/DashboardStatistics'
import { DashboardCharts } from '../DashboardCharts/DashboardCharts'

export const Dashboard = memo(() => {
    const { t } = useTranslation('reports')
    const {
        isError,
        isLoading,
        isFetching,
        isInited,
        error,
        data,
        onRefetch,
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
        onChangeSource
    } = useDashboardFilters()

    if (isError) {
        const errMsg = error && 'data' in error ? String((error.data as { message: string }).message) : ''

        return (
            <ErrorGetData
                text={errMsg}
                onRefetch={onRefetch}
            />
        )
    }

    if (isLoading && isFetching) {
        return (
            <HStack max justify={'center'} align={'center'}>
                <Loader />
            </HStack>
        )
    }

    return (
        <VStack max gap={'16'}>
            <FiltersGroup
                title={t('Обзор') ?? undefined}
                dashboardData={data}
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

            <DashboardStatistics
                data={data}
                isLoading={isLoading || isFetching}
            />

            <DashboardCharts
                data={data}
            />
        </VStack>
    )
})

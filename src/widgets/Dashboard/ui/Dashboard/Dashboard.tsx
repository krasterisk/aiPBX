import React, { memo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { useDashboardFilters } from '../../libs/hooks/useDashboardFilters'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { Loader } from '@/shared/ui/Loader'
import { FiltersGroup } from '@/features/Dashboard'

export const Dashboard = memo(() => {
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
    startDate,
    endDate,
    onChangeAssistant,
    onChangeUserId,
    onChangeTab,
    onChangeStartDate,
    onChangeEndDate
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
                dashboardData={data}
                tab={tab}
                isInited={isInited}
                userId={userId}
                assistantId={assistantId}
                startDate={startDate}
                endDate={endDate}
                onChangeTab={onChangeTab}
                onChangeAssistant={onChangeAssistant}
                onChangeUserId={onChangeUserId}
                onChangeEndDate={onChangeEndDate}
                onChangeStartDate={onChangeStartDate}
            />
        </VStack>
  )
})

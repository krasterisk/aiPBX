import { useTranslation } from 'react-i18next'
import React, { memo, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'

import { ReportFilters, CdrSource } from '@/entities/Report'
import { AssistantOptions } from '@/entities/Assistants'
import { PeriodPicker } from '@/entities/PeriodPicker'
// eslint-disable-next-line krasterisk-plugin/layer-imports
import { PeriodExtendedFilters } from '@/features/PeriodExtendedFilter'
import { useSelector } from 'react-redux'
import { getUserAuthData, UserCurrencyValues, currencySymbols } from '@/entities/User'

interface FiltersGroupProps {
  className?: string
  title?: string
  tab?: string
  userId?: string
  assistantId?: string[]
  assistants?: AssistantOptions[]
  startDate?: string
  endDate?: string
  isInited?: boolean
  dashboardData?: ReportFilters
  onChangeAssistant: (event: any, assistant: AssistantOptions[]) => void
  onChangeUserId: (clientId: string) => void
  onChangeTab: (value: string) => void
  onChangeStartDate: (value: string) => void
  onChangeEndDate: (value: string) => void
  source?: CdrSource
  onChangeSource?: (value: CdrSource | undefined) => void
}

export const FiltersGroup = memo((props: FiltersGroupProps) => {
  const {
    className,
    title,
    tab,
    userId,
    assistantId,
    assistants,
    startDate,
    endDate,
    isInited,
    dashboardData,
    onChangeTab,
    onChangeAssistant,
    onChangeUserId,
    onChangeStartDate,
    onChangeEndDate,
    source,
    onChangeSource
  } = props

  const { t } = useTranslation('reports')
  const authData = useSelector(getUserAuthData)
  const userCurrency = authData?.currency || UserCurrencyValues.USD
  const currencySymbol = currencySymbols[userCurrency] || '$'

  const [filterShow, setFilterShow] = useState<boolean>(false)

  return (
    <Card variant={'clear'} padding={'16'} max className={className}>
      <VStack gap={'16'} max>
        <HStack max justify="between" align="center" gap="16">
          {title && (
            <Text title={title} size="l" bold />
          )}
          <PeriodPicker
            userId={userId}
            tab={tab}
            startDate={startDate}
            endDate={endDate}
            isInited={isInited}
            onChangeTab={onChangeTab}
            onChangeEndDate={onChangeEndDate}
            onChangeStartDate={onChangeStartDate}
            onOpenFilters={() => { setFilterShow(true) }}
          />
        </HStack>
        <PeriodExtendedFilters
          assistantId={assistantId}
          assistants={assistants}
          userId={userId}
          startDate={startDate}
          endDate={endDate}
          source={source}
          onChangeUserId={onChangeUserId}
          onChangeAssistant={onChangeAssistant}
          onChangeStartDate={onChangeStartDate}
          onChangeEndDate={onChangeEndDate}
          onChangeSource={onChangeSource}
          show={filterShow}
          onClose={() => { setFilterShow(false) }}
        />
      </VStack>
    </Card>
  )
})

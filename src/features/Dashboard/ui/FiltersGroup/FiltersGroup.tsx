import { useTranslation } from 'react-i18next'
import React, { memo, useState } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { ClientOptions } from '@/entities/User'
import { ReportFilters } from '@/entities/Report'
import { AssistantOptions } from '@/entities/Assistants'
import { PeriodPicker } from '@/entities/PeriodPicker'
import { PeriodExtendedFilters } from '@/features/PeriodExtendedFilter'
import { useSelector } from 'react-redux'
import { getUserAuthData, UserCurrencyValues } from '@/entities/User'
import { currencySymbols } from "@/entities/User/model/consts/consts"

interface FiltersGroupProps {
  className?: string
  tab?: string
  userId?: string
  assistantId?: string[]
  startDate?: string
  endDate?: string
  isInited?: boolean
  dashboardData?: ReportFilters
  onChangeAssistant: (event: any, assistant: AssistantOptions[]) => void
  onChangeUserId: (event: any, user: ClientOptions) => void
  onChangeTab: (value: string) => void
  onChangeStartDate: (value: string) => void
  onChangeEndDate: (value: string) => void
}

export const FiltersGroup = memo((props: FiltersGroupProps) => {
  const {
    className,
    tab,
    userId,
    assistantId,
    startDate,
    endDate,
    isInited,
    dashboardData,
    onChangeTab,
    onChangeAssistant,
    onChangeUserId,
    onChangeStartDate,
    onChangeEndDate
  } = props

  const { t } = useTranslation('reports')
  const authData = useSelector(getUserAuthData)
  const userCurrency = authData?.currency || UserCurrencyValues.USD
  const currencySymbol = currencySymbols[userCurrency] || '$'

  const [filterShow, setFilterShow] = useState<boolean>(false)

  return (
    <VStack gap={'32'} max>
      <Card
        variant={'normal'}
        padding={'16'}
        border={'partial'}
        max
      >
        <VStack gap={'16'} justify={'center'} align={'center'}>
          <PeriodExtendedFilters
            assistantId={assistantId}
            userId={userId}
            startDate={startDate}
            endDate={endDate}
            onChangeUserId={onChangeUserId}
            onChangeAssistant={onChangeAssistant}
            onChangeStartDate={onChangeStartDate}
            onChangeEndDate={onChangeEndDate}
            show={filterShow}
            onClose={() => setFilterShow(false)}
          />
          <PeriodPicker
            userId={userId}
            tab={tab}
            startDate={startDate}
            endDate={endDate}
            isInited={isInited}
            onChangeTab={onChangeTab}
            onChangeUserId={onChangeUserId}
            onChangeEndDate={onChangeEndDate}
            onChangeStartDate={onChangeStartDate}
            onOpenFilters={() => setFilterShow(true)}
          />
        </VStack>
      </Card>
    </VStack>
  )
})

import { useTranslation } from 'react-i18next'
import React, { memo, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { LinesChart } from '@/shared/ui/mui/LinesChart'
import { ClientOptions } from '@/entities/User'
import { ReportFilters } from '@/entities/Report'
import { AssistantOptions } from '@/entities/Assistants'
import { BarsChart } from '@/shared/ui/mui/BarsChart'
import { PeriodPicker } from '@/entities/PeriodPicker'
import { SummaryCard } from '../SummaryCard/SummaryCard'
import { PeriodExtendedFilters } from '../PeriodExtendedFilter/PeriodExtendedFilter'
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

  const ringsCount = dashboardData?.chartData?.map(item => Number(item.allCount)) || []
  const tokensCount = dashboardData?.chartData?.map(item => Number(item.tokensCount)) || []
  const durationCount = dashboardData?.chartData?.map(item => Number(item.durationCount) / 60) || []
  const amount = dashboardData?.chartData?.map(item => Number(item.amount)) || []
  const label = dashboardData?.chartData?.map(item => String(item.label)) || []

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
      <SummaryCard graphData={dashboardData} />
      <Card max border={'partial'} padding={'16'}>
        <BarsChart
          xAxis={[{ scaleType: 'band', data: label }]}
          series={[
            { data: ringsCount, label: String(t('Звонки')) },
            { data: durationCount, label: String(t('Длительность')) },
            { data: amount, label: String(t('Стоимость')) + `, ${currencySymbol}` }
          ]}
          height={300}
        />
      </Card>
      <Card max border={'partial'} padding={'16'}>
        <LinesChart
          height={300}
          series={[
            { data: tokensCount, label: String(t('Токены')) },
          ]}
          xAxis={[{ scaleType: 'point', data: label }]}
        />
      </Card>
      <Card max border={'partial'} padding={'16'}>
        <LinesChart
          height={300}
          series={[
            { data: ringsCount, label: String(t('Звонки')) },
          ]}
          xAxis={[{ scaleType: 'point', data: label }]}
        />
      </Card>
      <Card max border={'partial'} padding={'16'}>
        <LinesChart
          height={300}
          series={[
            { data: amount, label: String(t('Стоимость')) + `, ${currencySymbol}` },
          ]}
          xAxis={[{ scaleType: 'point', data: label }]}
        />
      </Card>
    </VStack>
  )
})

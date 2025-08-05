import { useTranslation } from 'react-i18next'
import React, { memo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { LinesChart } from '@/shared/ui/mui/LinesChart'
import { ClientOptions } from '@/entities/User'
import { PeriodPicker } from '../PeriodPicker/PeriodPicker'
import { SummaryCard } from '../SummaryCard/SummaryCard'
import { ReportFilters } from '@/entities/Report'
import { AssistantOptions } from '@/entities/Assistants'
import { BarsChart } from '@/shared/ui/mui/BarsChart'

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

  const { t } = useTranslation('endpoints')

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
                <VStack gap={'16'} justify={'start'}>
                    <HStack max justify={'center'} gap={'8'}>
                        <PeriodPicker
                            userId={userId}
                            assistantId={assistantId}
                            tab={tab}
                            startDate={startDate}
                            endDate={endDate}
                            isInited={isInited}
                            onChangeTab={onChangeTab}
                            onChangeUserId={onChangeUserId}
                            onChangeAssistant={onChangeAssistant}
                            onChangeEndDate={onChangeEndDate}
                            onChangeStartDate={onChangeStartDate}
                        />
                    </HStack>
                </VStack>
            </Card>
             <SummaryCard graphData={dashboardData} />
            <Card max border={'partial'} padding={'16'}>
                <BarsChart
                    xAxis={[{ scaleType: 'band', data: label }]}
                    series={[
                      { data: ringsCount, label: String(t('Звонки')) },
                      { data: durationCount, label: String(t('Длительность')) },
                      { data: amount, label: String(t('Стоимость')) }
                    ]}
                    height={300}
                />
            </Card>
            <Card max border={'partial'} padding={'16'}>
                <LinesChart
                    height={300}
                    series={[
                      { data: tokensCount, label: String(t('Токены')) }
                    ]}
                    xAxis={[{ scaleType: 'point', data: label }]}
                />
            </Card>
        </VStack>
  )
})

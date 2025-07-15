import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { ReportFilters } from '@/entities/Report'

interface SummaryCardProps {
  className?: string
  graphData?: ReportFilters
}

export const SummaryCard = memo((props: SummaryCardProps) => {
  const {
    className,
    graphData
  } = props

  const { t } = useTranslation('assistants')

  return (
        <VStack gap={'4'}>
            <Text text={t('Всего звонков за период') + ': ' + String(graphData?.allCount)}/>
            <Text text={t('Всего токенов') + ': ' + String(graphData?.allTokensCount)}/>
            <Text text={t('Всего длительность') + ': ' + String(graphData?.allDurationCount)}/>
        </VStack>
  )
})

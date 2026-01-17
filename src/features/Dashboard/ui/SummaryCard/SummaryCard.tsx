import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { ReportFilters } from '@/entities/Report'
import { formatTime } from '@/shared/lib/functions/formatTime'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'
import { useSelector } from 'react-redux'
import { getUserAuthData, UserCurrencyValues } from '@/entities/User'

interface SummaryCardProps {
  className?: string
  graphData?: ReportFilters
}

export const SummaryCard = memo((props: SummaryCardProps) => {
  const {
    className,
    graphData
  } = props

  const { t } = useTranslation('reports')
  const authData = useSelector(getUserAuthData)
  const userCurrency = authData?.currency || UserCurrencyValues.USD

  const formattedRings = graphData?.allCount ? graphData.allCount : 0
  const formattedDuration = graphData?.allDurationCount ? formatTime(graphData.allDurationCount, t) : ''
  const formattedTokens = graphData?.allTokensCount ? graphData.allTokensCount : 0

  return (
    <VStack gap={'4'}>
      <Text text={t('Всего за период') + ': '} bold />
      <Text text={t('Звонков') + ': ' + String(formattedRings)} />
      <Text text={t('Длительность') + ': ' + String(formattedDuration)} />
      <Text text={t('Токенов') + ': ' + String(formattedTokens)} />
      <Text text={t('Стоимость') + ': ' + formatCurrency(graphData?.allCost, userCurrency)} />
    </VStack>
  )
})

import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { ManualList } from '@/entities/Manual'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { useManualRecommendationsList } from '../../api/manualRecommendationsApi'

interface ManualRecommendationsListProps {
  className?: string
}

export const ManualRecommendationsList = memo((props: ManualRecommendationsListProps) => {
  const { className } = props
  const { t } = useTranslation('manuals')
  const { data: manuals, isLoading, error } = useManualRecommendationsList('')

  if (isLoading || error || !manuals) {
    return null
  }

  return (
        <VStack
            data-testid={'ManualRecommendationsList'}
            gap="8"
            className={classNames('', {}, [className])}
        >
            <Text
                                  size={'l'}
                                  title={t('Рекомендуем')}
                              />
            <ManualList
                manuals={manuals}
                target={'_blank'}
            />

        </VStack>
  )
})

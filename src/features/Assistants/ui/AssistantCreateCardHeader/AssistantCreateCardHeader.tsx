import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantCreateCardHeader.module.scss'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteAssistants } from '@/shared/const/router'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack } from '@/shared/ui/redesigned/Stack'

interface AssistantCreateCardHeaderProps {
  className?: string
  onCreate?: () => void
}

export const AssistantCreateCardHeader = memo((props: AssistantCreateCardHeaderProps) => {
  const {
    className,
    onCreate
  } = props
  const { t } = useTranslation('assistants')

  const headerButtons = (
        <HStack gap="8" align={'end'}>
            <AppLink to={getRouteAssistants()}>
                <Button
                    title={t('Закрыть') ?? ''}
                    variant={'outline'}
                    color={'error'}
                >
                    {t('Закрыть')}
                </Button>
            </AppLink>
            <Button
                title={t('Создать') ?? ''}
                variant={'outline'}
                color={'success'}
                onClick={onCreate}
            >
                {t('Создать')}
            </Button>
        </HStack>
  )

  return (
        <Card
            className={classNames(cls.AssistantCreateCardHeader, {}, [className])}
            padding={'8'}
            border={'partial'}
            max
        >
            <HStack max justify={'between'} wrap={'wrap'}>
                <Text title={t('Новый голосовой ассистент')}/>
                {headerButtons}
            </HStack>

        </Card>
  )
})

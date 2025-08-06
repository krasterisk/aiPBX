import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantEditCardHeader.module.scss'
import { memo, useCallback } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteAssistants } from '@/shared/const/router'

interface AssistantEditCardHeaderProps {
  className?: string
  onEdit?: () => void
  assistantId?: string
  assistantName?: string
  error?: FetchBaseQueryError | SerializedError | undefined
  onDelete?: (id: string) => void
}

export const AssistantEditCardHeader = memo((props: AssistantEditCardHeaderProps) => {
  const {
    className,
    assistantId,
    assistantName,
    onEdit,
    onDelete
  } = props
  const { t } = useTranslation('assistants')

  const deleteHandler = useCallback(() => {
    if (assistantId) {
      onDelete?.(assistantId)
    }
  }, [assistantId, onDelete])

  const headerButtons = (
      <HStack gap="8">
        <Button
            title={t('Удалить') ?? ''}
            variant={'outline'}
            color={'error'}
            onClick={deleteHandler}
        >
          {t('Удалить')}
        </Button>
        <AppLink
            to={getRouteAssistants()}
        >
          <Button
              title={t('Закрыть') ?? ''}
              variant={'outline'}
              color={'normal'}
          >
            {t('Закрыть')}
          </Button>
        </AppLink>
        <Button
            title={t('Сохранить') ?? ''}
            variant={'outline'}
            color={'success'}
            onClick={onEdit}
        >
          {t('Сохранить')}
        </Button>
      </HStack>

  )

  return (
      <Card
          className={classNames(cls.AssistantEditCardHeader, {}, [className])}
          padding={'8'}
          border={'partial'}
          max
      >
        <HStack max justify={'between'} wrap={'wrap'}>
          <Text title={assistantName || t('Редактировать')}/>
          {headerButtons}
        </HStack>
      </Card>
  )
})

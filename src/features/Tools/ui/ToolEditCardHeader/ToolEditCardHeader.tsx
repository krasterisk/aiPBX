import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolEditCardHeader.module.scss'
import { memo, useCallback } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { Card, CardVariant } from '@/shared/ui/redesigned/Card'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteTools } from '@/shared/const/router'

interface ToolEditCardHeaderProps {
  className?: string
  onEdit?: () => void
  toolId?: string
  error?: FetchBaseQueryError | SerializedError | undefined
  onDelete?: (id: string) => void
  variant?: CardVariant
}

export const ToolEditCardHeader = memo((props: ToolEditCardHeaderProps) => {
  const {
    className,
    toolId,
    onEdit,
    onDelete,
    variant
  } = props
  const { t } = useTranslation('tools')

  const deleteHandler = useCallback(() => {
    if (toolId) {
      onDelete?.(toolId)
    }
  }, [toolId, onDelete])

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
            to={getRouteTools()}
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
          className={classNames(cls.ToolEditCardHeader, {}, [className])}
          padding={'8'}
          border={'partial'}
          max
          variant={variant}
      >
          {variant !== 'diviner-bottom'
            ? <HStack max justify={'between'} wrap={'wrap'}>
                  <Text title={t('Редактировать')}/>
                  {headerButtons}
              </HStack>
            : <HStack max justify={'end'} wrap={'wrap'}>
                  {headerButtons}
              </HStack>
          }
      </Card>
  )
})

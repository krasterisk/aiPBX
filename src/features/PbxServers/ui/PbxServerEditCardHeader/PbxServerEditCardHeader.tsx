import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServerEditCardHeader.module.scss'
import { memo, useCallback } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { Card, CardVariant } from '@/shared/ui/redesigned/Card'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePbxServers } from '@/shared/const/router'

interface PbxServerEditCardHeaderProps {
  className?: string
  onEdit?: () => void
  pbxServerId?: string
  error?: FetchBaseQueryError | SerializedError | undefined
  onDelete?: (id: string) => void
  variant?: CardVariant
}

export const PbxServerEditCardHeader = memo((props: PbxServerEditCardHeaderProps) => {
  const {
    className,
    pbxServerId,
    onEdit,
    onDelete,
    variant
  } = props
  const { t } = useTranslation('pbx')

  const deleteHandler = useCallback(() => {
    if (pbxServerId) {
      onDelete?.(pbxServerId)
    }
  }, [pbxServerId, onDelete])

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
            to={getRoutePbxServers()}
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
          className={classNames(cls.PbxServerEditCardHeader, {}, [className])}
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

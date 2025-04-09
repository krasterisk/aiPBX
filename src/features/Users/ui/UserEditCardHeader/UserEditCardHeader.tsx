import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserEditCardHeader.module.scss'
import { useTranslation } from 'react-i18next'
import { memo, useCallback } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteUsers } from '@/shared/const/router'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

interface UserEditCardHeaderProps {
  className?: string
  onEdit?: () => void
  userId?: string
  error?: FetchBaseQueryError | SerializedError | undefined
  onDelete?: (id: string) => void
}

export const UserEditCardHeader = memo((props: UserEditCardHeaderProps) => {
  const {
    className,
    userId,
    onEdit,
    onDelete
  } = props
  const { t } = useTranslation('profile')

  const deleteHandler = useCallback(() => {
    if (userId) {
      onDelete?.(userId)
    }
  }, [userId, onDelete])

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
            to={getRouteUsers()}
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
          className={classNames(cls.UserEditCardHeader, {}, [className])}
          padding={'8'}
          border={'partial'}
          max
      >
        <HStack max justify={'between'} wrap={'wrap'}>
          <Text title={t('Редактировать')}/>
          {headerButtons}
        </HStack>
      </Card>
  )
})

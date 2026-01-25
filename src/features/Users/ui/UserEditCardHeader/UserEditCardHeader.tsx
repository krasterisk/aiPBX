import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserEditCardHeader.module.scss'
import { useTranslation } from 'react-i18next'
import { memo, useCallback } from 'react'

import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteUsers } from '@/shared/const/router'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import { useSelector } from 'react-redux'
import { isUserAdmin } from '@/entities/User'
import { getRouteMain } from '@/shared/const/router'

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
  const isAdmin = useSelector(isUserAdmin)

  const deleteHandler = useCallback(() => {
    if (userId) {
      onDelete?.(userId)
    }
  }, [userId, onDelete])

  const actions = (
    <HStack gap="8" justify="end" wrap="wrap">
      {onDelete && (
        <Button
          variant={'outline'}
          color={'error'}
          onClick={deleteHandler}
          addonLeft={<DeleteIcon />}
        >
          {t('Удалить')}
        </Button>
      )}
      <Button
        variant={'outline'}
        color={'success'}
        onClick={onEdit}
        addonLeft={<SaveIcon />}
      >
        {t('Сохранить')}
      </Button>
      <AppLink
        to={isAdmin ? getRouteUsers() : getRouteMain()}
      >
        <Button
          variant={'outline'}
          addonLeft={<CloseIcon />}
        >
          {t('Закрыть')}
        </Button>
      </AppLink>
    </HStack>
  )

  return (
    <HStack max justify={'between'} wrap={'wrap'} gap={'8'} className={classNames(cls.UserEditCardHeader, {}, [className])}>
      <Text title={t('Редактировать')} />
      {actions}
    </HStack>
  )
})

import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserCreateCardHeader.module.scss'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'

import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteMain, getRouteUsers } from '@/shared/const/router'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack } from '@/shared/ui/redesigned/Stack'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'

interface UserCreateCardHeaderProps {
  className?: string
  onCreate?: () => void
  isAdmin?: boolean
}

export const UserCreateCardHeader = memo((props: UserCreateCardHeaderProps) => {
  const {
    className,
    onCreate,
    isAdmin
  } = props
  const { t } = useTranslation('profile')

  const actions = (
    <HStack gap="8" justify="end" wrap="wrap">
      <Button
        variant={'outline'}
        color={'success'}
        onClick={onCreate}
        addonLeft={<SaveIcon />}
      >
        {t('Создать')}
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
    <HStack max justify={'between'} wrap={'wrap'} gap={'8'} className={classNames(cls.UserCreateCardHeader, {}, [className])}>
      <Text title={isAdmin ? t('Новый клиент') : t('Новый пользователь')} />
      {actions}
    </HStack>
  )
})

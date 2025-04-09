import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserCreateCardHeader.module.scss'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteUsers } from '@/shared/const/router'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack } from '@/shared/ui/redesigned/Stack'

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

  const headerButtons = (
      <HStack gap="24">
        <AppLink
            to={getRouteUsers()}
        >
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
          className={classNames(cls.UserCreateCardHeader, {}, [className])}
          padding={'8'}
          border={'partial'}
          max
      >
        <HStack max justify={'between'} wrap={'wrap'}>
          <Text title={isAdmin ? t('Новый клиент') : t('Новый пользователь')}/>
          {headerButtons}
        </HStack>
      </Card>
  )
})

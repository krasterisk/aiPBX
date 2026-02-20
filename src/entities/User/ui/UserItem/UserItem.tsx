import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserItem.module.scss'
import React, { memo, useCallback } from 'react'
import { User } from '../../model/types/user'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Avatar } from '@/shared/ui/redesigned/Avatar'
import { ShieldCheck, Mail, Wallet, KeyRound } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { isUserAdmin } from '../../model/selectors/roleSelector'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'
import { UserCurrencyValues } from '../../model/consts/consts'
import { Divider } from '@/shared/ui/Divider'

interface UserItemProps {
  className?: string
  user: User
  onEdit?: (id: string) => void
  onTopUp?: (user: User) => void
}

export const UserItem = memo((props: UserItemProps) => {
  const {
    className,
    user,
    onEdit,
    onTopUp
  } = props

  const { t } = useTranslation('users')
  const isCurrentUserAdmin = useSelector(isUserAdmin)
  const isAdmin = user?.roles?.some(role => role.value === 'ADMIN')

  const checkedSrc = user.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `${__STATIC__}/${user.avatar}`)
    : ''

  const handleEdit = useCallback(() => {
    onEdit?.(user.id)
  }, [onEdit, user.id])

  const handleTopUp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onTopUp?.(user)
  }, [onTopUp, user])

  const formattedBalance = user.balance !== undefined
    ? formatCurrency(user.balance, user.currency as UserCurrencyValues || UserCurrencyValues.USD, 2)
    : null

  return (
    <Card
      padding={'0'}
      max
      border={'partial'}
      variant={'outlined'}
      className={classNames(cls.UserItem, { [cls.isAdminCard]: isAdmin }, [className])}
      onClick={handleEdit}
    >
      <VStack className={cls.content} max gap="16">
        <HStack gap={'16'} justify={'between'} max align="start">
          <HStack gap={'16'} max>
            <Avatar
              size={36}
              src={checkedSrc}
              alt={user.name}
              className={cls.avatar}
            />
            <VStack max gap="4">
              <Text title={user.name || user.username || user.email || ''} bold className={cls.title} />
              {isAdmin && (
                <HStack className={cls.adminBadge} gap="4" align="center">
                  <ShieldCheck size={8} />
                  <Text text={t('Администратор')} size="xs" />
                </HStack>
              )}
            </VStack>
          </HStack>
        </HStack>

        <Divider />

        {user.email && (
          <HStack gap="16" align="center">
            <HStack className={cls.detailIcon}>
              <Mail size={14} />
            </HStack>
            <VStack>
              <Text text={t('Email')} variant="accent" size="xs" />
              <Text text={user.email} className={cls.wrappedText} />
            </VStack>
          </HStack>
        )}

        {formattedBalance !== null && (
          <HStack gap="16" align="center">
            <HStack className={cls.detailIcon}>
              <Wallet size={14} />
            </HStack>
            <VStack>
              <Text text={t('Баланс')} variant="accent" size="xs" />
              <Text text={formattedBalance} className={cls.truncatedText} bold />
            </VStack>
          </HStack>
        )}

        {user.authType && (
          <HStack gap="16" align="center">
            <HStack className={cls.detailIcon}>
              <KeyRound size={14} />
            </HStack>
            <VStack>
              <Text text={t('Тип авторизации')} variant="accent" size="xs" />
              <Text text={user.authType} className={cls.truncatedText} />
            </VStack>
          </HStack>
        )}

        {isCurrentUserAdmin && onTopUp && (

          <HStack className={cls.footer} justify={'end'} max align="center">
            <Button
              variant={'clear'}
              onClick={handleTopUp}
              addonLeft={<Wallet size={16} />}
              className={cls.topUpBtn}
              size={'s'}
            >
              {t('Пополнить баланс')}
            </Button>
          </HStack>
        )}
      </VStack>
    </Card>
  )
})

import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserBalance.module.scss'
import { useTranslation } from 'react-i18next'
import React, { memo } from 'react'
import { useGetUserBalance } from '../../api/usersApi'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Loader } from '@/shared/ui/Loader'
import { Text } from '@/shared/ui/redesigned/Text'
import { balanceWarnings, UserCurrencyValues } from '../../model/consts/consts'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'

interface UserBalanceProps {
  className?: string

}

export const UserBalance = memo((props: UserBalanceProps) => {
  const {
    className
  } = props

  const { t } = useTranslation('profile')

  const {
    data: balance,
    isLoading
  } = useGetUserBalance(null,
    {
      refetchOnFocus: false,
      refetchOnReconnect: false
    })

  const userCurrency = (balance?.currency as UserCurrencyValues) || UserCurrencyValues.USD
  const balanceWarningCount = balanceWarnings[userCurrency] || 0

  const formattedBalance = balance
    ? formatCurrency(balance.balance, userCurrency, 2)
    : ''

  const balanceWarning = balance && balance?.balance > balanceWarningCount
    ? 'primary'
    : 'error'

  return (
    <HStack max justify={'center'} className={classNames(cls.UserBalance, {}, [className])}>
      {isLoading && <Loader />}
      <Text text={t('Баланс') + ': '} />
      <Text text={formattedBalance} bold variant={balanceWarning} />
    </HStack>
  )
})

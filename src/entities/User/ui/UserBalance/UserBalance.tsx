import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserBalance.module.scss'
import { useTranslation } from 'react-i18next'
import React, { memo } from 'react'
import { useGetUserBalance } from '../../api/usersApi'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Loader } from '@/shared/ui/Loader'
import { Text } from '@/shared/ui/redesigned/Text'
import { balanceWarnings, currencySymbols, UserCurrencyValues } from '../../model/consts/consts'

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
  const currency = currencySymbols[balance?.currency as UserCurrencyValues] || ''

  const balanceWarningCount = balanceWarnings[balance?.currency as UserCurrencyValues] || ''

  const formattedBalance = balance
    ? `${currency}${balance.balance} `
    : ''

  const balanceWarning = balance && balance?.balance > balanceWarningCount
    ? 'primary'
    : 'error'

  return (
        <HStack max justify={'center'} className={classNames(cls.UserBalance, {}, [className])}>
            {isLoading && <Loader/>}
            <Text text={t('Баланс') + ': '} />
            <Text text={formattedBalance} bold variant={balanceWarning}/>
        </HStack>
  )
})

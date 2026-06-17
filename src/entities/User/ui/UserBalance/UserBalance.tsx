import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserBalance.module.scss'
import { useTranslation } from 'react-i18next'
import React, { memo, useMemo } from 'react'
import { useGetUserBalance } from '../../api/usersApi'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Loader } from '@/shared/ui/Loader'
import { Text } from '@/shared/ui/redesigned/Text'
import { balanceWarnings, UserCurrencyValues } from '../../model/consts/consts'
import { formatBalanceAmount } from '../../lib/formatBalanceAmount'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'
import { getTenantCurrencyCode } from '@/shared/lib/domain'
import { Tooltip } from '@/shared/ui/redesign-v3/Tooltip'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePayment } from '@/shared/const/router'

interface UserBalanceProps {
  className?: string
}

export const UserBalance = memo((props: UserBalanceProps) => {
  const { className } = props

  const { t } = useTranslation('profile')

  const {
    data: balance,
    isLoading,
  } = useGetUserBalance(null, {
    refetchOnFocus: true,
    refetchOnReconnect: false,
  })

  const userCurrency = (balance?.currency as UserCurrencyValues) || UserCurrencyValues.USD
  const balanceWarningCount = balanceWarnings[userCurrency] || 0
  const isRubTenant = getTenantCurrencyCode() === 'RUB'

  const formattedBalance = balance
    ? formatBalanceAmount(balance.balance, userCurrency)
    : ''

  const balanceWarning = balance && balance?.balance > balanceWarningCount
    ? 'primary'
    : 'error'

  const usdBalanceTooltip = useMemo(() => {
    if (!balance || !isRubTenant || balance.balanceUsd == null) {
      return null
    }
    const amount = formatCurrency(balance.balanceUsd, UserCurrencyValues.USD, 2)
    return t('balanceUsdTooltip', { amount })
  }, [balance, isRubTenant, t])

  const balanceText = (
    <Text
      text={formattedBalance}
      bold
      variant={balanceWarning}
      className={usdBalanceTooltip ? cls.balanceWithTooltip : undefined}
    />
  )

  return (
    <AppLink to={getRoutePayment()} className={classNames(cls.UserBalance, {}, [className])}>
      <HStack max justify={'center'}>
        {isLoading && <Loader />}
        <Text text={t('Баланс') + ': '} />
        {usdBalanceTooltip ? (
          <Tooltip title={usdBalanceTooltip} placement="bottom">
            {balanceText}
          </Tooltip>
        ) : (
          balanceText
        )}
      </HStack>
    </AppLink>
  )
})

import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserBalance.module.scss'
import { useTranslation } from 'react-i18next'
import React, { memo } from 'react'
import { useGetUserBalance } from '../../api/usersApi'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Loader } from '@/shared/ui/Loader'
import { Text } from '@/shared/ui/redesigned/Text'

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
      refetchOnFocus: true,
      refetchOnReconnect: true
    })

  return (
        <HStack max justify={'center'} className={classNames(cls.UserBalance, {}, [className])}>
            {isLoading && <Loader/>}
            <Text title={t('Баланс')} text={String(balance)}/>
        </HStack>
  )
})

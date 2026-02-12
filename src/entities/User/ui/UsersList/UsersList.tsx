import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UsersList.module.scss'
import React, { useCallback, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '../../../ErrorGetData'
import { ContentListItemSkeleton } from '../../../Content'
import { User, UsersListProps } from '../../model/types/user'
import { Text } from '@/shared/ui/redesigned/Text'
import { UserItem } from '../UserItem/UserItem'
import { useTranslation } from 'react-i18next'
import { UsersListHeader } from '../UsersListHeader/UsersListHeader'
import { useNavigate } from 'react-router-dom'
import { getRouteUserEdit } from '@/shared/const/router'
import { Loader } from '@/shared/ui/Loader'
import { Icon } from '@/shared/ui/redesigned/Icon'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { AdminTopUpModal } from '@/features/AdminTopUp'

export const UsersList = (props: UsersListProps) => {
  const {
    className,
    isLoading,
    target,
    isError,
    users
  } = props

  const { t } = useTranslation('users')
  const navigate = useNavigate()

  const [topUpUser, setTopUpUser] = useState<User | null>(null)

  const getSkeletons = () => {
    return new Array(4)
      .fill(0)
      .map((item, index) => (
        <ContentListItemSkeleton className={cls.card} key={index} view={'BIG'} />
      ))
  }

  const handleTopUp = useCallback((user: User) => {
    setTopUpUser(user)
  }, [])

  const handleCloseTopUp = useCallback(() => {
    setTopUpUser(null)
  }, [])

  if (isError) {
    return (
      <ErrorGetData />
    )
  }

  if (isLoading) {
    return (
      <VStack max align="center" justify="center" className={cls.loaderWrap}>
        <Loader />
      </VStack>
    )
  }

  const renderContent = (user: User) => {
    return (
      <UserItem
        key={user.id}
        user={user}
        className={cls.userItem}
        onEdit={(id) => navigate(getRouteUserEdit(id))}
        onTopUp={handleTopUp}
      />
    )
  }

  return (
    <VStack gap={'16'} max>
      <UsersListHeader />

      {users?.rows.length
        ? <HStack wrap={'wrap'} gap={'16'} align={'start'} max>
          {users.rows.map(renderContent)}
        </HStack>
        : <VStack justify={'center'} align={'center'} max className={cls.emptyState} gap={'16'}>
          <Icon Svg={SearchIcon} width={48} height={48} />
          <Text align={'center'} text={t('Данные не найдены')} size={'l'} bold />
          <Text align={'center'} text={t('Нет пользователей')} />
        </VStack>
      }
      {isLoading && getSkeletons()}

      <AdminTopUpModal
        isOpen={!!topUpUser}
        onClose={handleCloseTopUp}
        userId={topUpUser?.id || ''}
        userName={topUpUser?.name || ''}
      />
    </VStack>
  )
}

import cls from './SubUsersList.module.scss'
import React, { useCallback, useMemo, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '../../../ErrorGetData'
import { User } from '../../model/types/user'
import { Text } from '@/shared/ui/redesigned/Text'
import { UserItem } from '../UserItem/UserItem'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getRouteUserCreate, getRouteUserEdit } from '@/shared/const/router'
import { Loader } from '@/shared/ui/Loader'
import { Icon } from '@/shared/ui/redesigned/Icon'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { Button } from '@/shared/ui/redesigned/Button'
import { Plus } from 'lucide-react'
import { useGetSubUsers } from '../../api/usersApi'
import { useSelector } from 'react-redux'
import { getUserAuthData } from '../../model/selectors/getUserAuthData/getUserAuthData'
import { SearchInput } from '@/shared/ui/mui/SearchInput'

interface SubUsersListProps {
  className?: string
}

export const SubUsersList = (props: SubUsersListProps) => {
  const { className } = props
  const { t } = useTranslation('users')
  const navigate = useNavigate()
  const authData = useSelector(getUserAuthData)

  const { data: subUsers, isLoading, isError } = useGetSubUsers()

  const [search, setSearch] = useState('')

  const filteredUsers = useMemo(() => {
    if (!subUsers) return []
    const allUsers = authData ? [authData, ...subUsers] : subUsers
    if (!search) return allUsers
    const lowerSearch = search.toLowerCase()
    return allUsers.filter(user =>
      (user.name?.toLowerCase().includes(lowerSearch)) ||
      (user.email?.toLowerCase().includes(lowerSearch))
    )
  }, [subUsers, authData, search])

  const onChangeSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])

  if (isError) {
    return <ErrorGetData />
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
        onEdit={(id) => { navigate(getRouteUserEdit(id)) }}
      />
    )
  }

  return (
    <VStack gap={'16'} max>
      <VStack gap="16" max className={cls.header}>
        <HStack max justify="between" align="center" gap="16" wrap="wrap">
          <VStack gap="4">
            <Text title={t('Пользователи')} size="l" bold />
            <Text text={t('Управление пользователями')} size="s" variant="accent" />
          </VStack>

          <HStack gap="16" wrap="nowrap" className={cls.headerActions}>
            <SearchInput
              data-testid="SubUserSearch"
              className={cls.searchInput}
              placeholder={t('Поиск') ?? ''}
              onChange={onChangeSearch}
              value={search}
              fullWidth={false}
            />

            <AppLink to={getRouteUserCreate()}>
              <Button
                className={cls.createBtn}
                addonLeft={<Plus size={20} className={cls.plusIcon} />}
                variant="outline"
              >
                {t('Добавить пользователя')}
              </Button>
            </AppLink>
          </HStack>
        </HStack>
      </VStack>

      {filteredUsers.length
        ? <HStack wrap={'wrap'} gap={'16'} align={'start'} max>
          {filteredUsers.map(renderContent)}
        </HStack>
        : <VStack justify={'center'} align={'center'} max className={cls.emptyState} gap={'16'}>
          <Icon Svg={SearchIcon} width={48} height={48} />
          <Text align={'center'} text={t('Данные не найдены')} size={'l'} bold />
          <Text align={'center'} text={t('Нет пользователей')} />
        </VStack>
      }
    </VStack>
  )
}

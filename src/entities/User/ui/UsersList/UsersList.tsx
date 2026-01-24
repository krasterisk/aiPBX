import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UsersList.module.scss'
import React, { useCallback, useState } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '../../../ErrorGetData'
import { ContentListItemSkeleton } from '../../../Content'
import { User, UsersListProps } from '../../model/types/user'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { UserItem } from '../UserItem/UserItem'
import { useDeleteUser } from '../../api/usersApi'
import { useTranslation } from 'react-i18next'
import { UsersListHeader } from '../UsersListHeader/UsersListHeader'
import { useNavigate } from 'react-router-dom'
import { getRouteUserEdit } from '@/shared/const/router'
import { Loader } from '@/shared/ui/Loader'

export const UsersList = (props: UsersListProps) => {
  const {
    className,
    isLoading,
    target,
    isError,
    users
  } = props

  const { t } = useTranslation('profile')
  const navigate = useNavigate()

  const [checkedBox, setCheckedBox] = useState<string[]>([])
  const [indeterminateBox, setIndeterminateBox] = useState<boolean>(false)

  const [userDeleteMutation, { isError: isDeleteError, isLoading: isDeleteLoading }] = useDeleteUser()

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setCheckedBox((prev) => {
      const currentIndex = prev.indexOf(value)
      const newChecked = [...prev]
      if (currentIndex === -1) {
        newChecked.push(value)
      } else {
        newChecked.splice(currentIndex, 1)
      }
      if (users?.count) {
        setIndeterminateBox(newChecked.length > 0 && newChecked.length < users?.count)
      }
      return newChecked
    })
  }

  const handleCheckAll = useCallback(() => {
    if (indeterminateBox && users?.count && checkedBox.length > 0) {
      setCheckedBox(users?.rows.map(users => String(users.id)))
      setIndeterminateBox(false)
    }

    if (!indeterminateBox && users?.count && checkedBox.length === 0) {
      setCheckedBox(users?.rows.map(users => String(users.id)))
      setIndeterminateBox(false)
    }

    if (!indeterminateBox && checkedBox.length > 0) {
      setCheckedBox([])
    }
  }, [users?.count, users?.rows, checkedBox.length, indeterminateBox])

  const getSkeletons = () => {
    return new Array(4)
      .fill(0)
      .map((item, index) => (
        <ContentListItemSkeleton className={cls.card} key={index} view={'BIG'} />
      ))
  }

  const handlerDeleteAll = useCallback(() => {
    checkedBox.forEach(item => {
      userDeleteMutation(item).unwrap()
    })
    setCheckedBox([])
    setIndeterminateBox(false)
  }, [userDeleteMutation, checkedBox])

  if (isError) {
    return (
      <ErrorGetData />
    )
  }

  if (isDeleteError) {
    return (
      <ErrorGetData
        title={String(t('Произошла ошибка при удалении пользователя!'))}
        text={String(t('Проверьте, чтобы у пользователя не было связанных ассистентов или функций!'))}
      />
    )
  }

  if (isLoading || isDeleteLoading) {
    return (
      <Loader className={cls.loader} />
    )
  }

  const checkedButtons = (
    <HStack
      gap={'16'}
      wrap={'wrap'}
      className={classNames(cls.CasksList, {
        [cls.uncheckButtons]: checkedBox.length === 0,
        [cls.checkButton]: checkedBox.length > 0
      }, [])}
    >
      <Button
        variant={'clear'}
        onClick={handlerDeleteAll}
      >
        <Text text={t('Удалить выбранные')} variant={'error'} />
      </Button>
    </HStack>
  )

  const renderContent = (user: User) => {
    return (
      <UserItem
        key={user.id}
        user={user}
        checkedItems={checkedBox}
        onChangeChecked={handleCheckChange}
        target={target}
        view={'BIG'}
        className={cls.userItem}
        onEdit={(id) => navigate(getRouteUserEdit(id))}
      />
    )
  }

  return (
    <VStack gap={'16'} max>
      <UsersListHeader />
      <Card max className={classNames(cls.UsersList, {}, [className])}>
        <HStack wrap={'nowrap'} justify={'end'} gap={'24'}>
          <Check
            className={classNames(cls.UsersList, {
              [cls.uncheck]: checkedBox.length === 0,
              [cls.check]: checkedBox.length > 0
            }, [])}
            indeterminate={indeterminateBox}
            checked={checkedBox.length === users?.count}
            onChange={handleCheckAll}
          />
          {checkedButtons}
          {
            checkedBox.length > 0
              ? <Text text={t('Выбрано') + ': ' + String(checkedBox.length) + t(' из ') + String(users?.count)} />
              : <Text text={t('Всего') + ': ' + String(users?.count || 0)} />
          }

        </HStack>
      </Card>
      {users?.rows.length
        ? <HStack gap={'16'} align={'start'} wrap={'wrap'} max>
          {users.rows.map(renderContent)}
        </HStack>
        : <HStack
          justify={'center'} max
          className={classNames('', {}, [className, cls.BIG])}
        >
          <Text align={'center'} text={t('Данные не найдены')} />
        </HStack>
      }
      {isLoading && getSkeletons()}
    </VStack>
  )
}

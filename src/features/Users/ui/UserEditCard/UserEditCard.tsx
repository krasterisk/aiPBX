import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserEditCard.module.scss'
import { useTranslation } from 'react-i18next'
import React, { ChangeEvent, memo, useCallback, useEffect, useState } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import {
  CurrencySelect,
  isUserAdmin,
  RoleSelect,
  useGetUser,
  User,
  UserCurrencyValues,
  UserRoles,
  UserRolesValues
} from '@/entities/User'
import { UserEditCardHeader } from '../UserEditCardHeader/UserEditCardHeader'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { useSelector } from 'react-redux'
import { Avatar } from '@/shared/ui/redesigned/Avatar'
import { UserAddAvatar } from '@/entities/User'
import { HStack } from '@/shared/ui/redesigned/Stack'

interface UserEditCardProps {
  className?: string
  isError?: boolean
  onEdit?: (data: User) => void
  userId?: string
  error?: FetchBaseQueryError | SerializedError | undefined
  onDelete?: (id: string) => void
}

export const UserEditCard = memo((props: UserEditCardProps) => {
  const {
    className,
    onEdit,
    userId,
    onDelete
  } = props

  const { data, isError, isLoading, error } = useGetUser(userId!, {
    skip: userId === undefined
  })

  const initUser = {
    id: '',
    username: '',
    name: '',
    email: '',
    password: '',
    designed: false,
    avatar: '',
    token: '',
    role: ''
  }
  const [formFields, setFormFields] = useState<User>(initUser)
  const isAdmin = useSelector(isUserAdmin)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  const { t } = useTranslation('profile')

  const editTextChangeHandler = (field: keyof User) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setFormFields({
        ...formFields,
        [field]: value
      })
    }

  const editChangeRolesHandler = (field: keyof User) => (event: any, value: UserRolesValues) => {
    setFormFields({
      ...formFields,
      [field]: [{ value, description: '' }]
    })
  }

  const editChangeCurrencyHandler = (field: keyof User) => (event: any, value: UserCurrencyValues) => {
    setFormFields({
      ...formFields,
      [field]: value
    })
  }

  const editHandler = useCallback(() => {
    onEdit?.(formFields)
  }, [formFields, onEdit])

  useEffect(() => {
    if (data) {
      setFormFields(data)
    }
  }, [data])

  if (isError) {
    return (
      <ErrorGetData />
    )
  }

  if (isLoading || (!data && userId)) {
    return (
      <VStack gap={'16'} max>
        <Card max>
          <Skeleton width='100%' border='8px' height='44px' />
        </Card>
        <Skeleton width='100%' border='8px' height='80px' />
        <Skeleton width='100%' border='8px' height='80px' />
        <Skeleton width='100%' border='8px' height='80px' />
      </VStack>
    )
  }

  const avatarSrc = formFields.avatar
    ? (formFields.avatar.startsWith('http') ? formFields.avatar : `${__STATIC__}/${formFields.avatar}`)
    : ''

  return (
    <VStack gap={'8'} max className={classNames(cls.UserEditCard, {}, [className])}>
      <UserEditCardHeader onEdit={editHandler} onDelete={onDelete} userId={userId} />
      {isError
        ? <ErrorGetData
          title={t('Ошибка при сохранении пользователя') || ''}
          text={
            error &&
            String(t('Проверьте заполняемые поля и повторите ещё раз'))
          }
        />
        : ''}
      <Card
        max
        padding={'8'}
        border={'partial'}
      >
        <VStack
          gap={'16'}
          max
        >
          <HStack justify={'center'} max>
            <div onClick={() => setIsAvatarModalOpen(true)} style={{ cursor: 'pointer', display: 'flex' }}>
              <Avatar size={100} src={avatarSrc} />
            </div>
          </HStack>
          <UserAddAvatar
            show={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
            user={formFields}
          />


          <Textarea
            fullWidth
            // className={classNames(cls.UserCreateCard, {}, [className])}
            label={t('Наименование клиента') ?? ''}
            onChange={editTextChangeHandler('name')}
            data-testid={'UserCard.name'}
            value={formFields.name || ''}
          />

          {/* <Textarea */}
          {/*    label={t('Пароль') ?? ''} */}
          {/*    onChange={editTextChangeHandler('password')} */}
          {/*    data-testid={'UserCard.password'} */}
          {/*    value={formFields.password} */}
          {/* /> */}
          <Textarea
            label={t('Email') ?? ''}
            onChange={editTextChangeHandler('email')}
            data-testid={'UserCard.email'}
            value={formFields.email || ''}
          />
          <CurrencySelect
            value={formFields.currency}
            label={t('Валюта') || ''}
            data-testid={'UserCard.CurrencySelect'}
            onChange={editChangeCurrencyHandler('currency')}
          />
          {isAdmin &&
            <>
              <RoleSelect
                value={formFields.roles?.[0]?.value}
                label={t('Уровень доступа') || ''}
                data-testid={'UserCard.RoleSelect'}
                onChange={editChangeRolesHandler('roles')}
              />
            </>
          }
        </VStack>
      </Card>
    </VStack>
  )
})

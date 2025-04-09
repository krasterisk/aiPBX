import { useTranslation } from 'react-i18next'
import cls from './UserCreateCard.module.scss'
import React, { ChangeEvent, memo, useCallback, useEffect, useState } from 'react'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { ErrorGetData } from '@/entities/ErrorGetData'
import {
  ClientOptions,
  ClientSelect,
  getUserAuthData,
  isUserAdmin,
  RoleSelect,
  User,
  UserRoles,
  UserRolesValues
} from '@/entities/User'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { UserCreateCardHeader } from '../UserCreateCardHeader/UserCreateCardHeader'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { classNames } from '@/shared/lib/classNames/classNames'
import { useSelector } from 'react-redux'
import { Text } from '@/shared/ui/redesigned/Text'

interface UserCreateCardProps {
  className?: string
  onCreate?: (data: User) => void
  isError?: boolean
  error?: FetchBaseQueryError | SerializedError | undefined
}

interface userErrorProps {
  isError: boolean
  message?: string
}

export const UserCreateCard = memo((props: UserCreateCardProps) => {
  const {
    className,
    onCreate,
    isError,
    error
  } = props

  const initUser: User = {
    id: '',
    username: '',
    name: '',
    email: '',
    password: '',
    designed: false,
    avatar: '',
    token: '',
    vpbxUser: {
      id: '',
      name: ''
    },
    vpbx_user_id: '',
    roles: []
  }

  const isAdmin = useSelector(isUserAdmin)
  const clientData = useSelector(getUserAuthData)
  const [formFields, setFormFields] = useState<User>(initUser)
  const [userError, setUserError] = useState<userErrorProps>({ isError: false })
  const [client, setClient] = useState<ClientOptions>(
    !isAdmin
      ? {
          id: clientData?.id || '',
          name: clientData?.name || ''
        }
      : {
          id: '',
          name: ''
        }
  )

  const { t } = useTranslation('profile')

  useEffect(() => {
    if (!isAdmin) {
      setFormFields({
        ...formFields,
        vpbx_user_id: clientData?.id,
        vpbxUser: {
          id: clientData?.id || '',
          name: clientData?.name || ''
        },
        roles: [
          {
            value: UserRolesValues.USER,
            descriptions: ''
          }
        ]
      })
    }
  }, [clientData, formFields, isAdmin])

  const createTextChangeHandler = (field: keyof User) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setFormFields({
        ...formFields,
        [field]: value
      })
    }

  const onChangeClientHandler = useCallback((event: any, newValue: ClientOptions) => {
    if (newValue) {
      setClient(newValue)
      setFormFields({
        ...formFields,
        vpbx_user_id: newValue.id,
        vpbxUser: newValue
      })
    } else {
      setClient({ id: '', name: '' })
    }
  }, [formFields])

  const createChangeRolesHandler = (field: keyof User) => (event: any, value: UserRoles) => {
    setFormFields({
      ...formFields,
      [field]: [value]
    })
  }

  const createHandler = useCallback(() => {
    if (!formFields.name) {
      setUserError({ message: String(t('Введите имя!')), isError: true })
      return
    }
    if (!formFields.username) {
      setUserError({ message: String(t('Введите логин!')), isError: true })
      return
    }
    if (!formFields.password) {
      setUserError({ message: String(t('Введите пароль!')), isError: true })
      return
    }
    if (!formFields.email) {
      setUserError({ message: String(t('Введите email!')), isError: true })
      return
    }
    setUserError({ message: '', isError: false })
    onCreate?.(formFields)
  }, [formFields, onCreate, t])

  return (
            <VStack
                gap={'8'}
                max
                className={classNames(cls.UserCreateCard, {}, [className])}
            >
                <UserCreateCardHeader onCreate={createHandler} isAdmin={isAdmin}/>
                {userError &&
                    <HStack max justify={'center'}>
                        <Text
                            text={userError.message}
                            variant={'error'}
                        />
                    </HStack>
                }
                {isError
                  ? <ErrorGetData
                        title={t('Ошибка при создании пользователя') || ''}
                        text={
                            error && 'data' in error
                              ? String(t((error.data as { message: string }).message))
                              : String(t('Проверьте заполняемые поля и повторите ещё раз'))
                        }
                    />
                  : ''}
                <Card
                    max
                    padding={'8'}
                    border={'partial'}
                >
                    <VStack
                        gap={'8'}
                        max
                    >
                        <Textarea
                            // className={classNam  es(cls.UserCreateCard, {}, [className])}
                            label={t('Наименование') + '*' ?? ''}
                            onChange={createTextChangeHandler('name')}
                            data-testid={'UserCard.name'}
                            value={formFields.name}
                        />
                        <Textarea
                            label={t('Логин / имя пользователя') + '*' ?? ''}
                            onChange={createTextChangeHandler('username')}
                            data-testid={'UserCard.username'}
                            value={formFields.username}
                        />
                        <Textarea
                            label={t('Пароль') + '*' ?? ''}
                            onChange={createTextChangeHandler('password')}
                            data-testid={'UserCard.password'}
                            value={formFields.password}
                        />
                        <Textarea
                            label={t('Реквизиты') ?? ''}
                            onChange={createTextChangeHandler('clientData')}
                            data-testid={'UserCard.RepairCost'}
                            value={formFields.clientData}
                        />
                        <Textarea
                            label={t('Email') + '*' ?? ''}
                            onChange={createTextChangeHandler('email')}
                            data-testid={'UserCard.email'}
                            value={formFields.email}
                        />
                        {isAdmin &&
                            <>
                                <RoleSelect
                                    label={t('Уровень доступа') + '*' || ''}
                                    data-testid={'UserCard.CodecSelect'}
                                    onChange={createChangeRolesHandler('roles')}
                                    value={formFields.roles?.[0]}
                                />
                                <ClientSelect
                                    value={client.id ? client : ''}
                                    clientId={client.id}
                                    onChangeClient={onChangeClientHandler}
                                    label={String(t('Клиент') + '**')}
                                    className={cls.client}
                                    data-testid={'UserCard.ClientSelect'}
                                />
                                <Text
                                    text={'**' + t('Если создаёте пользователя для клиента, то укажите его, если нового клиента, то оставьте поле пустым')}/>
                            </>
                        }
                    </VStack>
                </Card>
            </VStack>
  )
}
)

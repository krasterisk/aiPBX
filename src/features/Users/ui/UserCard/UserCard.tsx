import React, { memo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRouteMain, getRouteUsers } from '@/shared/const/router'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserCard.module.scss'
import {
  isUserAdmin,
  useDeleteUser,
  User,
  usersApi,
  useSetUsers,
  useUpdateUser
} from '@/entities/User'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { UserForm } from '../UserForm/UserForm'
import { UserFormHeader } from '../UserFormHeader/UserFormHeader'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { useTranslation } from 'react-i18next'

export interface UserCardProps {
  className?: string
  error?: string
  isLoading?: boolean
  readonly?: boolean
  isEdit?: boolean
  userId?: string
}

export const UserCard = memo((props: UserCardProps) => {
  const {
    className,
    isLoading,
    isEdit,
    userId
  } = props

  const [userMutation, { isError: isCreateError, error: createError }] = useSetUsers()
  const [userUpdateMutation, { isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateUser()
  const [userDeleteMutation, { isError: isDeleteError, isLoading: isDeleteLoading }] = useDeleteUser()
  const isAdmin = useSelector(isUserAdmin)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation('users')

  const initUser: User = {
    id: '',
    username: '',
    name: '',
    email: '',
    password: '',
    designed: false,
    avatar: '',
    token: '',
    vpbxUser: { id: '', name: '' },
    vpbx_user_id: '',
    roles: []
  }

  const [formFields, setFormFields] = useState<User>(initUser)

  const validateForm = useCallback(() => {
    if (!formFields.name) {
      toast.error(t('Введите имя'))
      return false
    }
    if (!formFields.email) {
      toast.error(t('Введите email'))
      return false
    }
    return true
  }, [formFields, t])

  const onSave = useCallback(async () => {
    if (!validateForm()) return

    try {
      if (isEdit && userId) {
        await userUpdateMutation(formFields).unwrap()
        toast.success(t('Сохранено успешно'))
        navigate(isAdmin ? getRouteUsers() : getRouteMain())
      } else {
        const payload = await userMutation({ ...formFields }).unwrap()
        dispatch(
          usersApi.util.updateQueryData('getAllUsers', null, (draft) => {
            draft.push(payload)
          })
        )
        toast.success(t('Пользователь создан'))
        navigate(getRouteUsers())
      }
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }, [formFields, isEdit, userId, userUpdateMutation, userMutation, navigate, isAdmin, dispatch, validateForm, t])

  const onDelete = useCallback(async (id: string) => {
    try {
      await userDeleteMutation(id).unwrap()
      toast.success(t('Пользователь удалён'))
      navigate(isAdmin ? getRouteUsers() : getRouteMain())
    } catch (e) {
      toast.error(getErrorMessage(e))
    }
  }, [userDeleteMutation, navigate, isAdmin, t])

  const isBusy = isLoading || isUpdateLoading || isDeleteLoading

  if (!userId && isEdit) {
    return <ErrorGetData />
  }

  if (isDeleteError || isUpdateError) {
    return <ErrorGetData />
  }

  if (isBusy) {
    return (
      <Card padding="24" max>
        <VStack gap="32">
          <HStack gap="32" max>
            <VStack gap="16" max>
              <Skeleton width="100%" height={38} />
              <Skeleton width="100%" height={38} />
              <Skeleton width="100%" height={38} />
              <Skeleton width="100%" height={38} />
              <Skeleton width="100%" height={38} />
              <Skeleton width="100%" height={38} />
            </VStack>
          </HStack>
        </VStack>
      </Card>
    )
  }

  return (
    <VStack gap="8" max className={classNames(cls.EndpointCard, {}, [className])}>
      <UserFormHeader
        isEdit={isEdit}
        userName={formFields?.name}
        userId={userId}
        onSave={onSave}
        onDelete={isAdmin ? onDelete : undefined}
        isLoading={isBusy}
        variant="diviner-top"
      />

      <UserForm
        userId={userId}
        isEdit={isEdit}
        formFields={formFields}
        setFormFields={setFormFields}
      />

      <UserFormHeader
        isEdit={isEdit}
        userName={formFields?.name}
        userId={userId}
        onSave={onSave}
        onDelete={isAdmin ? onDelete : undefined}
        isLoading={isBusy}
        variant="diviner-bottom"
      />
    </VStack>
  )
})

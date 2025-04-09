import React, { memo, useCallback } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Skeleton } from '@/shared/ui/redesigned/Skeleton'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserCard.module.scss'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { getRouteUsers } from '@/shared/const/router'
import { useNavigate } from 'react-router-dom'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { useDeleteUser, User, usersApi, useSetUsers, useUpdateUser } from '@/entities/User'
import { UserEditCard } from '../UserEditCard/UserEditCard'
import { UserCreateCard } from '../UserCreateCard/UserCreateCard'

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

  const [userMutation, { isError, error }] = useSetUsers()
  const [userUpdateMutation, { isError: isUpdateError, isLoading: isUpdateLoading }] = useUpdateUser()
  const [userDeleteMutation, { isError: isDeleteError, isLoading: isDeleteLoading }] = useDeleteUser()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleCreateUser = useCallback((data: User) => {
    userMutation({ ...data })
      .unwrap()
      .then((payload) => {
        // console.log('fulfilled', payload)
        dispatch(
          usersApi.util.updateQueryData('getAllUsers', null, (draftCasks) => {
            draftCasks.push(payload)
          })
        )
        navigate(getRouteUsers())
      })
      .catch(() => {
      })
  }, [dispatch, userMutation, navigate])

  const onCreate = useCallback((data: User) => {
    handleCreateUser(data)
  }, [handleCreateUser])

  const handleEditUser = useCallback(async (data: User) => {
    try {
      await userUpdateMutation(data).unwrap()
    } finally {
      navigate(getRouteUsers())
    }

    // .unwrap()
    // .then((payload) => {
    //   console.log('fulfilled', payload)
    //   dispatch(
    //     endpointsApi.util.updateQueryData('getEndpoints', null, (draftEndpoints) => {
    //       Object.assign(draftEndpoints, payload)
    //     })
    //   )
    //   navigate(getRouteEndpoints())
    // })
    // .catch(() => {
    //
    // })
  }, [userUpdateMutation, navigate])

  const handleDeleteUser = useCallback(async (id: string) => {
    try {
      await userDeleteMutation(id).unwrap()
    } finally {
      navigate(getRouteUsers())
    }
  }, [userDeleteMutation, navigate])

  const onDelete = useCallback((id: string) => {
    handleDeleteUser(id)
  }, [handleDeleteUser])

  const onEdit = useCallback((data: User) => {
    handleEditUser(data)
  }, [handleEditUser])

  if (!userId && isEdit) {
    return (
            <ErrorGetData/>
    )
  }

  if (isDeleteError || isUpdateError) {
    return (
            <ErrorGetData />
    )
  }

  if (isLoading || isDeleteLoading || isUpdateLoading) {
    return (
            <Card padding="24" max>
                <VStack gap="32">
                    <HStack gap="32" max>
                        <VStack gap="16" max>
                            <Skeleton width="100%" height={38}/>
                            <Skeleton width="100%" height={38}/>
                            <Skeleton width="100%" height={38}/>
                            <Skeleton width="100%" height={38}/>
                            <Skeleton width="100%" height={38}/>
                            <Skeleton width="100%" height={38}/>
                        </VStack>
                    </HStack>
                </VStack>
            </Card>
    )
  }

  return (
        <VStack gap={'8'} max className={classNames(cls.EndpointCard, {}, [className])}>
            {
                isEdit
                  ? <UserEditCard
                        onEdit={onEdit}
                        isError={isError}
                        userId={userId}
                        onDelete={onDelete}
                    />
                  : <UserCreateCard
                        onCreate={onCreate}
                        isError={isError}
                        error={error}
                    />

            }
        </VStack>
  )
})

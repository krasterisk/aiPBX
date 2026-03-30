import React, { memo, useCallback } from 'react'
import cls from './UsersPage.module.scss'
import { Page } from '@/widgets/Page'
import { classNames } from '@/shared/lib/classNames/classNames'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
// eslint-disable-next-line krasterisk-plugin/layer-imports
import { UsersList, usersPageReducer, useUserFilters, initUsersPage, isUserAdmin, isOwnerUser, isSubUser, SubUsersList } from '@/entities/User'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { getRouteMain } from '@/shared/const/router'

interface UsersPageProps {
  className?: string
}

const reducers: ReducersList = {
  usersPage: usersPageReducer
}

const UsersPage = ({ className }: UsersPageProps) => {
  const isAdmin = useSelector(isUserAdmin)
  const isOwner = useSelector(isOwnerUser)
  const isSub = useSelector(isSubUser)

  const {
    isError,
    isLoading,
    error,
    data,
    hasMore,
    onRefetch,
    onLoadNext
  } = useUserFilters()

  const dispatch = useAppDispatch()

  const onLoadNextPart = useCallback(() => {
    if (hasMore) {
      onLoadNext()
    }
  }, [hasMore, onLoadNext])

  useInitialEffect(() => {
    if (isAdmin) {
      dispatch(initUsersPage())
    }
  })

  // Sub-user view: deny access
  if (isSub) {
    return <Navigate to={getRouteMain()} replace />
  }

  // Owner view: show SubUsersList
  if (isOwner && !isAdmin) {
    return (
      <Page
        data-testid={'UsersPage'}
        className={classNames(cls.UsersPage, {}, [className])}
      >
        <SubUsersList />
      </Page>
    )
  }

  // Admin view: existing behavior
  const content = (
    <Page
      data-testid={'UsersPage'}
      onScrollEnd={onLoadNextPart}
      className={classNames(cls.UsersPage, {}, [className])}
      isSaveScroll={true}
    >
      <UsersList
        className={className}
        isLoading={isLoading}
        users={data}
        isError={isError}
      />
    </Page>
  )

  if (isError) {
    const errMsg = error && 'data' in error
      ? String((error.data as { message: string }).message)
      : ''

    return (
      <ErrorGetData
        text={errMsg}
        onRefetch={onRefetch}
      />
    )
  }

  return (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
      {content}
    </DynamicModuleLoader>
  )
}

export default memo(UsersPage)

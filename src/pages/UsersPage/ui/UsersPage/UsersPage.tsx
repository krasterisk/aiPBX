import React, { memo, useCallback } from 'react'
import cls from './UsersPage.module.scss'
import { Page } from '@/widgets/Page'
import { classNames } from '@/shared/lib/classNames/classNames'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { UsersList, usersPageReducer, useUserFilters, initUsersPage } from '@/entities/User'

interface UsersPageProps {
  className?: string
}

const reducers: ReducersList = {
  usersPage: usersPageReducer
}

const UsersPage = ({ className }: UsersPageProps) => {
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
    dispatch(initUsersPage())
  })

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

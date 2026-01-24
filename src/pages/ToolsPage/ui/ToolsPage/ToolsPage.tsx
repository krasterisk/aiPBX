import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolsPage.module.scss'
import React, { memo, useCallback } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { Page } from '@/widgets/Page'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { ToolsList, toolsPageReducer, useToolsFilters, initToolsPage } from '@/entities/Tools'

interface ToolsPageProps {
  className?: string
}

const reducers: ReducersList = {
  toolsPage: toolsPageReducer
}

const ToolsPage = ({ className }: ToolsPageProps) => {
  const {
    view,
    isError,
    isLoading,
    error,
    data,
    hasMore,
    onRefetch,
    onLoadNext
  } = useToolsFilters()

  const dispatch = useAppDispatch()

  const onLoadNextPart = useCallback(() => {
    if (hasMore) {
      onLoadNext()
    }
  }, [hasMore, onLoadNext])

  useInitialEffect(() => {
    dispatch(initToolsPage())
  })

  const content = (
    <Page
      data-testid={'ToolsPage'}
      onScrollEnd={onLoadNextPart}
      className={classNames(cls.ToolsPage, {}, [className])}
      isSaveScroll={true}
    >
      <ToolsList
        className={className}
        isToolsLoading={isLoading}
        tools={data}
        isToolsError={isError}
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

export default memo(ToolsPage)

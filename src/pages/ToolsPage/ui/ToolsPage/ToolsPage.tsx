import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolsPage.module.scss'
import React, { memo, useCallback } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { Page } from '@/widgets/Page'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { ToolsList, toolsPageReducer, useToolsFilters, initToolsPage } from '@/entities/Tools'
import { useTranslation } from 'react-i18next'

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

  const { t } = useTranslation('tools')

  const dispatch = useAppDispatch()

  const isAdmin = useSelector(isUserAdmin)

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
            view={view}
            className={className}
            isToolsLoading={isLoading}
            tools={data}
            isToolsError={isError}
        />
      </Page>
  )

  if (!isAdmin) {
    return (
        <ErrorGetData
            text={t('Доступ запрещён!') || ''}
            onRefetch={onRefetch}
        />
    )
  }

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

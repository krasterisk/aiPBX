import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantsPage.module.scss'
import React, { memo, useCallback } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { Page } from '@/widgets/Page'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { AssistantsList, assistantsPageReducer, useAssistantFilters, initAssistantsPage } from '@/entities/Assistants'

interface AssistantsPageProps {
  className?: string
}

const reducers: ReducersList = {
  assistantsPage: assistantsPageReducer
}

const AssistantsPage = ({ className }: AssistantsPageProps) => {
  const {
    view,
    isError,
    isLoading,
    error,
    data,
    hasMore,
    onRefetch,
    onLoadNext
  } = useAssistantFilters()

  const dispatch = useAppDispatch()

  const onLoadNextPart = useCallback(() => {
    if (hasMore) {
      onLoadNext()
    }
  }, [hasMore, onLoadNext])

  useInitialEffect(() => {
    dispatch(initAssistantsPage())
  })

  const content = (
    <Page
      data-testid={'AssistantsPage'}
      onScrollEnd={onLoadNextPart}
      className={classNames(cls.AssistantsPage, {}, [className])}
      isSaveScroll={true}
    >
      <AssistantsList
        className={className}
        isAssistantsLoading={isLoading}
        assistants={data}
        isAssistantsError={isError}
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

export default memo(AssistantsPage)

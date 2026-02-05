import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportPage.module.scss'
import React, { memo, useCallback } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { Page } from '@/widgets/Page'
import {
  initReportsPage,
  ReportList,
  reportsPageReducer,
  useReportFilters
} from '@/entities/Report'
import { ErrorGetData } from '@/entities/ErrorGetData'

interface ReportsPageProps {
  className?: string
}

const reducers: ReducersList = {
  reportsPage: reportsPageReducer
}

const ReportsPage = ({ className }: ReportsPageProps) => {
  const {
    isError,
    isLoading,
    error,
    data,
    hasMore,
    onRefetch,
    onLoadNext
  } = useReportFilters()

  const dispatch = useAppDispatch()

  const onLoadNextPart = useCallback(() => {
    if (hasMore) {
      onLoadNext()
    }
  }, [hasMore, onLoadNext])

  useInitialEffect(() => {
    dispatch(initReportsPage())
  })

  if (isError) {
    const errMsg = error && typeof error === 'object' && 'data' in error
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
      <Page
        data-testid="ReportsPage"
        onScrollEnd={onLoadNextPart}
        className={classNames(cls.ReportPage, {}, [className])}
        isSaveScroll={true}
      >
        <ReportList
          reports={data}
          isReportsLoading={isLoading}
          isReportsError={isError}
        />
      </Page>
    </DynamicModuleLoader>
  )
}

export default memo(ReportsPage)

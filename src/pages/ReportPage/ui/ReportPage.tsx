import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportPage.module.scss'
import React, { memo, useCallback } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { Page } from '@/widgets/Page'
import {
  initReportsPage,
  ReportList,
  reportsPageReducer,
  useReportFilters
} from '@/entities/Report'

interface ReportsPageProps {
  className?: string
}

const reducers: ReducersList = {
  reportsPage: reportsPageReducer
}

const ReportsPage = ({ className }: ReportsPageProps) => {
  const {
    view,

    isError,
    isLoading,
    data,
    hasMore,
    onLoadNext
  } = useReportFilters()

  const dispatch = useAppDispatch()

  const isAdmin = useSelector(isUserAdmin)

  const onLoadNextPart = useCallback(() => {
    if (hasMore) {
      onLoadNext()
    }
  }, [hasMore, onLoadNext])

  useInitialEffect(() => {
    dispatch(initReportsPage())
  })

  const content = (
        <Page
            data-testid={'ReportsPage'}
            onScrollEnd={onLoadNextPart}
            className={classNames(cls.ReportPage, {}, [className])}
            isSaveScroll={true}
        >

            <ReportList
                view={view}
                reports={data}
                isReportsLoading={isLoading}
                isReportsError={isError}
            />
        </Page>
  )

  return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            {content}
        </DynamicModuleLoader>
  )
}

export default memo(ReportsPage)

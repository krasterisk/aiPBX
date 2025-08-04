import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportPage.module.scss'
import React, { memo, useCallback, useEffect } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { Page } from '@/widgets/Page'
import {
  initReportsPage,
  ReportList, reportsPageActions,
  reportsPageReducer,
  useReportFilters
} from '@/entities/Report'
import { useMediaQuery } from '@mui/material'

interface ReportsPageProps {
  className?: string
}

const reducers: ReducersList = {
  reportsPage: reportsPageReducer
}

const ReportsPage = ({ className }: ReportsPageProps) => {
  const {
    view,
    manualView,
    isError,
    isLoading,
    data,
    hasMore,
    onLoadNext
  } = useReportFilters()

  const dispatch = useAppDispatch()
  const isMobile = useMediaQuery('(max-width:800px)')

  const onLoadNextPart = useCallback(() => {
    if (hasMore) {
      onLoadNext()
    }
  }, [hasMore, onLoadNext])

  useInitialEffect(() => {
    dispatch(initReportsPage())
  })

  console.log(isMobile)

  useEffect(() => {
    if (!manualView) {
      if (isMobile) {
        dispatch(reportsPageActions.setView('SMALL'))
      } else {
        dispatch(reportsPageActions.setView('BIG'))
      }
    }
  }, [dispatch, isMobile, manualView, view])

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

import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PbxServersPage.module.scss'
import React, { memo, useCallback } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { Page } from '@/widgets/Page'
import { pbxServersPageReducer, usePbxServersFilters, initNextPbxServerPage, PbxServersList } from '@/entities/PbxServers'

interface PbxServersPageProps {
  className?: string
}

const reducers: ReducersList = {
  pbxServersPage: pbxServersPageReducer
}

const PbxServersPage = ({ className }: PbxServersPageProps) => {
  const {
    view,
    isError,
    isLoading,
    data,
    hasMore,
    onLoadNext
  } = usePbxServersFilters()

  const dispatch = useAppDispatch()

  const onLoadNextPart = useCallback(() => {
    if (hasMore) {
      onLoadNext()
    }
  }, [hasMore, onLoadNext])

  useInitialEffect(() => {
    dispatch(initNextPbxServerPage())
  })

  const content = (
    <Page
      data-testid={'PbxServersPage'}
      onScrollEnd={onLoadNextPart}
      className={classNames(cls.PbxServersPage, {}, [className])}
      isSaveScroll={true}
    >
      <PbxServersList
        className={className}
        isPbxServersLoading={isLoading}
        pbxServers={data}
        isPbxServersError={isError}
      />
    </Page>
  )

  return (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
      {content}
    </DynamicModuleLoader>
  )
}

export default memo(PbxServersPage)

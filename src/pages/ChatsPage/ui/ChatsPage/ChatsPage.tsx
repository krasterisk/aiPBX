import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ChatsPage.module.scss'
import React, { memo } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { Page } from '@/widgets/Page'
import { ChatsList, chatsPageReducer, chatsPageActions } from '@/entities/Chat'

interface ChatsPageProps {
  className?: string
}

const reducers: ReducersList = {
  chatsPage: chatsPageReducer
}

const ChatsPage = ({ className }: ChatsPageProps) => {
  const dispatch = useAppDispatch()

  useInitialEffect(() => {
    dispatch(chatsPageActions.initState())
  })

  return (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
      <Page
        data-testid={'ChatsPage'}
        className={classNames(cls.ChatsPage, {}, [className])}
      >
        <ChatsList />
      </Page>
    </DynamicModuleLoader>
  )
}

export default memo(ChatsPage)

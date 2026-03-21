import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './KnowledgeBasesPage.module.scss'
import React, { memo } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { Page } from '@/widgets/Page'
import { KnowledgeBasesList, knowledgeBasesPageReducer, knowledgeBasesPageActions } from '@/entities/KnowledgeBases'

interface KnowledgeBasesPageProps {
  className?: string
}

const reducers: ReducersList = {
  knowledgeBasesPage: knowledgeBasesPageReducer
}

const KnowledgeBasesPage = ({ className }: KnowledgeBasesPageProps) => {
  const dispatch = useAppDispatch()

  useInitialEffect(() => {
    dispatch(knowledgeBasesPageActions.initState())
  })

  return (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
      <Page
        data-testid={'KnowledgeBasesPage'}
        className={classNames(cls.KnowledgeBasesPage, {}, [className])}
      >
        <KnowledgeBasesList />
      </Page>
    </DynamicModuleLoader>
  )
}

export default memo(KnowledgeBasesPage)

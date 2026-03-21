import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './KnowledgeBaseDetailPage.module.scss'
import React, { memo } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { Page } from '@/widgets/Page'
import { useParams } from 'react-router-dom'
import { KnowledgeBaseDetail, knowledgeBasesPageReducer } from '@/entities/KnowledgeBases'
import { useKnowledgeBases } from '@/entities/KnowledgeBases'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { ContentListItemSkeleton } from '@/entities/Content'

interface KnowledgeBaseDetailPageProps {
  className?: string
}

const reducers: ReducersList = {
  knowledgeBasesPage: knowledgeBasesPageReducer
}

const KnowledgeBaseDetailPage = ({ className }: KnowledgeBaseDetailPageProps) => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('knowledgeBases')

  const { data: knowledgeBases, isLoading } = useKnowledgeBases(undefined, {
    refetchOnMountOrArgChange: true
  })

  const knowledgeBase = knowledgeBases?.find((kb) => kb.id === Number(id))

  if (isLoading) {
    return (
      <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
        <Page className={classNames(cls.KnowledgeBaseDetailPage, {}, [className])}>
          <VStack gap="16" max>
            <ContentListItemSkeleton view="BIG" />
            <ContentListItemSkeleton view="BIG" />
          </VStack>
        </Page>
      </DynamicModuleLoader>
    )
  }

  if (!knowledgeBase) {
    return (
      <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
        <Page className={classNames(cls.KnowledgeBaseDetailPage, {}, [className])}>
          <VStack gap="16" max align="center" justify="center">
            <Text title={t('База знаний не найдена')} size="l" bold />
          </VStack>
        </Page>
      </DynamicModuleLoader>
    )
  }

  return (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
      <Page
        data-testid={'KnowledgeBaseDetailPage'}
        className={classNames(cls.KnowledgeBaseDetailPage, {}, [className])}
      >
        <KnowledgeBaseDetail knowledgeBase={knowledgeBase} />
      </Page>
    </DynamicModuleLoader>
  )
}

export default memo(KnowledgeBaseDetailPage)

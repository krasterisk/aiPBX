import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './KnowledgeBasesList.module.scss'
import React, { memo } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { KnowledgeBasesListHeader } from '../KnowledgeBasesListHeader/KnowledgeBasesListHeader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { ContentListItemSkeleton } from '@/entities/Content'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { KnowledgeBaseItem } from '../KnowledgeBaseItem/KnowledgeBaseItem'
import { KnowledgeBaseFormModal } from '../KnowledgeBaseFormModal/KnowledgeBaseFormModal'
import { Icon } from '@/shared/ui/redesigned/Icon'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { useKnowledgeBasesPage } from '../../lib/hooks/useKnowledgeBasesPage'

export const KnowledgeBasesList = memo(() => {
  const { t } = useTranslation('knowledgeBases')
  const {
    data,
    isLoading,
    isError,
    search,
    isFormOpen,
    editingKb,
    onChangeSearch,
    onRefetch,
    onOpenCreate,
    onCloseForm
  } = useKnowledgeBasesPage()

  const getSkeletons = () => {
    return new Array(4)
      .fill(0)
      .map((_, index) => (
        <ContentListItemSkeleton key={index} view={'BIG'} />
      ))
  }

  if (isError) {
    return <ErrorGetData onRefetch={onRefetch} />
  }

  return (
    <VStack gap="16" max className={cls.KnowledgeBasesList}>
      <KnowledgeBasesListHeader
        search={search}
        onChangeSearch={onChangeSearch}
        onCreateClick={onOpenCreate}
      />

      {data?.length
        ? (
          <div className={cls.listWrapper}>
            {data.map((kb) => (
              <KnowledgeBaseItem
                key={kb.id}
                knowledgeBase={kb}
              />
            ))}
          </div>
        )
        : !isLoading && (
          <VStack justify="center" align="center" max className={cls.emptyState} gap="16">
            <Icon Svg={SearchIcon} width={48} height={48} />
            <Text align="center" text={t('Баз знаний пока нет')} size="l" bold />
            <Text align="center" text={t('Создайте базу для вашего ассистента')} />
          </VStack>
        )}

      {isLoading && (
        <div className={cls.listWrapper}>
          {getSkeletons()}
        </div>
      )}

      <KnowledgeBaseFormModal
        isOpen={isFormOpen}
        editingKb={editingKb}
        onClose={onCloseForm}
      />
    </VStack>
  )
})

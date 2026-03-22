import cls from './ChatsList.module.scss'
import React, { memo } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { ChatsListHeader } from '../ChatsListHeader/ChatsListHeader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { ContentListItemSkeleton } from '@/entities/Content'
import { Text } from '@/shared/ui/redesigned/Text'
import { useTranslation } from 'react-i18next'
import { ChatItem } from '../ChatItem/ChatItem'
import { ChatFormModal } from '../ChatFormModal/ChatFormModal'
import { Icon } from '@/shared/ui/redesigned/Icon'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { useChatsPage } from '../../lib/hooks/useChatsPage'

export const ChatsList = memo(() => {
  const { t } = useTranslation('aichat')
  const {
    data,
    isLoading,
    isError,
    search,
    isFormOpen,
    editingChat,
    onChangeSearch,
    onRefetch,
    onOpenCreate,
    onOpenEdit,
    onCloseForm
  } = useChatsPage()

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
    <VStack gap="16" max className={cls.ChatsList}>
      <ChatsListHeader
        search={search}
        onChangeSearch={onChangeSearch}
        onCreateClick={onOpenCreate}
      />

      {data?.length
        ? (
          <div className={cls.listWrapper}>
            {data.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                onEdit={onOpenEdit}
              />
            ))}
          </div>
        )
        : !isLoading && (
          <VStack justify="center" align="center" max className={cls.emptyState} gap="16">
            <Icon Svg={SearchIcon} width={48} height={48} />
            <Text align="center" text={t('Чатов пока нет')} size="l" bold />
            <Text align="center" text={t('Создайте ваш первый AI-чат')} />
          </VStack>
        )}

      {isLoading && (
        <div className={cls.listWrapper}>
          {getSkeletons()}
        </div>
      )}

      <ChatFormModal
        isOpen={isFormOpen}
        editingChat={editingChat}
        onClose={onCloseForm}
      />
    </VStack>
  )
})

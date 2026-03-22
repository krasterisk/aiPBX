import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ChatItem.module.scss'
import React, { memo, useCallback } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Chat } from '../../model/types/chat'
import { getRouteChatDetail } from '@/shared/const/router'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Cpu, Wrench, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { useDeleteChat } from '../../api/chatApi'

interface ChatItemProps {
  className?: string
  chat: Chat
  onEdit?: (chat: Chat) => void
}

export const ChatItem = memo((props: ChatItemProps) => {
  const { className, chat, onEdit } = props

  const { t } = useTranslation('aichat')
  const navigate = useNavigate()
  const [deleteChat] = useDeleteChat()

  const onOpenChat = useCallback(() => {
    navigate(getRouteChatDetail(String(chat.id)))
  }, [chat.id, navigate])

  const onDeleteChat = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(t('Вы уверены? Чат будет удалён безвозвратно.'))) {
      await deleteChat(chat.id)
    }
  }, [chat.id, deleteChat, t])

  const onEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(chat)
  }, [chat, onEdit])

  return (
    <Card
      padding="0"
      max
      border="partial"
      variant="outlined"
      className={classNames(cls.ChatItem, {}, [className])}
      onClick={onOpenChat}
    >
      <VStack className={cls.content} max gap="12">
        <HStack gap="16" max align="center">
          <div className={cls.avatar}>
            <MessageCircle size={24} />
          </div>
          <VStack max gap="4">
            <Text title={chat.name} size="m" bold className={cls.title} />
          </VStack>
        </HStack>

        <div className={cls.divider} />

        <VStack gap="16" max className={cls.details}>
          <HStack gap="16" wrap="wrap">
            <HStack gap="8" align="center">
              <div className={cls.detailIcon}>
                <Cpu size={14} />
              </div>
              <Text text={chat.model} size="s" />
            </HStack>
            {chat.tools && chat.tools.length > 0 && (
              <HStack gap="8" align="center">
                <div className={cls.detailIcon}>
                  <Wrench size={14} />
                </div>
                <Text
                  text={`${chat.tools.length} ${t('инструментов')}`}
                  size="s"
                />
              </HStack>
            )}
          </HStack>
        </VStack>

        <HStack justify="between" align="center" max className={cls.footer}>
          <HStack gap="8">
            <Button variant="glass-action" size="s" onClick={onEditClick}>
              {t('Настройки')}
            </Button>
            <Button variant="glass-action" color="error" size="s" onClick={onDeleteChat}>
              {t('Удалить')}
            </Button>
          </HStack>
          <HStack gap="4" align="center">
            <Text text={t('Открыть')} size="xs" variant="accent" className={cls.editLabel} />
            <ChevronRight size={14} className={cls.arrowIcon} />
          </HStack>
        </HStack>
      </VStack>
    </Card>
  )
})

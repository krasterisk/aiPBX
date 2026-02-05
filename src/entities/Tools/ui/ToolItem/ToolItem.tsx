import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolItem.module.scss'
import React, { memo, useCallback } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Tool } from '../../model/types/tools'
import { getRouteToolsEdit } from '@/shared/const/router'
import { useNavigate } from 'react-router-dom'
import { Settings, FileCode, MessageSquare, ChevronRight, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { isUserAdmin } from '@/entities/User'

interface ToolItemProps {
  className?: string
  tool: Tool
}

export const ToolItem = memo((props: ToolItemProps) => {
  const {
    className,
    tool,
  } = props

  const { t } = useTranslation('tools')
  const navigate = useNavigate()
  const isAdmin = useSelector(isUserAdmin)

  const onOpenEdit = useCallback(() => {
    if (tool.id) {
      navigate(getRouteToolsEdit(tool.id))
    }
  }, [tool.id, navigate])

  return (
    <Card
      padding="0"
      max
      border="partial"
      variant="outlined"
      className={classNames(cls.ToolItem, {}, [className])}
      onClick={onOpenEdit}
    >
      <VStack className={cls.content} max gap="12">
        <HStack max justify="end" align="center">
          <HStack gap="8">
            <Text
              text={tool.type === 'function' ? t('Вызов функции') : t('MCP сервер')}
              size="xs"
              bold
              variant="accent"
              className={cls.chip}
            />
            {tool.webhook && (
              <Text
                text={t('Вебхук')}
                size="xs"
                bold
                variant="accent"
                className={cls.chip}
              />
            )}
          </HStack>
        </HStack>

        <HStack gap="16" max align="center">
          <div className={cls.avatar}>
            <Settings size={24} />
          </div>
          <VStack max gap="4">
            <Text title={tool.name} size="m" bold className={cls.title} />
            {isAdmin && tool.user && (
              <HStack gap="4" align="center">
                <User size={16} className={cls.subIcon} />
                <Text text={tool.user.name} size="s" bold className={cls.subtitle} />
              </HStack>
            )}
          </VStack>
        </HStack>

        <div className={cls.divider} />

        <VStack gap="16" max className={cls.details}>
          <HStack gap="12" align="start">
            <div className={cls.detailIcon}>
              <FileCode size={14} />
            </div>
            <VStack max>
              <Text text={t('Описание')} variant="accent" size="xs" />
              <Text
                text={tool.description || t('Нет описания')}
                className={cls.detailText}
              />
            </VStack>
          </HStack>

          {tool.comment && (
            <HStack gap="12" align="start">
              <div className={cls.detailIcon}>
                <MessageSquare size={14} />
              </div>
              <VStack max>
                <Text text={t('Комментарий')} variant="accent" size="xs" />
                <Text text={tool.comment} className={cls.detailText} />
              </VStack>
            </HStack>
          )}
        </VStack>

        <HStack justify="end" align="center" max className={cls.footer}>
          <Text text={t('Редактировать')} size="xs" variant="accent" className={cls.editLabel} />
          <ChevronRight size={14} className={cls.arrowIcon} />
        </HStack>
      </VStack>
    </Card>
  )
})

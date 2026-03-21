import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './KnowledgeBaseItem.module.scss'
import React, { memo, useCallback } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { KnowledgeBase } from '../../model/types/knowledgeBase'
import { getRouteKnowledgeBaseDetail } from '@/shared/const/router'
import { useNavigate } from 'react-router-dom'
import { BookOpen, FileText, Puzzle, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface KnowledgeBaseItemProps {
  className?: string
  knowledgeBase: KnowledgeBase
}

export const KnowledgeBaseItem = memo((props: KnowledgeBaseItemProps) => {
  const { className, knowledgeBase } = props

  const { t } = useTranslation('knowledgeBases')
  const navigate = useNavigate()

  const onOpenDetail = useCallback(() => {
    navigate(getRouteKnowledgeBaseDetail(String(knowledgeBase.id)))
  }, [knowledgeBase.id, navigate])

  return (
    <Card
      padding="0"
      max
      border="partial"
      variant="outlined"
      className={classNames(cls.KnowledgeBaseItem, {}, [className])}
      onClick={onOpenDetail}
    >
      <VStack className={cls.content} max gap="12">
        <HStack gap="16" max align="center">
          <div className={cls.avatar}>
            <BookOpen size={24} />
          </div>
          <VStack max gap="4">
            <Text title={knowledgeBase.name} size="m" bold className={cls.title} />
          </VStack>
        </HStack>

        <div className={cls.divider} />

        <VStack gap="16" max className={cls.details}>
          {knowledgeBase.description && (
            <HStack gap="12" align="start">
              <div className={cls.detailIcon}>
                <FileText size={14} />
              </div>
              <VStack max>
                <Text text={t('Описание')} variant="accent" size="xs" />
                <Text
                  text={knowledgeBase.description}
                  className={cls.detailText}
                />
              </VStack>
            </HStack>
          )}

          <HStack gap="16" wrap="wrap">
            <HStack gap="8" align="center">
              <div className={cls.detailIcon}>
                <FileText size={14} />
              </div>
              <Text
                text={`${knowledgeBase.documentsCount} ${t('документов')}`}
                size="s"
              />
            </HStack>
            <HStack gap="8" align="center">
              <div className={cls.detailIcon}>
                <Puzzle size={14} />
              </div>
              <Text
                text={`${knowledgeBase.chunksCount} ${t('чанков')}`}
                size="s"
              />
            </HStack>
          </HStack>
        </VStack>

        <HStack justify="end" align="center" max className={cls.footer}>
          <Text text={t('Открыть')} size="xs" variant="accent" className={cls.editLabel} />
          <ChevronRight size={14} className={cls.arrowIcon} />
        </HStack>
      </VStack>
    </Card>
  )
})

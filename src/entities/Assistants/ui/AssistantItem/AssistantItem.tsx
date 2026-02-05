import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useCallback } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Assistant } from '../../model/types/assistants'
import { getRouteAssistantEdit } from '@/shared/const/router'
import { ContentView } from '@/entities/Content'
import { useNavigate } from 'react-router-dom'
import { Bot, Mic, Cpu, Wrench, Terminal } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

interface AssistantItemProps {
    className?: string
    assistant: Assistant
    onEdit?: (id: string) => void
    view?: ContentView
    target?: HTMLAttributeAnchorTarget
}

export const AssistantItem = memo((props: AssistantItemProps) => {
    const {
        className,
        assistant,
        view = 'SMALL',
    } = props

    const { t } = useTranslation('assistants')
    const navigate = useNavigate()

    const onCopy = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (assistant.uniqueId) {
            navigator.clipboard.writeText(assistant.uniqueId)
            toast.success(t('Скопировано в буфер обмена'))
        }
    }, [assistant.uniqueId, t])

    const onOpenEdit = useCallback(() => {
        navigate(getRouteAssistantEdit(assistant.id || ''))
    }, [assistant.id, navigate])

    return (
        <Card
            padding={'0'}
            max
            border={'partial'}
            variant={'outlined'}
            className={classNames(cls.AssistantItem, {}, [className, cls[view]])}
            onClick={onOpenEdit}
        >
            <VStack className={cls.content} max>
                <HStack gap={'16'} justify={'between'} max align="start">
                    <HStack gap={'16'} max>
                        <div className={cls.avatar}>
                            <Bot size={24} />
                        </div>
                        <VStack max gap="4">
                            <Text title={assistant.name} size={'m'} bold className={cls.title} />
                            <Text text={assistant.model || 'gpt-4o'} size="xs" variant="accent" />
                        </VStack>
                    </HStack>
                </HStack>

                <div className={cls.divider} />

                <div className={cls.detailsGrid}>
                    <HStack gap="12" align="center">
                        <div className={cls.detailIcon}>
                            <Cpu size={14} />
                        </div>
                        <VStack>
                            <Text text={t('Модель')} variant="accent" size="xs" />
                            <Text text={assistant.model || ''} className={cls.truncatedText} />
                        </VStack>
                    </HStack>

                    <HStack gap="12" align="center">
                        <div className={cls.detailIcon}>
                            <Mic size={14} />
                        </div>
                        <VStack>
                            <Text text={t('Голос')} variant="accent" size="xs" />
                            <Text text={assistant.voice || t('По умолчанию')} className={cls.truncatedText} />
                        </VStack>
                    </HStack>

                    <HStack gap="12" align="center">
                        <div className={cls.detailIcon}>
                            <Wrench size={14} />
                        </div>
                        <VStack>
                            <Text text={t('Инструменты')} variant="accent" size="xs" />
                            <Text text={assistant.tools?.length ? String(assistant.tools.length) : '0'} className={cls.truncatedText} />
                        </VStack>
                    </HStack>
                </div>

                {assistant.comment && (
                    <VStack gap="4" className={cls.commentSection}>
                        <Text text={assistant.comment} size="xs" className={cls.comment} />
                    </VStack>
                )}

                <HStack className={cls.footer} justify={'end'} max align="center">
                    <Button
                        variant={'clear'}
                        onClick={onCopy}
                        addonLeft={<ContentCopyIcon sx={{ fontSize: 18 }} />}
                        className={cls.copyBtn}
                        size={'s'}
                    >
                        {t('Скопировать ID')}
                    </Button>
                </HStack>
            </VStack>
        </Card>
    )
})

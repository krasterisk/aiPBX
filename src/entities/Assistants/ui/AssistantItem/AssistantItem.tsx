import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantItem.module.scss'
import React, { HTMLAttributeAnchorTarget, memo, useCallback, useMemo } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Assistant } from '../../model/types/assistants'
import { getRouteAssistantEdit } from '@/shared/const/router'
import { ContentView } from '@/entities/Content'
import { useNavigate } from 'react-router-dom'
import { Bot, Mic, Cpu, BarChart3, User } from 'lucide-react'
import { Button } from '@/shared/ui/redesigned/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { isUserAdmin } from '@/entities/User'
import PersonIcon from '@mui/icons-material/Person'
import { useGetAllModels } from '../../api/aiModelApi'

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
    const isAdmin = useSelector(isUserAdmin)
    const { data: models } = useGetAllModels(null)

    const displayModelName = useMemo(() => {
        if (!assistant.model) return ''
        const found = models?.find(m => m.name === assistant.model)
        return found?.publishName || found?.name || assistant.model
    }, [assistant.model, models])

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
                        <HStack className={cls.avatar} align="center" justify="center">
                            <Bot size={24} />
                        </HStack>
                        <VStack max gap="4">
                            <Text title={assistant.name} size={'m'} bold className={cls.title} />
                            {isAdmin && assistant.user?.name && (
                                <HStack gap="4" align="center">
                                    <User size={16} className={cls.subIcon} />
                                    <Text text={assistant.user.name} size="s" bold className={cls.subtitle} />
                                </HStack>
                            )}
                        </VStack>
                    </HStack>
                </HStack>

                <VStack gap="12" max className={cls.detailsGrid}>
                    <HStack gap="12" align="center">
                        <HStack className={cls.detailIcon} align="center" justify="center">
                            <Cpu size={14} />
                        </HStack>
                        <VStack>
                            <Text text={t('Модель')} variant="accent" size="xs" />
                            <Text text={displayModelName} className={cls.truncatedText} />
                        </VStack>
                    </HStack>

                    <HStack gap="12" align="center">
                        <HStack className={cls.detailIcon} align="center" justify="center">
                            <Mic size={14} />
                        </HStack>
                        <VStack>
                            <Text text={t('Голос')} variant="accent" size="xs" />
                            <Text text={assistant.voice || t('По умолчанию')} className={cls.truncatedText} />
                        </VStack>
                    </HStack>

                    <HStack gap="12" align="center">
                        <HStack className={cls.detailIcon} align="center" justify="center">
                            <BarChart3 size={14} />
                        </HStack>
                        <VStack>
                            <Text text={t('Аналитика разговора')} variant="accent" size="xs" />
                            <Text text={assistant.analytic ? t('Да') : t('Нет')} className={cls.truncatedText} />
                        </VStack>
                    </HStack>
                </VStack>

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

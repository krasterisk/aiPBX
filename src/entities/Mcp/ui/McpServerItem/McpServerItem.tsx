import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpServerItem.module.scss'
import React, { memo, useCallback, useMemo } from 'react'
import { Text } from '@/shared/ui/redesigned/Text'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { McpServer } from '../../model/types/mcpTypes'
import { mcpServerTemplates } from '../../model/const/mcpServerTemplates'
import { getRouteMcpServerEdit } from '@/shared/const/router'
import { useNavigate } from 'react-router-dom'
import { Server, Wrench, ChevronRight, User, Wifi, Boxes } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { isUserAdmin } from '@/entities/User'
import { useGetMcpServerTools } from '../../api/mcpApi'

interface McpServerItemProps {
    className?: string
    server: McpServer
}

export const McpServerItem = memo((props: McpServerItemProps) => {
    const {
        className,
        server,
    } = props

    const { t } = useTranslation('tools')
    const navigate = useNavigate()
    const isAdmin = useSelector(isUserAdmin)

    const { data: tools } = useGetMcpServerTools(server.id, {
        skip: server.status !== 'active',
    })
    const toolCount = tools?.length ?? 0
    const enabledCount = tools?.filter(t => t.isEnabled).length ?? 0

    const isComposio = !!server.composioToolkit

    // Find matching template for Composio icon
    const composioTemplate = useMemo(() => {
        if (!isComposio) return null
        return mcpServerTemplates.find(t => t.toolkit === server.composioToolkit) ?? null
    }, [isComposio, server.composioToolkit])

    const onOpenEdit = useCallback(() => {
        navigate(getRouteMcpServerEdit(String(server.id)))
    }, [server.id, navigate])

    const statusDotClass = server.status === 'active'
        ? cls.statusActive
        : server.status === 'error'
            ? cls.statusError
            : cls.statusInactive

    const statusLabel = server.status === 'active'
        ? t('Подключён')
        : server.status === 'error'
            ? t('Ошибка')
            : t('Отключён')

    return (
        <Card
            padding="0"
            max
            border="partial"
            variant="outlined"
            className={classNames(cls.McpServerItem, {}, [className])}
            onClick={onOpenEdit}
        >
            <VStack className={cls.content} max gap="12">
                <HStack max justify="end" align="center">
                    <HStack gap="8">
                        {isComposio && (
                            <HStack align="center" className={cls.composioBadge}>
                                <Boxes size={12} />
                                <Text
                                    text={t('Интеграция')}
                                    size="xs"
                                    bold
                                />
                            </HStack>
                        )}
                        <HStack align="center" className={cls.statusChip}>
                            <div className={classNames(cls.statusDot, {}, [statusDotClass])} />
                            <Text
                                text={statusLabel || ''}
                                size="xs"
                                bold
                                variant="accent"
                            />
                        </HStack>
                        {!isComposio && (
                            <Text
                                text={server.transport === 'http' ? 'HTTP (SSE)' : 'WebSocket'}
                                size="xs"
                                bold
                                variant="accent"
                                className={cls.chip}
                            />
                        )}
                    </HStack>
                </HStack>

                <HStack gap="16" max align="center">
                    <div className={classNames(cls.avatar, { [cls.composioAvatar]: isComposio })}>
                        {composioTemplate
                            ? <composioTemplate.Icon size={24} />
                            : <Server size={24} />
                        }
                    </div>
                    <VStack max gap="4">
                        <Text title={server.name} size="m" bold className={cls.title} />
                        {isAdmin && server.user && (
                            <HStack gap="4" align="center">
                                <User size={16} className={cls.subIcon} />
                                <Text text={server.user.name || server.user.email || ''} size="s" bold className={cls.subtitle} />
                            </HStack>
                        )}
                    </VStack>
                </HStack>

                <div className={cls.divider} />

                <VStack gap="16" max className={cls.details}>
                    <HStack gap="12" align="start">
                        <div className={cls.detailIcon}>
                            <Wrench size={14} />
                        </div>
                        <VStack max>
                            <Text text={t('Инструменты сервера') || ''} variant="accent" size="xs" />
                            <Text
                                text={server.status === 'active'
                                    ? t('tools_active_total', { active: enabledCount, total: toolCount })
                                    : t('Отключён')
                                }
                                className={cls.detailText}
                            />
                        </VStack>
                    </HStack>

                    {server.lastConnectedAt && (
                        <HStack gap="12" align="start">
                            <Wifi size={14} className={cls.detailIcon} />
                            <VStack max>
                                <Text text={t('Последнее подключение') || ''} variant="accent" size="xs" />
                                <Text
                                    text={new Date(server.lastConnectedAt).toLocaleString()}
                                    className={cls.detailText}
                                />
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

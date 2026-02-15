import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Boxes, RefreshCw } from 'lucide-react'
import { McpServer, mcpServerTemplates } from '@/entities/Mcp'
import { isUserAdmin } from '@/entities/User'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ComposioInfoCard.module.scss'

interface ComposioInfoCardProps {
    className?: string
    server: McpServer
    isSyncing?: boolean
    onResync?: () => void

}

export const ComposioInfoCard = memo((props: ComposioInfoCardProps) => {
    const { className, server, isSyncing, onResync } = props
    const { t } = useTranslation('tools')
    const isAdmin = useSelector(isUserAdmin)

    const composioTemplate = mcpServerTemplates.find(
        tmpl => tmpl.toolkit === server.composioToolkit,
    ) ?? null

    return (
        <Card max padding="24" border="partial" className={classNames(cls.ComposioInfoCard, {}, [className])}>
            <VStack gap="16" max>
                <HStack gap="12" align="center">
                    <HStack align="center" className={cls.composioBadgeLg}>
                        <Boxes size={18} />
                        <Text text={t('Интеграция')} size="s" bold />
                    </HStack>
                </HStack>

                <VStack gap="8" max>
                    <HStack gap="8" max>
                        <Text text={t('Наименование') + ':'} size="s" bold className={cls.labelInline} />
                        <Text text={server.name} size="s" />
                    </HStack>

                    {composioTemplate && (
                        <HStack gap="8" max>
                            <Text text={t('composio_service') + ':'} size="s" bold className={cls.labelInline} />
                            <HStack gap="4" align="center">
                                <composioTemplate.Icon size={16} />
                                <Text text={t(composioTemplate.nameKey)} size="s" />
                            </HStack>
                        </HStack>
                    )}

                    {isAdmin && server.composioAccountId && (
                        <HStack gap="8" max>
                            <Text text={t('composio_account_id') + ':'} size="s" bold className={cls.labelInline} />
                            <Text text={server.composioAccountId} size="s" className={cls.monoText} />
                        </HStack>
                    )}

                    {server.createdAt && (
                        <HStack gap="8" max>
                            <Text text={t('composio_connected_at') + ':'} size="s" bold className={cls.labelInline} />
                            <Text text={new Date(server.createdAt).toLocaleString()} size="s" />
                        </HStack>
                    )}
                </VStack>

                <Text
                    text={t('composio_readonly_info')}
                    size="s"
                    className={cls.readonlyHint}
                />

                <HStack max justify="end">
                    <Button
                        variant="glass-action"
                        onClick={onResync}
                        disabled={isSyncing || server.status !== 'active'}
                    >
                        <HStack gap="4" align="center">
                            <RefreshCw size={14} className={isSyncing ? cls.spinner : ''} />
                            {t('composio_resync')}
                        </HStack>
                    </Button>
                </HStack>
            </VStack>
        </Card>
    )
})

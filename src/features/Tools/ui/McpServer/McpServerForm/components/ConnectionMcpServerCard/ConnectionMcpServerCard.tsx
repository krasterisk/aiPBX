import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Tooltip } from '@mui/material'
import { Info, CheckCircle, AlertCircle } from 'lucide-react'
import { McpServer } from '@/entities/Mcp'
import { ConnectButton } from '../../../ConnectButton/ConnectButton'
import { SyncToolsButton } from '../../../SyncToolsButton/SyncToolsButton'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ConnectionMcpServerCard.module.scss'

interface ConnectionMcpServerCardProps {
    className?: string
    server?: McpServer | null
    url?: string
}

export const ConnectionMcpServerCard = memo((props: ConnectionMcpServerCardProps) => {
    const { className, server, url } = props
    const { t } = useTranslation('tools')

    const isComposio = !!server?.composioToolkit
    const hasServer = !!server

    return (
        <Card
            max
            padding="24"
            border="partial"
            className={classNames(cls.ConnectionMcpServerCard, {}, [className])}
        >
            <VStack gap="16" max align="start">
                <HStack gap="4" align="center">
                    <Text text={t('Подключение') || ''} size="s" bold className={cls.label} />
                    <Tooltip
                        title={t('mcpConnectionTooltip')}
                        arrow
                        placement="top"
                        enterTouchDelay={0}
                        leaveTouchDelay={3000}
                        slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                    >
                        <span className={cls.tooltipIcon}><Info size={16} /></span>
                    </Tooltip>
                </HStack>

                {hasServer && isComposio ? (
                    /* Composio servers: show status only, no connect/sync buttons */
                    <HStack gap="8" align="center">
                        {server.status === 'active' ? (
                            <>
                                <CheckCircle size={16} className={cls.composioStatusOk} />
                                <Text
                                    text={t('composio_connected')}
                                    size="s"
                                    className={cls.composioStatusOk}
                                />
                            </>
                        ) : (
                            <>
                                <AlertCircle size={16} className={cls.composioStatusErr} />
                                <Text
                                    text={server.lastError || t('Отключён')}
                                    size="s"
                                    className={cls.composioStatusErr}
                                />
                            </>
                        )}
                    </HStack>
                ) : hasServer ? (
                    /* Regular MCP servers (edit mode): connect + sync buttons */
                    <HStack gap="12" align="center" max>
                        <ConnectButton server={server} />
                        <SyncToolsButton
                            serverId={server.id}
                            disabled={server.status !== 'active'}
                        />
                    </HStack>
                ) : (
                    /* Create mode: show placeholder status */
                    <HStack gap="8" align="center">
                        <div className={classNames(cls.statusDot, {}, [cls.inactive])} />
                        <Text
                            text={t('Отключён')}
                            size="s"
                        />
                        <Button
                            variant="glass-action"
                            size="s"
                            disabled={!url?.trim()}
                        >
                            {t('Подключить')}
                        </Button>
                    </HStack>
                )}

                {hasServer && !isComposio && server.lastError && server.status === 'error' && (
                    <Text text={server.lastError} size="s" className={cls.errorText} />
                )}
            </VStack>
        </Card>
    )
})

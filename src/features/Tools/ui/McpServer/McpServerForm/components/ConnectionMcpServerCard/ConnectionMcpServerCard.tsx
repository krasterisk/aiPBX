import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Tooltip } from '@mui/material'
import { Info } from 'lucide-react'
import { McpServer } from '@/entities/Mcp'
import { ConnectButton } from '../../../ConnectButton/ConnectButton'
import { SyncToolsButton } from '../../../SyncToolsButton/SyncToolsButton'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ConnectionMcpServerCard.module.scss'

interface ConnectionMcpServerCardProps {
    className?: string
    server: McpServer
}

export const ConnectionMcpServerCard = memo((props: ConnectionMcpServerCardProps) => {
    const { className, server } = props
    const { t } = useTranslation('tools')

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

                <HStack gap="12" align="center" max>
                    <ConnectButton server={server} />
                    <SyncToolsButton
                        serverId={server.id}
                        disabled={server.status !== 'active'}
                    />
                </HStack>

                {server.lastError && server.status === 'error' && (
                    <Text text={server.lastError} size="s" className={cls.errorText} />
                )}
            </VStack>
        </Card>
    )
})

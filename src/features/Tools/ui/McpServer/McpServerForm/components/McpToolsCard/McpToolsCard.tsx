import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Tooltip } from '@mui/material'
import { Info } from 'lucide-react'
import { McpTool } from '@/entities/Mcp'
import { McpToolsList } from '../../../McpToolsList/McpToolsList'
import { McpToolDetails } from '../../../McpToolDetails/McpToolDetails'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpToolsCard.module.scss'

interface McpToolsCardProps {
    className?: string
    serverId: number
    serverStatus?: string
}

export const McpToolsCard = memo((props: McpToolsCardProps) => {
    const { className, serverId, serverStatus } = props
    const { t } = useTranslation('tools')

    const [selectedTool, setSelectedTool] = useState<McpTool | null>(null)

    const onSelectTool = useCallback((tool: McpTool) => {
        setSelectedTool(prev => prev?.id === tool.id ? null : tool)
    }, [])

    return (
        <Card
            max
            padding="24"
            border="partial"
            className={classNames(cls.McpToolsCard, {}, [className])}
        >
            <VStack gap="24" max align="start">
                <HStack gap="4" align="center">
                    <Text text={t('Инструменты сервера') || ''} size="s" bold className={cls.label} />
                    <Tooltip
                        title={t('mcpToolsCardTooltip')}
                        arrow
                        placement="top"
                        enterTouchDelay={0}
                        leaveTouchDelay={3000}
                        slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                    >
                        <span className={cls.tooltipIcon}><Info size={16} /></span>
                    </Tooltip>
                </HStack>

                {/* Tools list */}
                <McpToolsList
                    serverId={serverId}
                    selectedToolId={selectedTool?.id}
                    onSelectTool={onSelectTool}
                    className={cls.fullWidth}
                />

                {/* Selected tool details */}
                {selectedTool && (
                    <VStack gap="16" max className={cls.detailsSection}>
                        <div className={cls.divider} />
                        <McpToolDetails tool={selectedTool} />
                    </VStack>
                )}
            </VStack>
        </Card>
    )
})

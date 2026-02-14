import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Tooltip } from '@mui/material'
import { Info } from 'lucide-react'
import { McpTool } from '@/entities/Mcp'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpToolDetails.module.scss'
import { McpPolicyManager } from '../McpPolicyManager/McpPolicyManager'
import { McpToolPreview } from '../McpToolPreview/McpToolPreview'

interface McpToolDetailsProps {
    className?: string
    tool: McpTool
}

export const McpToolDetails = memo((props: McpToolDetailsProps) => {
    const { className, tool } = props
    const { t } = useTranslation('tools')

    return (
        <VStack gap="16" max className={classNames(cls.McpToolDetails, {}, [className])}>
            {/* Header */}
            <VStack gap="4" max>
                <Text title={tool.name} size="s" bold />
                {tool.description && (
                    <Text text={tool.description} size="s" className={cls.label} />
                )}
            </VStack>

            {/* Status & Meta */}
            <VStack gap="4" max>
                <HStack gap="4" align="center">
                    <Text
                        text={`${t('Статус')}: ${tool.isEnabled ? t('Включён') : t('Отключён')}`}
                        size="s"
                        className={tool.isEnabled ? cls.statusEnabled : cls.statusDisabled}
                    />
                    <Tooltip
                        title={t('mcpToolStatusTooltip')}
                        arrow
                        placement="top"
                        enterTouchDelay={0}
                        leaveTouchDelay={3000}
                        slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                    >
                        <span className={cls.tooltipIcon}><Info size={16} /></span>
                    </Tooltip>
                </HStack>
                {tool.lastSyncedAt && (
                    <Text
                        text={`${t('Последняя синхронизация')}: ${new Date(tool.lastSyncedAt).toLocaleString()}`}
                        size="s"
                        className={cls.metaRow}
                    />
                )}
            </VStack>

            {/* Input Schema */}
            {tool.inputSchema && Object.keys(tool.inputSchema).length > 0 && (
                <VStack gap="8" max>
                    <HStack gap="4" align="center">
                        <Text text={t('Input Schema') || ''} size="s" bold className={cls.label} />
                        <Tooltip
                            title={t('mcpInputSchemaTooltip')}
                            arrow
                            placement="top"
                            enterTouchDelay={0}
                            leaveTouchDelay={3000}
                            slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                        >
                            <span className={cls.tooltipIcon}><Info size={16} /></span>
                        </Tooltip>
                    </HStack>
                    <Textarea
                        multiline
                        value={JSON.stringify(tool.inputSchema, null, 2)}
                        InputProps={{ readOnly: true }}
                        className={cls.schemaBlock}
                    />
                </VStack>
            )}

            <div className={cls.sectionDivider} />

            {/* Policy Manager */}
            <McpPolicyManager toolId={tool.id} />

            <div className={cls.sectionDivider} />

            {/* OpenAI Preview */}
            <McpToolPreview tool={tool} />
        </VStack>
    )
})

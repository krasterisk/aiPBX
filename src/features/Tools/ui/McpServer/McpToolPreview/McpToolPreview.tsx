import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Tooltip } from '@mui/material'
import { Info } from 'lucide-react'
import { McpTool } from '@/entities/Mcp'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpToolPreview.module.scss'

interface McpToolPreviewProps {
    className?: string
    tool: McpTool
}

export const McpToolPreview = memo((props: McpToolPreviewProps) => {
    const { className, tool } = props
    const { t } = useTranslation('tools')

    const openAiFormat = useMemo(() => {
        const functionDef: Record<string, any> = {
            type: 'function',
            function: {
                name: tool.name,
                ...(tool.description ? { description: tool.description } : {}),
                ...(tool.inputSchema ? { parameters: tool.inputSchema } : {}),
            },
        }
        return JSON.stringify(functionDef, null, 2)
    }, [tool])

    return (
        <VStack gap="8" max className={classNames(cls.McpToolPreview, {}, [className])}>
            <HStack gap="4" align="center">
                <Text text={t('Model Function Preview') || ''} size="s" bold className={cls.label} />
                <Tooltip
                    title={t('mcpFunctionPreviewTooltip')}
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
                value={openAiFormat}
                InputProps={{ readOnly: true }}
                className={cls.previewBlock}
            />
        </VStack>
    )
})

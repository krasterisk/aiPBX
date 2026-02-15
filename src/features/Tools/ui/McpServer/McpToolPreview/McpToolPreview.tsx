import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { ChevronRight } from 'lucide-react'
import { McpTool } from '@/entities/Mcp'
import { isUserAdmin } from '@/entities/User'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpToolPreview.module.scss'

interface McpToolPreviewProps {
    className?: string
    tool: McpTool
}

export const McpToolPreview = memo((props: McpToolPreviewProps) => {
    const { className, tool } = props
    const { t } = useTranslation('tools')
    const isAdmin = useSelector(isUserAdmin)
    const [expanded, setExpanded] = useState(false)

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

    if (!isAdmin) return null

    return (
        <VStack gap="0" max className={classNames(cls.McpToolPreview, {}, [className])}>
            <button
                type="button"
                className={cls.collapseToggle}
                onClick={() => setExpanded(prev => !prev)}
            >
                <ChevronRight
                    size={14}
                    className={classNames(cls.chevron, { [cls.chevronOpen]: expanded })}
                />
                <span className={cls.toggleLabel}>
                    {t('Model Function Preview')}
                </span>
            </button>

            {expanded && (
                <Textarea
                    multiline
                    value={openAiFormat}
                    InputProps={{ readOnly: true }}
                    className={cls.previewBlock}
                />
            )}
        </VStack>
    )
})

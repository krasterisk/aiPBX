import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { McpTool, useGetMcpServerTools, useToggleMcpTool } from '@/entities/Mcp'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpToolsList.module.scss'

interface McpToolsListProps {
    className?: string
    serverId: number
    selectedToolId?: number | null
    onSelectTool?: (tool: McpTool) => void
}

export const McpToolsList = memo((props: McpToolsListProps) => {
    const { className, serverId, selectedToolId, onSelectTool } = props
    const { t } = useTranslation('tools')

    const { data: tools, isLoading } = useGetMcpServerTools(serverId)
    const [toggleTool] = useToggleMcpTool()
    const [filter, setFilter] = useState('')

    const filteredTools = useMemo(() => {
        if (!tools) return []
        if (!filter.trim()) return tools
        const lower = filter.toLowerCase()
        return tools.filter(tool =>
            tool.name.toLowerCase().includes(lower) ||
            tool.description?.toLowerCase().includes(lower)
        )
    }, [tools, filter])

    const onToggle = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, tool: McpTool) => {
        e.stopPropagation()
        try {
            await toggleTool(tool.id).unwrap()
        } catch (err) {
            toast.error(getErrorMessage(err))
        }
    }, [toggleTool])

    if (isLoading) {
        return (
            <VStack gap="8" max className={className}>
                <Text text={t('Загрузка tools...')} size="s" className={cls.label} />
            </VStack>
        )
    }

    if (!tools || tools.length === 0) {
        return (
            <VStack gap="8" max className={className}>
                <Text
                    text={t('Нет синхронизированных tools')}
                    size="s"
                    className={cls.emptyState}
                />
            </VStack>
        )
    }

    return (
        <VStack gap="12" max className={classNames(cls.McpToolsList, {}, [className])}>

            {/* Filter */}
            {tools.length > 5 && (
                <Textarea
                    placeholder={t('Поиск tools...') ?? ''}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={cls.searchInput}
                    size="small"
                />
            )}

            {/* Tools list */}
            {filteredTools.map(tool => (
                <HStack
                    key={tool.id}
                    max
                    align="center"
                    gap="12"
                    className={classNames(cls.toolItem, {
                        [cls.toolItemActive]: selectedToolId === tool.id,
                    })}
                    onClick={() => onSelectTool?.(tool)}
                >
                    <VStack gap="4" max>
                        <Text text={tool.name} size="s" className={cls.toolName} />
                        {tool.description && (
                            <Text text={tool.description} size="s" className={cls.toolDescription} />
                        )}
                    </VStack>
                    <Check
                        checked={tool.isEnabled}
                        onChange={(e) => onToggle(e, tool)}
                        className={cls.toggleSwitch}
                    />
                </HStack>
            ))}
        </VStack>
    )
})

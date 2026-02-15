import { memo, useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { X, Play, Hash, Type, ToggleLeft, List, Braces, Star } from 'lucide-react'
import { McpTool } from '@/entities/Mcp'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpToolDetails.module.scss'
import { McpPolicyManager } from '../McpPolicyManager/McpPolicyManager'
import { McpToolPreview } from '../McpToolPreview/McpToolPreview'
import { ComposioTestModal } from '../ComposioTestModal/ComposioTestModal'

interface McpToolDetailsProps {
    className?: string
    tool: McpTool
    onClose?: () => void
}

/** Map JSON Schema type to an icon + label */
function getTypeIcon(type?: string) {
    switch (type) {
        case 'string': return { Icon: Type, label: 'string' }
        case 'number':
        case 'integer': return { Icon: Hash, label: type }
        case 'boolean': return { Icon: ToggleLeft, label: 'boolean' }
        case 'array': return { Icon: List, label: 'array' }
        case 'object': return { Icon: Braces, label: 'object' }
        default: return { Icon: Braces, label: type || 'any' }
    }
}

/** Extract parameters from inputSchema.properties */
function extractParams(schema: Record<string, any> | undefined) {
    if (!schema) return []
    const props = schema.properties || schema
    const required: string[] = schema.required || []
    if (!props || typeof props !== 'object') return []

    return Object.entries(props)
        .filter(([key]) => key !== 'type' && key !== 'properties' && key !== 'required')
        .map(([name, def]: [string, any]) => ({
            name,
            type: def?.type,
            description: def?.description || '',
            required: required.includes(name),
            enum: def?.enum,
        }))
}

export const McpToolDetails = memo((props: McpToolDetailsProps) => {
    const { className, tool, onClose } = props
    const { t } = useTranslation('tools')
    const [testModalOpen, setTestModalOpen] = useState(false)

    const isComposioTool = tool.name.startsWith('composio_')

    const onOpenTest = useCallback(() => setTestModalOpen(true), [])
    const onCloseTest = useCallback(() => setTestModalOpen(false), [])

    const params = useMemo(() => extractParams(tool.inputSchema ?? undefined), [tool.inputSchema])

    return (
        <VStack gap="16" max className={classNames(cls.McpToolDetails, {}, [className])}>
            {/* Close button */}
            {onClose && (
                <button
                    type="button"
                    className={cls.closeBtn}
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X size={18} />
                </button>
            )}

            {/* Header */}
            <VStack gap="4" max>
                <HStack gap="8" align="center" max justify="between">
                    <Text title={tool.name} size="s" bold className={cls.toolTitle} />
                    {isComposioTool && (
                        <Button
                            variant="outline"
                            size="s"
                            onClick={onOpenTest}
                            className={cls.testBtn}
                        >
                            <HStack gap="4" align="center">
                                <Play size={12} />
                                {t('composio_test')}
                            </HStack>
                        </Button>
                    )}
                </HStack>
                {tool.description && (
                    <Text text={tool.description} size="s" className={cls.description} />
                )}
            </VStack>

            {/* Status & Meta */}
            <HStack gap="12" align="center" max>
                <span className={classNames(cls.statusDot, {
                    [cls.statusDotEnabled]: tool.isEnabled,
                })} />
                <Text
                    text={tool.isEnabled ? t('Включён') : t('Отключён')}
                    size="s"
                    className={cls.statusText}
                />
                {tool.lastSyncedAt && (
                    <Text
                        text={`${t('Синхронизировано')}: ${new Date(tool.lastSyncedAt).toLocaleDateString()}`}
                        size="s"
                        className={cls.metaText}
                    />
                )}
            </HStack>

            {/* Parameters as list */}
            {params.length > 0 && (
                <VStack gap="8" max>
                    <Text text={t('Параметры')} size="s" bold className={cls.sectionLabel} />
                    <div className={cls.paramsList}>
                        {params.map(param => {
                            const { Icon, label } = getTypeIcon(param.type)
                            return (
                                <div key={param.name} className={cls.paramItem}>
                                    <HStack gap="8" align="center" className={cls.paramHeader}>
                                        <Icon size={14} className={cls.paramTypeIcon} />
                                        <span className={cls.paramName}>{param.name}</span>
                                        <span className={cls.paramType}>{label}</span>
                                        {param.required && (
                                            <span className={cls.paramRequired}>
                                                <Star size={8} />
                                            </span>
                                        )}
                                    </HStack>
                                    {param.description && (
                                        <p className={cls.paramDesc}>{param.description}</p>
                                    )}
                                    {param.enum && (
                                        <p className={cls.paramEnum}>
                                            {param.enum.join(' | ')}
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </VStack>
            )}

            <div className={cls.sectionDivider} />

            {/* Policy Manager */}
            <McpPolicyManager toolId={tool.id} />

            <div className={cls.sectionDivider} />

            {/* OpenAI Preview */}
            <McpToolPreview tool={tool} />

            {/* Test Modal */}
            {isComposioTool && (
                <ComposioTestModal
                    open={testModalOpen}
                    onClose={onCloseTest}
                    tool={tool}
                />
            )}
        </VStack>
    )
})

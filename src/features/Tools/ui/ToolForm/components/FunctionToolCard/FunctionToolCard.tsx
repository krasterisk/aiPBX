import { ChangeEvent, memo, useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Tool } from '@/entities/Tools'
import { ToolAddParam } from '../../../ToolAddParam/ToolAddParam'
import { HeadersEditor } from '../../../HeadersEditor/HeadersEditor'
import { McpServerCard } from '../../../McpServer/McpServerCard/McpServerCard'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './FunctionToolCard.module.scss'
import { useKnowledgeBases } from '@/entities/KnowledgeBases'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRouteKnowledgeBases } from '@/shared/const/router'
import { BookOpen } from 'lucide-react'
import { Radio, RadioGroup, FormControlLabel } from '@mui/material'

interface FunctionToolCardProps {
    className?: string
    formFields?: Partial<Tool>
    onChangeField: (field: keyof Tool, value: any) => void
    isEdit?: boolean
}

const KB_TOOL_PARAMETERS = {
    type: 'object',
    properties: {
        query: {
            type: 'string',
            description: 'Поисковый запрос на основе вопроса клиента'
        }
    },
    required: ['query']
}

const isKnowledgeBaseTool = (formFields?: Partial<Tool>): boolean => {
    const toolData = typeof formFields?.toolData === 'string'
        ? JSON.parse(formFields.toolData)
        : formFields?.toolData
    return toolData?.handler === 'knowledge_base'
}

export const FunctionToolCard = memo((props: FunctionToolCardProps) => {
    const {
        className,
        formFields,
        onChangeField,
        isEdit
    } = props
    const { t } = useTranslation('tools')

    const [webhookActive, setWebhookActive] = useState<boolean>(!!formFields?.webhook)
    const [isKbMode, setIsKbMode] = useState<boolean>(isKnowledgeBaseTool(formFields))
    const [selectedKbIds, setSelectedKbIds] = useState<number[]>([])

    const { data: knowledgeBases } = useKnowledgeBases(undefined, {
        skip: !isKbMode && formFields?.type !== 'function'
    })

    useEffect(() => {
        setWebhookActive(!!formFields?.webhook)
    }, [formFields?.webhook])

    // Initialize KB mode and selected IDs from existing toolData
    useEffect(() => {
        const isKb = isKnowledgeBaseTool(formFields)
        setIsKbMode(isKb)
        if (isKb) {
            const toolData = typeof formFields?.toolData === 'string'
                ? JSON.parse(formFields.toolData)
                : formFields?.toolData
            setSelectedKbIds(toolData?.knowledgeBaseIds || [])
        }
    }, [formFields?.toolData])

    const methods = [
        { id: 'GET', name: 'GET' },
        { id: 'POST', name: 'POST' },
        { id: 'PUT', name: 'PUT' },
        { id: 'DELETE', name: 'DELETE' }
    ]

    const onWebhookToggle = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked
        setWebhookActive(checked)
        if (!checked) {
            onChangeField('webhook', '')
            onChangeField('method', 'POST')
            onChangeField('headers', {})
        }
    }, [onChangeField])

    const onHeadersChange = useCallback((headers: Record<string, string>) => {
        onChangeField('headers', headers)
    }, [onChangeField])

    const onHandlerChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const isKb = value === 'knowledge_base'
        setIsKbMode(isKb)
        if (isKb) {
            // Switch to KB mode: auto-fill parameters and toolData, clear webhook
            setWebhookActive(false)
            onChangeField('parameters', KB_TOOL_PARAMETERS)
            onChangeField('strict', true)
            onChangeField('webhook', null as any)
            onChangeField('method', null as any)
            onChangeField('headers', null as any)
            onChangeField('toolData', {
                handler: 'knowledge_base',
                knowledgeBaseIds: selectedKbIds
            })
        } else if (value === 'webhook') {
            // Switch to webhook mode
            setWebhookActive(true)
            onChangeField('toolData', null as any)
        }
    }, [onChangeField, selectedKbIds])

    const onToggleKb = useCallback((kbId: number) => {
        setSelectedKbIds(prev => {
            const next = prev.includes(kbId)
                ? prev.filter(id => id !== kbId)
                : [...prev, kbId]

            // Update toolData with new selection
            onChangeField('toolData', {
                handler: 'knowledge_base',
                knowledgeBaseIds: next
            })
            return next
        })
    }, [onChangeField])

    const isFunction = formFields?.type === 'function'
    const isMcp = formFields?.type === 'mcp'

    return (
        <Card
            max
            padding="24"
            border="partial"
            className={classNames(cls.FunctionToolCard, {}, [className])}
        >
            <VStack gap="24" max align="start">
                {/* 1. Tool Name */}
                <VStack gap="8" max>
                    <Text text={t('Наименование') || ''} size="s" bold className={cls.label} />
                    <Textarea
                        placeholder={t('Введите наименование') ?? ''}
                        onChange={(e) => { onChangeField('name', e.target.value) }}
                        value={formFields?.name || ''}
                        className={cls.fullWidth}
                    />
                </VStack>

                {/* 2. Description */}
                {isFunction && (
                    <VStack gap="8" max>
                        <Text text={t('Описание') || ''} size="s" bold className={cls.label} />
                        <Textarea
                            placeholder={t('Опишите назначение функции...') ?? ''}
                            multiline
                            minRows={3}
                            onChange={(e) => { onChangeField('description', e.target.value) }}
                            value={formFields?.description || ''}
                            className={cls.fullWidth}
                        />
                    </VStack>
                )}

                {/* 3. Strict mode (if function, not KB) */}
                {isFunction && !isKbMode && (
                    <Check
                        label={t('Строгий режим вызова') || ''}
                        checked={formFields?.strict}
                        onChange={(e) => { onChangeField('strict', e.target.checked) }}
                    />
                )}

                {/* 4. Parameters (if function, not KB) */}
                {isFunction && !isKbMode && (
                    <ToolAddParam isEdit={isEdit} toolName={formFields?.name} className={cls.fullWidth} />
                )}

                {/* 5. Handler mode radio (if function) — replaces old webhook checkbox */}
                {isFunction && (
                    <VStack gap="16" max>
                        <RadioGroup
                            row
                            value={isKbMode ? 'knowledge_base' : (webhookActive ? 'webhook' : '')}
                            onChange={onHandlerChange}
                        >
                            <FormControlLabel
                                value="webhook"
                                control={<Radio sx={{ color: 'var(--hint-redesigned)', '&.Mui-checked': { color: 'var(--accent-redesigned)' } }} />}
                                label={t('Вебхук')}
                                sx={{ color: 'var(--text-redesigned)' }}
                            />
                            <FormControlLabel
                                value="knowledge_base"
                                control={<Radio sx={{ color: 'var(--hint-redesigned)', '&.Mui-checked': { color: 'var(--accent-redesigned)' } }} />}
                                label={t('База знаний')}
                                sx={{ color: 'var(--text-redesigned)' }}
                            />
                        </RadioGroup>

                        {/* Webhook fields */}
                        {webhookActive && !isKbMode && (
                            <VStack gap="16" max className={cls.webhookContainer}>
                                <VStack gap="8" max>
                                    <Text text={t('Адрес вебхука') || ''} size="s" bold className={cls.label} />
                                    <Textarea
                                        placeholder="https://example.com/webhook"
                                        onChange={(e) => { onChangeField('webhook', e.target.value) }}
                                        value={formFields?.webhook || ''}
                                        className={cls.fullWidth}
                                    />
                                </VStack>

                                <VStack gap="8" max>
                                    <Text text={t('Метод запроса') || ''} size="s" bold className={cls.label} />
                                    <Combobox
                                        options={methods}
                                        value={methods.find(m => m.id === (formFields?.method || 'POST')) || null}
                                        onChange={(e, v: any) => { onChangeField('method', Array.isArray(v) ? undefined : v?.id) }}
                                        className={cls.fullWidth}
                                        disableClearable
                                        getOptionLabel={(option: any) => option.name}
                                    />
                                </VStack>

                                <HeadersEditor
                                    value={formFields?.headers}
                                    onChange={onHeadersChange}
                                />
                            </VStack>
                        )}

                        {/* KB selector */}
                        {isKbMode && (
                            <VStack gap="12" max>
                                <Text text={t('Выберите базы знаний') || ''} size="s" bold className={cls.label} />
                                {knowledgeBases && knowledgeBases.length > 0 ? (
                                    <VStack gap="8" max>
                                        {knowledgeBases.map((kb) => (
                                            <HStack key={kb.id} gap="8" align="center" max className={cls.kbRow}>
                                                <Check
                                                    label=""
                                                    checked={selectedKbIds.includes(kb.id)}
                                                    onChange={() => { onToggleKb(kb.id) }}
                                                />
                                                <BookOpen size={16} />
                                                <Text text={kb.name} size="s" bold />
                                                <Text
                                                    text={`(${kb.chunksCount} ${t('чанков')})`}
                                                    size="xs"
                                                    variant="accent"
                                                />
                                            </HStack>
                                        ))}
                                    </VStack>
                                ) : (
                                    <HStack gap="8" align="center">
                                        <Text text={t('Нет баз знаний.')} size="s" variant="accent" />
                                        <AppLink to={getRouteKnowledgeBases()}>
                                            <Text text={t('Создать →')} size="s" variant="accent" bold />
                                        </AppLink>
                                    </HStack>
                                )}
                                <Text
                                    text={t('Параметры заполнятся автоматически')}
                                    size="xs"
                                    variant="accent"
                                />
                            </VStack>
                        )}
                    </VStack>
                )}

                {/* 8. MCP Server Management (if MCP) */}
                {isMcp && (
                    <McpServerCard />
                )}
            </VStack>
        </Card>
    )
})

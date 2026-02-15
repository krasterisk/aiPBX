import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Modal, Box } from '@mui/material'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { McpTool, useExecuteComposioAction } from '@/entities/Mcp'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { Play, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ComposioTestModal.module.scss'

interface ComposioTestModalProps {
    open: boolean
    onClose: () => void
    tool: McpTool
}

interface SchemaProperty {
    key: string
    type: string
    description?: string
    required: boolean
    enum?: string[]
    default?: any
}

function parseSchema(inputSchema: Record<string, any> | null): SchemaProperty[] {
    if (!inputSchema) return []
    const properties = inputSchema.properties || {}
    const required = inputSchema.required || []

    return Object.entries(properties).map(([key, value]: [string, any]) => ({
        key,
        type: value.type || 'string',
        description: value.description,
        required: required.includes(key),
        enum: value.enum,
        default: value.default,
    }))
}

export const ComposioTestModal = memo((props: ComposioTestModalProps) => {
    const { open, onClose, tool } = props
    const { t } = useTranslation('tools')
    const [executeAction, { isLoading }] = useExecuteComposioAction()

    const schemaFields = useMemo(() => parseSchema(tool.inputSchema), [tool.inputSchema])
    const isComplexSchema = schemaFields.some(f => f.type === 'object' || f.type === 'array')

    const [formValues, setFormValues] = useState<Record<string, any>>({})
    const [rawJson, setRawJson] = useState('{}')
    const [useRawMode, setUseRawMode] = useState(isComplexSchema)
    const [result, setResult] = useState<string | null>(null)
    const [hasError, setHasError] = useState(false)

    const onFieldChange = useCallback((key: string, value: any) => {
        setFormValues(prev => ({ ...prev, [key]: value }))
    }, [])

    const buildArguments = useCallback((): Record<string, any> => {
        if (useRawMode) {
            try {
                return JSON.parse(rawJson)
            } catch {
                throw new Error('Invalid JSON')
            }
        }

        const args: Record<string, any> = {}
        for (const field of schemaFields) {
            const val = formValues[field.key]
            if (val === undefined || val === '') continue

            switch (field.type) {
                case 'number':
                case 'integer':
                    args[field.key] = Number(val)
                    break
                case 'boolean':
                    args[field.key] = val === true || val === 'true'
                    break
                default:
                    args[field.key] = val
            }
        }
        return args
    }, [useRawMode, rawJson, formValues, schemaFields])

    const onExecute = useCallback(async () => {
        try {
            const args = buildArguments()
            const response = await executeAction({
                toolSlug: tool.name,
                arguments: args,
            }).unwrap()
            setResult(typeof response.result === 'string'
                ? response.result
                : JSON.stringify(response.result, null, 2)
            )
            setHasError(false)
        } catch (e) {
            setResult(getErrorMessage(e))
            setHasError(true)
            toast.error(getErrorMessage(e))
        }
    }, [buildArguments, executeAction, tool.name])

    const onCloseModal = useCallback(() => {
        setResult(null)
        setHasError(false)
        setFormValues({})
        setRawJson('{}')
        onClose()
    }, [onClose])

    return (
        <Modal open={open} onClose={onCloseModal}>
            <Box className={cls.modalBox}>
                <VStack gap="16" max className={cls.modalContent}>
                    {/* Header */}
                    <HStack max justify="between" align="center" className={cls.header}>
                        <VStack gap="4">
                            <Text title={t('composio_test')} size="m" bold />
                            <Text text={tool.name} size="s" className={cls.toolSlug} />
                        </VStack>
                        <button
                            type="button"
                            className={cls.closeBtn}
                            onClick={onCloseModal}
                        >
                            <X size={18} />
                        </button>
                    </HStack>

                    {/* Mode toggle */}
                    {schemaFields.length > 0 && (
                        <HStack gap="8" align="center">
                            <button
                                type="button"
                                className={classNames(cls.modeBtn, { [cls.active]: !useRawMode })}
                                onClick={() => setUseRawMode(false)}
                            >
                                {t('composio_test_form')}
                            </button>
                            <button
                                type="button"
                                className={classNames(cls.modeBtn, { [cls.active]: useRawMode })}
                                onClick={() => setUseRawMode(true)}
                            >
                                JSON
                            </button>
                        </HStack>
                    )}

                    {/* Form Fields */}
                    <div className={cls.scrollArea}>
                        {useRawMode ? (
                            <VStack gap="8" max>
                                <Text text={t('composio_test_json_hint')} size="xs" className={cls.hint} />
                                <textarea
                                    className={cls.jsonTextarea}
                                    value={rawJson}
                                    onChange={(e) => setRawJson(e.target.value)}
                                    rows={10}
                                    spellCheck={false}
                                />
                            </VStack>
                        ) : (
                            <VStack gap="12" max>
                                {schemaFields.map((field) => (
                                    <VStack key={field.key} gap="4" max>
                                        <HStack gap="4" align="center">
                                            <Text
                                                text={field.key}
                                                size="s"
                                                bold
                                                className={cls.fieldLabel}
                                            />
                                            {field.required && (
                                                <span className={cls.reqMark}>*</span>
                                            )}
                                            {field.type && (
                                                <span className={cls.typeBadge}>{field.type}</span>
                                            )}
                                        </HStack>
                                        {field.description && (
                                            <Text text={field.description} size="xs" className={cls.fieldDesc} />
                                        )}
                                        {field.enum ? (
                                            <select
                                                className={cls.selectField}
                                                value={formValues[field.key] ?? ''}
                                                onChange={(e) => onFieldChange(field.key, e.target.value)}
                                            >
                                                <option value="">—</option>
                                                {field.enum.map(v => (
                                                    <option key={v} value={v}>{v}</option>
                                                ))}
                                            </select>
                                        ) : field.type === 'boolean' ? (
                                            <select
                                                className={cls.selectField}
                                                value={formValues[field.key] ?? ''}
                                                onChange={(e) => onFieldChange(field.key, e.target.value)}
                                            >
                                                <option value="">—</option>
                                                <option value="true">true</option>
                                                <option value="false">false</option>
                                            </select>
                                        ) : (
                                            <Textarea
                                                placeholder={field.description || field.key}
                                                value={formValues[field.key] ?? ''}
                                                onChange={(e) => onFieldChange(field.key, e.target.value)}
                                                className={cls.inputField}
                                                size="small"
                                                type={field.type === 'number' || field.type === 'integer' ? 'number' : 'text'}
                                            />
                                        )}
                                    </VStack>
                                ))}
                                {schemaFields.length === 0 && (
                                    <Text
                                        text={t('composio_test_no_params')}
                                        size="s"
                                        className={cls.hint}
                                    />
                                )}
                            </VStack>
                        )}
                    </div>

                    {/* Result */}
                    {result !== null && (
                        <VStack gap="8" max className={cls.resultSection}>
                            <HStack gap="4" align="center">
                                {hasError
                                    ? <AlertCircle size={14} className={cls.errorIcon} />
                                    : <CheckCircle size={14} className={cls.successIcon} />
                                }
                                <Text text={t('composio_test_result')} size="s" bold />
                            </HStack>
                            <pre className={classNames(cls.resultBlock, {
                                [cls.errorResult]: hasError,
                            })}>
                                {result}
                            </pre>
                        </VStack>
                    )}

                    {/* Actions */}
                    <HStack gap="8" justify="end" max className={cls.actions}>
                        <Button variant="clear" onClick={onCloseModal}>
                            {t('Закрыть')}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onExecute}
                            disabled={isLoading}
                        >
                            <HStack gap="4" align="center">
                                {isLoading
                                    ? <Loader2 size={14} className={cls.spinner} />
                                    : <Play size={14} />
                                }
                                {t('composio_test_execute')}
                            </HStack>
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </Modal>
    )
})

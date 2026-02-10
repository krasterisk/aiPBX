import { ChangeEvent, memo, useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Check } from '@/shared/ui/mui/Check'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Tool } from '@/entities/Tools'
import { ToolAddParam } from '../../../ToolAddParam/ToolAddParam'
import { HeadersEditor } from '../../../HeadersEditor/HeadersEditor'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './FunctionToolCard.module.scss'

interface FunctionToolCardProps {
    className?: string
    formFields?: Partial<Tool>
    onChangeField: (field: keyof Tool, value: any) => void
    isEdit?: boolean
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

    useEffect(() => {
        setWebhookActive(!!formFields?.webhook)
    }, [formFields?.webhook])

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
                        onChange={(e) => onChangeField('name', e.target.value)}
                        value={formFields?.name || ''}
                        className={cls.fullWidth}
                    />
                </VStack>

                {/* 2. Description (if function) */}
                {isFunction && (
                    <VStack gap="8" max>
                        <Text text={t('Описание') || ''} size="s" bold className={cls.label} />
                        <Textarea
                            placeholder={t('Опишите назначение функции...') ?? ''}
                            multiline
                            minRows={3}
                            onChange={(e) => onChangeField('description', e.target.value)}
                            value={formFields?.description || ''}
                            className={cls.fullWidth}
                        />
                    </VStack>
                )}

                {/* 3. Strict mode (if function) */}
                {isFunction && (
                    <Check
                        label={t('Строгий режим вызова') || ''}
                        checked={formFields?.strict}
                        onChange={(e) => onChangeField('strict', e.target.checked)}
                    />
                )}

                {/* 4. Parameters (if function) */}
                {isFunction && (
                    <ToolAddParam isEdit={isEdit} toolName={formFields?.name} className={cls.fullWidth} />
                )}

                {/* 5. Webhook (if function) */}
                {isFunction && (
                    <VStack gap="16" max>
                        <Check
                            label={t('Вебхук') || ''}
                            checked={webhookActive}
                            onChange={onWebhookToggle}
                        />

                        {webhookActive && (
                            <VStack gap="16" max className={cls.webhookContainer}>
                                <VStack gap="8" max>
                                    <Text text={t('Адрес вебхука') || ''} size="s" bold className={cls.label} />
                                    <Textarea
                                        placeholder="https://example.com/webhook"
                                        onChange={(e) => onChangeField('webhook', e.target.value)}
                                        value={formFields?.webhook || ''}
                                        className={cls.fullWidth}
                                    />
                                </VStack>

                                <VStack gap="8" max>
                                    <Text text={t('Метод запроса') || ''} size="s" bold className={cls.label} />
                                    <Combobox
                                        options={methods}
                                        value={methods.find(m => m.id === (formFields?.method || 'POST')) || null}
                                        onChange={(e, v: any) => onChangeField('method', Array.isArray(v) ? undefined : v?.id)}
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
                    </VStack>
                )}

                {/* 6. MCP params (if MCP) */}
                {isMcp && (
                    <VStack gap="8" max>
                        <Text text={t('Параметры MCP сервера') || ''} size="s" bold className={cls.label} />
                        <Textarea
                            multiline
                            minRows={10}
                            onChange={(e) => {
                                const val = e.target.value
                                if (!val) {
                                    onChangeField('toolData', {})
                                    return
                                }
                                try {
                                    onChangeField('toolData', JSON.parse(val))
                                } catch (err) {
                                    onChangeField('toolData', val)
                                }
                            }}
                            value={
                                formFields?.toolData && typeof formFields.toolData === 'object'
                                    ? (Object.keys(formFields.toolData).length === 0 ? '' : JSON.stringify(formFields.toolData, null, 2))
                                    : (formFields?.toolData ?? '')
                            }
                            className={cls.fullWidth}
                        />
                    </VStack>
                )}
            </VStack>
        </Card>
    )
})

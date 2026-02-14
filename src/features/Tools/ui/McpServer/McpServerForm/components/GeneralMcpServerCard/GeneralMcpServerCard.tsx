import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { InputPassword } from '@/shared/ui/mui/InputPassword'
import { Button } from '@/shared/ui/redesigned/Button'
import { Tooltip } from '@mui/material'
import { Plus, Trash2, Info } from 'lucide-react'
import { ClientSelect } from '@/entities/User'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './GeneralMcpServerCard.module.scss'

interface HeaderEntry {
    key: string
    value: string
}

type AuthType = 'none' | 'bearer' | 'apikey' | 'custom_headers'

interface GeneralMcpServerCardProps {
    className?: string
    name: string
    url: string
    transport: string
    userId?: string
    isAdmin?: boolean
    onChangeName: (value: string) => void
    onChangeUrl: (value: string) => void
    onChangeTransport: (value: string) => void
    onChangeClient?: (clientId: string) => void
    // Auth fields
    authType: AuthType
    bearerToken: string
    apiKey: string
    customHeaders: HeaderEntry[]
    onChangeAuthType: (value: AuthType) => void
    onChangeBearerToken: (value: string) => void
    onChangeApiKey: (value: string) => void
    onAddHeader: () => void
    onRemoveHeader: (index: number) => void
    onHeaderChange: (index: number, field: 'key' | 'value', value: string) => void
}

export const GeneralMcpServerCard = memo((props: GeneralMcpServerCardProps) => {
    const {
        className,
        name,
        url,
        transport,
        userId,
        isAdmin,
        onChangeName,
        onChangeUrl,
        onChangeTransport,
        onChangeClient,
        authType,
        bearerToken,
        apiKey,
        customHeaders,
        onChangeAuthType,
        onChangeBearerToken,
        onChangeApiKey,
        onAddHeader,
        onRemoveHeader,
        onHeaderChange,
    } = props
    const { t } = useTranslation('tools')

    const transportOptions = useMemo(() => [
        { id: 'http', name: 'HTTP (SSE)' },
        { id: 'websocket', name: 'WebSocket' },
    ], [])

    const authTypeOptions = useMemo(() => [
        { id: 'none', name: t('Нет') },
        { id: 'bearer', name: 'Bearer Token' },
        { id: 'apikey', name: 'API Key' },
        { id: 'custom_headers', name: t('Пользовательские заголовки') },
    ], [t])

    return (
        <Card
            max
            padding="24"
            border="partial"
            className={classNames(cls.GeneralMcpServerCard, {}, [className])}
        >
            <VStack gap="24" max align="start">
                {/* 1. Client Select for Admin */}
                {isAdmin && onChangeClient && (
                    <VStack gap="8" max>
                        <HStack gap="4" align="center">
                            <Text text={t('Клиент') || ''} size="s" bold className={cls.label} />
                            <Tooltip
                                title={t('mcpClientTooltip')}
                                arrow
                                placement="top"
                                enterTouchDelay={0}
                                leaveTouchDelay={3000}
                                slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                            >
                                <span className={cls.tooltipIcon}><Info size={16} /></span>
                            </Tooltip>
                        </HStack>
                        <ClientSelect
                            clientId={String(userId || '')}
                            onChangeClient={onChangeClient}
                            className={cls.fullWidth}
                        />
                    </VStack>
                )}

                {/* 2. Server Name */}
                <VStack gap="8" max>
                    <HStack gap="4" align="center">
                        <Text text={t('Имя сервера') || ''} size="s" bold className={cls.label} />
                        <Tooltip
                            title={t('mcpServerNameTooltip')}
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
                        placeholder={t('Введите имя MCP сервера') ?? ''}
                        value={name}
                        onChange={(e) => onChangeName(e.target.value)}
                        className={cls.fullWidth}
                    />
                </VStack>

                {/* 3. URL */}
                <VStack gap="8" max>
                    <HStack gap="4" align="center">
                        <Text text={t('URL сервера') || ''} size="s" bold className={cls.label} />
                        <Tooltip
                            title={t('mcpServerUrlTooltip')}
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
                        placeholder="https://mcp-server.example.com/sse"
                        value={url}
                        onChange={(e) => onChangeUrl(e.target.value)}
                        className={cls.fullWidth}
                    />
                </VStack>

                {/* 4. Transport */}
                <VStack gap="8" max>
                    <HStack gap="4" align="center">
                        <Text text={t('Транспорт') || ''} size="s" bold className={cls.label} />
                        <Tooltip
                            title={t('mcpTransportTooltip')}
                            arrow
                            placement="top"
                            enterTouchDelay={0}
                            leaveTouchDelay={3000}
                            slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                        >
                            <span className={cls.tooltipIcon}><Info size={16} /></span>
                        </Tooltip>
                    </HStack>
                    <Combobox
                        options={transportOptions}
                        value={transportOptions.find(o => o.id === transport) || transportOptions[0]}
                        onChange={(_, v: any) => {
                            if (v && !Array.isArray(v)) onChangeTransport(v.id)
                        }}
                        className={cls.fullWidth}
                        disableClearable
                        getOptionLabel={(option: any) => option.name}
                    />
                </VStack>

                <div className={cls.divider} />

                {/* 5. Auth Type */}
                <VStack gap="8" max>
                    <HStack gap="4" align="center">
                        <Text text={t('Тип авторизации') || ''} size="s" bold className={cls.label} />
                        <Tooltip
                            title={t('mcpAuthTypeTooltip')}
                            arrow
                            placement="top"
                            enterTouchDelay={0}
                            leaveTouchDelay={3000}
                            slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                        >
                            <span className={cls.tooltipIcon}><Info size={16} /></span>
                        </Tooltip>
                    </HStack>
                    <Combobox
                        options={authTypeOptions}
                        value={authTypeOptions.find(o => o.id === authType) || authTypeOptions[0]}
                        onChange={(_, v: any) => {
                            if (v && !Array.isArray(v)) onChangeAuthType(v.id as AuthType)
                        }}
                        className={cls.fullWidth}
                        disableClearable
                        getOptionLabel={(option: any) => option.name}
                    />
                </VStack>

                {/* 6. Credentials — Bearer */}
                {authType === 'bearer' && (
                    <VStack gap="8" max className={cls.credentialsContainer}>
                        <HStack gap="4" align="center">
                            <Text text={t('Токен') || ''} size="s" bold className={cls.label} />
                            <Tooltip
                                title={t('mcpBearerTokenTooltip')}
                                arrow
                                placement="top"
                                enterTouchDelay={0}
                                leaveTouchDelay={3000}
                                slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                            >
                                <span className={cls.tooltipIcon}><Info size={16} /></span>
                            </Tooltip>
                        </HStack>
                        <InputPassword
                            placeholder={t('Введите Bearer токен') || ''}
                            value={bearerToken}
                            onChange={(e) => onChangeBearerToken(e.target.value)}
                            size="small"
                            className={cls.fullWidth}
                        />
                    </VStack>
                )}

                {/* 7. Credentials — API Key */}
                {authType === 'apikey' && (
                    <VStack gap="8" max className={cls.credentialsContainer}>
                        <HStack gap="4" align="center">
                            <Text text={t('API ключ') || ''} size="s" bold className={cls.label} />
                            <Tooltip
                                title={t('mcpApiKeyTooltip')}
                                arrow
                                placement="top"
                                enterTouchDelay={0}
                                leaveTouchDelay={3000}
                                slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                            >
                                <span className={cls.tooltipIcon}><Info size={16} /></span>
                            </Tooltip>
                        </HStack>
                        <InputPassword
                            placeholder={t('Введите API ключ') || ''}
                            value={apiKey}
                            onChange={(e) => onChangeApiKey(e.target.value)}
                            size="small"
                            className={cls.fullWidth}
                        />
                    </VStack>
                )}

                {/* 8. Credentials — Custom Headers */}
                {authType === 'custom_headers' && (
                    <VStack gap="8" max className={cls.credentialsContainer}>
                        <HStack gap="4" align="center">
                            <Text text={t('Заголовки') || ''} size="s" bold className={cls.label} />
                            <Tooltip
                                title={t('mcpCustomHeadersTooltip')}
                                arrow
                                placement="top"
                                enterTouchDelay={0}
                                leaveTouchDelay={3000}
                                slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                            >
                                <span className={cls.tooltipIcon}><Info size={16} /></span>
                            </Tooltip>
                        </HStack>
                        {customHeaders.map((entry, index) => (
                            <HStack
                                key={index}
                                gap="8"
                                max
                                align="center"
                                className={cls.headerRow}
                            >
                                <HStack gap="8" max className={cls.headerRowInputs}>
                                    <Textarea
                                        placeholder="Header"
                                        value={entry.key}
                                        onChange={(e) => onHeaderChange(index, 'key', e.target.value)}
                                        className={cls.fullWidth}
                                        size="small"
                                    />
                                    <Textarea
                                        placeholder="Value"
                                        value={entry.value}
                                        onChange={(e) => onHeaderChange(index, 'value', e.target.value)}
                                        className={cls.fullWidth}
                                        size="small"
                                    />
                                </HStack>
                                <Button
                                    variant="glass-action"
                                    square
                                    size="s"
                                    onClick={() => onRemoveHeader(index)}
                                    title={t('Удалить') || 'Remove'}
                                    addonLeft={<Trash2 size={16} />}
                                />
                            </HStack>
                        ))}
                        <Button
                            variant="glass-action"
                            size="s"
                            className={cls.addBtn}
                            onClick={onAddHeader}
                            addonLeft={<Plus size={16} />}
                        >
                            {t('Добавить')}
                        </Button>
                    </VStack>
                )}
            </VStack>
        </Card>
    )
})

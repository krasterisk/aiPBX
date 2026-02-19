import { memo, useCallback, useEffect, useRef, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button/Button'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { classNames } from '@/shared/lib/classNames/classNames'
import { CheckCircle, Loader2, Key } from 'lucide-react'
import { mcpServerTemplates, McpServerTemplate } from '../../model/const/mcpServerTemplates'
import {
    useComposioConnect,
    useComposioConnectApiKey,
    useBitrix24Connect,
    useTelegramConnect,
    useGetComposioStatus,
    useDeleteComposioConnection,
    useMcpServersAll,
} from '../../api/mcpApi'
import { ComposioConnectionStatus } from '../../model/types/mcpTypes'
import cls from './McpServerTemplates.module.scss'

interface McpServerTemplatesProps {
    className?: string
}

export const McpServerTemplates = memo((props: McpServerTemplatesProps) => {
    const { className } = props
    const { t } = useTranslation('tools')
    const [composioConnect, { isLoading: isConnecting }] = useComposioConnect()
    const [connectApiKey, { isLoading: isConnectingApiKey }] = useComposioConnectApiKey()
    const [connectBitrix24, { isLoading: isConnectingBitrix24 }] = useBitrix24Connect()
    const [connectTelegramApi, { isLoading: isConnectingTelegram }] = useTelegramConnect()
    const { data: statuses, refetch: refetchStatus } = useGetComposioStatus()
    const { data: allServers } = useMcpServersAll(null)
    const [deleteConnection, { isLoading: isDisconnecting }] = useDeleteComposioConnection()

    // API key dialog state
    const [apiKeyDialog, setApiKeyDialog] = useState<{ toolkit: string; template: McpServerTemplate } | null>(null)
    const [apiKeyValue, setApiKeyValue] = useState('')

    const popupRef = useRef<Window | null>(null)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Build a map toolkit → status for quick lookup
    const statusMap = useMemo(() => {
        const map: Record<string, ComposioConnectionStatus> = {}
        statuses?.forEach(s => { map[s.slug] = s })
        return map
    }, [statuses])

    // Build a set of toolkits that have a real MCP server
    const serversByToolkit = useMemo(() => {
        const set = new Set<string>()
        allServers?.forEach(s => {
            if (s.composioToolkit) set.add(s.composioToolkit)
        })
        return set
    }, [allServers])

    // Monitor popup close → refetch status
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    const startPopupPolling = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            if (popupRef.current && popupRef.current.closed) {
                clearInterval(timerRef.current!)
                timerRef.current = null
                popupRef.current = null
                refetchStatus()
            }
        }, 1000)
    }, [refetchStatus])

    const onConnect = useCallback(async (template: McpServerTemplate) => {
        // API key, chat_id, or webhook templates → open dialog
        if (template.authType === 'api_key' || template.authType === 'chat_id' || template.authType === 'webhook') {
            setApiKeyDialog({ toolkit: template.toolkit, template })
            setApiKeyValue('')
            return
        }

        // OAuth templates → open popup
        try {
            const result = await composioConnect({ toolkit: template.toolkit }).unwrap()
            if (result.redirectUrl) {
                popupRef.current = window.open(
                    result.redirectUrl,
                    `composio_auth_${template.toolkit}`,
                    'width=600,height=700'
                )
                startPopupPolling()
            }
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [composioConnect, t, startPopupPolling])

    const onSubmitApiKey = useCallback(async () => {
        if (!apiKeyDialog || !apiKeyValue.trim()) return

        try {
            const authType = apiKeyDialog.template.authType

            if (authType === 'webhook') {
                await connectBitrix24({ webhookUrl: apiKeyValue.trim() }).unwrap()
            } else if (authType === 'chat_id') {
                // Telegram: use dedicated endpoint
                await connectTelegramApi({ chatId: apiKeyValue.trim() }).unwrap()
            } else {
                await connectApiKey({
                    toolkit: apiKeyDialog.toolkit,
                    apiKey: apiKeyValue.trim(),
                }).unwrap()
            }

            toast.success(t('composio_connected'))
            setApiKeyDialog(null)
            setApiKeyValue('')
        } catch (e: any) {
            // Error toast handled by global toastMiddleware
        }
    }, [apiKeyDialog, apiKeyValue, connectApiKey, connectBitrix24, connectTelegramApi, t])

    const onDisconnect = useCallback(async (accountId: string) => {
        try {
            await deleteConnection(accountId).unwrap()
            toast.success(t('composio_disconnected'))
        } catch (e) {
            // Error toast handled by global toastMiddleware
        }
    }, [deleteConnection, t])

    const isLoading = isConnecting || isDisconnecting || isConnectingApiKey || isConnectingBitrix24 || isConnectingTelegram

    // Determine dialog type
    const isTelegramDialog = apiKeyDialog?.template.authType === 'chat_id'
    const isBitrix24Dialog = apiKeyDialog?.template.authType === 'webhook'

    return (
        <VStack gap="16" max className={classNames(cls.templateSection, {}, [className])}>
            <VStack gap="4">
                <Text title={t('Подключите сервисы')} bold />
                <Text text={t('Выберите сервис для быстрого подключения через OAuth')} />
            </VStack>

            <div className={cls.templateGrid}>
                {mcpServerTemplates.map((template) => {
                    const status = statusMap[template.toolkit]
                    const composioConnected = status?.isConnected ?? false
                    const hasMcpServer = serversByToolkit.has(template.toolkit)
                    // For webhook/chat_id services (Bitrix24, Telegram), only MCP server existence matters
                    const isFullyConnected = (template.authType === 'webhook' || template.authType === 'chat_id')
                        ? hasMcpServer
                        : composioConnected && hasMcpServer
                    const isOrphaned = composioConnected && !hasMcpServer

                    return (
                        <VStack
                            key={template.id}
                            gap="8"
                            align="center"
                            justify="center"
                            className={classNames(cls.templateCard, {
                                [cls.loading]: isLoading,
                                [cls.connected]: isFullyConnected,
                            })}
                            onClick={() => {
                                if (!isLoading && !isFullyConnected) {
                                    onConnect(template)
                                }
                            }}
                        >
                            {isFullyConnected && (
                                <div className={cls.connectedBadge}>
                                    <CheckCircle size={14} />
                                    <span>{t('composio_connected')}</span>
                                </div>
                            )}

                            <HStack
                                justify="center"
                                align="center"
                                className={classNames(cls.iconWrapper, {}, [cls[template.colorClass]])}
                            >
                                <template.Icon size={24} />
                            </HStack>
                            <Text
                                text={t(template.nameKey)}
                                className={cls.templateName}
                                align="center"
                            />
                            <Text
                                text={t(template.descriptionKey)}
                                className={cls.templateDesc}
                                align="center"
                                size="s"
                            />

                            {/* API key badge for non-oauth services */}
                            {template.authType === 'api_key' && !isFullyConnected && (
                                <HStack gap="4" align="center" className={cls.apiKeyBadge}>
                                    <Key size={10} />
                                    <span>API Key</span>
                                </HStack>
                            )}

                            {isFullyConnected ? (
                                <button
                                    type="button"
                                    className={cls.disconnectBtn}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (status?.connectedAccountId) {
                                            onDisconnect(status.connectedAccountId)
                                        }
                                    }}
                                >
                                    {isDisconnecting
                                        ? <Loader2 size={12} className={cls.spinner} />
                                        : t('composio_disconnect')
                                    }
                                </button>
                            ) : isOrphaned ? (
                                <Text
                                    text={t('composio_reconnect')}
                                    className={cls.connectLabel}
                                    size="xs"
                                    variant="accent"
                                />
                            ) : (
                                <Text
                                    text={t('Подключить')}
                                    className={cls.connectLabel}
                                    size="xs"
                                    variant="accent"
                                />
                            )}
                        </VStack>
                    )
                })}
            </div>

            {/* API Key / Chat ID Input Dialog */}
            <Modal
                isOpen={!!apiKeyDialog}
                onClose={() => setApiKeyDialog(null)}
                lazy
            >
                <VStack gap="16" max>
                    <HStack gap="8" align="center">
                        {apiKeyDialog && <apiKeyDialog.template.Icon size={20} />}
                        <Text
                            title={apiKeyDialog ? t(apiKeyDialog.template.nameKey) : ''}
                            size="s"
                            bold
                        />
                    </HStack>

                    {isTelegramDialog ? (
                        <VStack gap="8">
                            <Text text={t('telegram_chat_id_step1')} size="s" />
                            <a
                                href="https://t.me/AIPBXbot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cls.botLink}
                            >
                                @AIPBXbot
                            </a>
                            <Text text={t('telegram_chat_id_step2')} size="s" />
                        </VStack>
                    ) : isBitrix24Dialog ? (
                        <VStack gap="8">
                            <Text text={t('bitrix24_webhook_step1')} size="s" />
                            <Text text={t('bitrix24_webhook_step2')} size="s" />
                        </VStack>
                    ) : (
                        <Text
                            text={t('api_key_instruction')}
                            size="s"
                        />
                    )}

                    <Textarea
                        value={apiKeyValue}
                        onChange={(e) => setApiKeyValue(e.target.value)}
                        placeholder={
                            isTelegramDialog
                                ? t('telegram_chat_id_placeholder') ?? 'Chat ID...'
                                : isBitrix24Dialog
                                    ? t('bitrix24_webhook_placeholder') ?? 'https://your-domain.bitrix24.ru/rest/1/...'
                                    : t('api_key_placeholder') ?? 'Bot token / API key...'
                        }
                        autoFocus
                        size="small"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onSubmitApiKey()
                            if (e.key === 'Escape') setApiKeyDialog(null)
                        }}
                    />

                    <HStack gap="8" justify="end" max>
                        <Button
                            variant="clear"
                            onClick={() => setApiKeyDialog(null)}
                            size="s"
                        >
                            {t('Отмена')}
                        </Button>
                        <Button
                            variant="glass-action"
                            onClick={onSubmitApiKey}
                            disabled={!apiKeyValue.trim() || isLoading}
                            size="s"
                            addonLeft={
                                isLoading
                                    ? <Loader2 size={14} className={cls.spinner} />
                                    : undefined
                            }
                        >
                            {isLoading ? '' : t('Подключить')}
                        </Button>
                    </HStack>
                </VStack>
            </Modal>
        </VStack>
    )
})

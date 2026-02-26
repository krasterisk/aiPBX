import { memo, useCallback, useEffect, useRef, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button/Button'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Zap, CheckCircle, Loader2 } from 'lucide-react'
import { mcpServerTemplates, McpServerTemplate } from '../../model/const/mcpServerTemplates'
import {
    useComposioConnect,
    useComposioConnectApiKey,
    useBitrix24Connect,
    useTelegramConnect,
    useGetComposioStatus,
    useMcpServersAll,
} from '../../api/mcpApi'
import { ComposioConnectionStatus } from '../../model/types/mcpTypes'
import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'
import cls from './McpQuickConnect.module.scss'

interface McpQuickConnectProps {
    className?: string
}

export const McpQuickConnect = memo((props: McpQuickConnectProps) => {
    const { className } = props
    const { t } = useTranslation('tools')
    const [composioConnect, { isLoading }] = useComposioConnect()
    const [connectApiKey, { isLoading: isConnectingApiKey }] = useComposioConnectApiKey()
    const [connectBitrix24, { isLoading: isConnectingBitrix24 }] = useBitrix24Connect()
    const [connectTelegramApi, { isLoading: isConnectingTelegram }] = useTelegramConnect()
    const { data: statuses, refetch: refetchStatus } = useGetComposioStatus()
    const userData = useSelector(getUserAuthData)
    const { data: allServers, refetch: refetchServers } = useMcpServersAll(null)

    // API key dialog state
    const [apiKeyDialog, setApiKeyDialog] = useState<{ toolkit: string, template: McpServerTemplate } | null>(null)
    const [apiKeyValue, setApiKeyValue] = useState('')

    const popupRef = useRef<Window | null>(null)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const statusMap = useMemo(() => {
        const map: Record<string, ComposioConnectionStatus> = {}
        statuses?.forEach(s => { map[s.slug] = s })
        return map
    }, [statuses])

    // Build a set of toolkits that have a real MCP server for the current user
    const serversByToolkit = useMemo(() => {
        const set = new Set<string>()
        const currentUserId = userData?.id ? String(userData.id) : null
        allServers?.forEach(s => {
            if (s.composioToolkit && (!currentUserId || String(s.userId) === currentUserId)) {
                set.add(s.composioToolkit)
            }
        })
        return set
    }, [allServers, userData])

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    // Listen for postMessage from OAuth popup
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type !== 'composio_callback') return

            // Clean up popup & polling
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
            popupRef.current = null

            if (event.data.status === 'success') {
                toast.success(t('Интеграция успешно подключена'))
                refetchStatus()
                refetchServers()
            } else {
                toast.error(t('Ошибка подключения интеграции'))
            }
        }

        window.addEventListener('message', handleMessage)
        return () => { window.removeEventListener('message', handleMessage) }
    }, [refetchStatus, refetchServers, t])

    const startPopupPolling = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            if (popupRef.current && popupRef.current.closed) {
                clearInterval(timerRef.current!)
                timerRef.current = null
                popupRef.current = null
                refetchStatus()
                refetchServers()
            }
        }, 1000)
    }, [refetchStatus, refetchServers])

    const onTemplateClick = useCallback(async (template: McpServerTemplate) => {
        const status = statusMap[template.toolkit]
        const hasMcpServer = serversByToolkit.has(template.toolkit)
        // For webhook/chat_id services (Bitrix24, Telegram), only MCP server existence matters
        const alreadyConnected = (template.authType === 'webhook' || template.authType === 'chat_id')
            ? hasMcpServer
            : status?.isConnected && hasMcpServer
        if (alreadyConnected) return

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
    }, [composioConnect, t, startPopupPolling, statusMap, serversByToolkit])

    const onSubmitApiKey = useCallback(async () => {
        if (!apiKeyDialog || !apiKeyValue.trim()) return

        try {
            const authType = apiKeyDialog.template.authType

            if (authType === 'webhook') {
                // Bitrix24: send webhook URL
                await connectBitrix24({ webhookUrl: apiKeyValue.trim() }).unwrap()
            } else if (authType === 'chat_id') {
                // Telegram: use dedicated endpoint
                await connectTelegramApi({ chatId: apiKeyValue.trim() }).unwrap()
            } else {
                // API key
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

    const isBusy = isLoading || isConnectingApiKey || isConnectingBitrix24 || isConnectingTelegram

    // Determine dialog type
    const isTelegramDialog = apiKeyDialog?.template.authType === 'chat_id'
    const isBitrix24Dialog = apiKeyDialog?.template.authType === 'webhook'

    return (
        <VStack gap="8" max className={classNames(cls.quickConnect, {}, [className])}>
            <HStack gap="8" align="center">
                <Zap size={16} className={cls.zapIcon} />
                <Text text={t('Быстрое подключение')} size="s" bold />
            </HStack>

            <div className={cls.stripWrapper}>
                <HStack gap="12" className={cls.strip}>
                    {mcpServerTemplates.map((template) => {
                        const status = statusMap[template.toolkit]
                        const composioConnected = status?.isConnected ?? false
                        const hasMcpServer = serversByToolkit.has(template.toolkit)
                        // For webhook/chat_id services (Bitrix24, Telegram), only MCP server existence matters
                        const isFullyConnected = (template.authType === 'webhook' || template.authType === 'chat_id')
                            ? hasMcpServer
                            : composioConnected && hasMcpServer

                        return (
                            <VStack
                                key={template.id}
                                gap="4"
                                align="center"
                                className={classNames(cls.quickItem, {
                                    [cls.loading]: isBusy,
                                    [cls.connected]: isFullyConnected,
                                })}
                                onClick={async () => { await onTemplateClick(template) }}
                            >
                                <div className={cls.iconWithStatus}>
                                    <HStack
                                        justify="center"
                                        align="center"
                                        className={classNames(cls.quickIcon, {}, [cls[template.colorClass]])}
                                    >
                                        <template.Icon size={18} />
                                    </HStack>
                                    {isFullyConnected && (
                                        <CheckCircle size={12} className={cls.connectedDot} />
                                    )}
                                </div>
                                <Text
                                    text={t(template.nameKey)}
                                    size="xs"
                                    className={cls.quickName}
                                    align="center"
                                />
                            </VStack>
                        )
                    })}
                </HStack>
            </div>

            {/* API Key / Chat ID Input Dialog */}
            <Modal
                isOpen={!!apiKeyDialog}
                onClose={() => { setApiKeyDialog(null) }}
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

                    {isTelegramDialog
                        ? (
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
                        )
                        : isBitrix24Dialog
                            ? (
                                <VStack gap="8">
                                    <Text text={t('bitrix24_webhook_step1')} size="s" />
                                    <Text text={t('bitrix24_webhook_step2')} size="s" />
                                </VStack>
                            )
                            : (
                                <Text
                                    text={t('api_key_instruction')}
                                    size="s"
                                />
                            )}

                    <Textarea
                        value={apiKeyValue}
                        onChange={(e) => { setApiKeyValue(e.target.value) }}
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
                            onClick={() => { setApiKeyDialog(null) }}
                            size="s"
                        >
                            {t('Отмена')}
                        </Button>
                        <Button
                            variant="glass-action"
                            onClick={onSubmitApiKey}
                            disabled={!apiKeyValue.trim() || isBusy}
                            size="s"
                            addonLeft={
                                isBusy
                                    ? <Loader2 size={14} className={cls.spinner} />
                                    : undefined
                            }
                        >
                            {isBusy ? '' : t('Подключить')}
                        </Button>
                    </HStack>
                </VStack>
            </Modal>
        </VStack>
    )
})

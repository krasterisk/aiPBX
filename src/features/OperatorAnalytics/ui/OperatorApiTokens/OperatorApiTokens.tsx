import { memo, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { IconButton, Skeleton } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyIcon from '@mui/icons-material/Key'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AddIcon from '@mui/icons-material/Add'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { ProjectSelect } from '../ProjectSelect/ProjectSelect'
import { useGenerateOperatorApiToken, useListOperatorApiTokens, useRevokeOperatorApiToken, useDeleteOperatorApiToken, OperatorApiToken } from '@/entities/Report'
import { ClientSelect, isUserAdmin, useGetAllUsers } from '@/entities/User'
import { toast } from 'react-toastify'
import cls from './OperatorApiTokens.module.scss'

// ─── Token Item ──────────────────────────────────────────────────────────────

interface TokenItemProps {
    token: OperatorApiToken
    ownerLabel?: string
    onRevoke: (id: string) => void // PATCH /revoke - деактивация
    onDelete: (id: string) => void // DELETE - физическое удаление
}

const TokenItem = memo(({ token, ownerLabel, onRevoke, onDelete }: TokenItemProps) => {
    const { t } = useTranslation('reports')
    const [confirm, setConfirm] = useState(false)
    const preview = token.preview ? `${token.preview}...` : '••••••••••••••••'

    // Активный → revoke; Отозванный → delete
    const actionLabel = token.isActive ? String(t('Отозвать')) : String(t('Удалить'))
    const actionTooltip = token.isActive
        ? String(t('Деактивировать токен (можно восстановить)'))
        : String(t('Удалить навсегда из списка'))
    const handleConfirm = () => {
        token.isActive ? onRevoke(token.id) : onDelete(token.id)
        setConfirm(false)
    }

    return (
        <Card variant={'glass'} border={'partial'} padding={'16'} max className={`${cls.tokenItem} ${!token.isActive ? cls.tokenRevoked : ''}`}>
            <HStack max justify={'between'} align={'center'} gap={'12'}>
                <HStack gap={'12'} align={'center'}>
                    <KeyIcon sx={{ color: token.isActive ? 'var(--accent-redesigned)' : 'var(--icon-redesigned)', fontSize: 20, opacity: token.isActive ? 1 : 0.5 }} />
                    <VStack gap={'4'}>
                        <HStack gap={'8'} align={'center'}>
                            <Text text={token.name} bold />
                            {ownerLabel && (
                                <span className={cls.projectTag}>{ownerLabel}</span>
                            )}
                            {token.projectName && (
                                <span className={cls.projectTag}>{token.projectName}</span>
                            )}
                        </HStack>
                        <Text text={preview} size={'s'} />
                        <HStack gap={'12'}>
                            <Text text={`${String(t('Создан'))}: ${new Date(token.createdAt).toLocaleDateString()}`} size={'s'} />
                            {token.lastUsedAt && (
                                <Text text={`${String(t('Использован'))}: ${new Date(token.lastUsedAt).toLocaleDateString()}`} size={'s'} />
                            )}
                        </HStack>
                    </VStack>
                </HStack>

                <HStack gap={'8'} align={'center'}>
                    <span className={`${cls.badge} ${token.isActive ? cls.active : cls.inactive}`}>
                        {token.isActive ? `● ${String(t('Активен'))}` : `○ ${String(t('Отозван'))}`}
                    </span>

                    {confirm ? (
                        <HStack gap={'8'} align={'center'}>
                            <Button variant={'glass-action'} color={'error'} size={'s'} onClick={handleConfirm}>
                                {actionLabel}
                            </Button>
                            <IconButton size={'small'} onClick={() => { setConfirm(false) }} className={cls.iconBtn}>
                                <span style={{ fontSize: 13 }}>✕</span>
                            </IconButton>
                        </HStack>
                    ) : (
                        <IconButton
                            size={'small'}
                            onClick={() => { setConfirm(true) }}
                            className={cls.iconBtnDanger}
                            title={actionTooltip}
                        >
                            <DeleteOutlineIcon fontSize={'small'} />
                        </IconButton>
                    )}
                </HStack>
            </HStack>
        </Card>
    )
})

// ─── Generate Modal ───────────────────────────────────────────────────────────

interface GenerateModalProps {
    open: boolean
    onClose: () => void
    ownerUserId?: string
}

const GenerateModal = memo(({ open, onClose, ownerUserId }: GenerateModalProps) => {
    const { t } = useTranslation('reports')
    const [generateToken, { isLoading }] = useGenerateOperatorApiToken()
    const [tokenName, setTokenName] = useState('')
    const [projectId, setProjectId] = useState('')
    const [generatedToken, setGeneratedToken] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleGenerate = useCallback(async () => {
        if (!tokenName.trim()) return
        try {
            const result = await generateToken({
                name: tokenName.trim(),
                projectId: projectId || undefined,
                ownerUserId: ownerUserId || undefined,
            }).unwrap()
            setGeneratedToken(result.token)
            setTokenName('')
            setProjectId('')
        } catch (err: any) {
            if (!err?.status) toast.error(String(t('Ошибка сети')))
        }
    }, [tokenName, projectId, ownerUserId, generateToken, t])

    const handleCopy = useCallback(() => {
        if (!generatedToken) return
        navigator.clipboard.writeText(generatedToken).then(() => {
            setCopied(true)
            setTimeout(() => { setCopied(false) }, 2000)
        })
    }, [generatedToken])

    const handleClose = () => {
        setGeneratedToken(null)
        setTokenName('')
        setProjectId('')
        onClose()
    }

    return (
        <Modal isOpen={open} onClose={handleClose} lazy>
            <div className={cls.modal}>
                <button type={'button'} className={cls.modalClose} onClick={handleClose} aria-label={'Close'}>{'✕'}</button>

                <VStack gap={'16'}>
                    {!generatedToken ? (
                        <>
                            <Text title={String(t('Генерировать токен'))} bold />
                            <Text text={String(t('Токен будет привязан к выбранному проекту. Все звонки, отправленные с этим токеном, автоматически попадут в этот проект.'))} />
                            <Textarea
                                label={String(t('Название токена'))}
                                value={tokenName}
                                onChange={e => { setTokenName(e.target.value) }}
                                size={'small'}
                                fullWidth
                                multiline={false}
                                required
                            />
                            <ProjectSelect
                                label={String(t('Привязать к проекту'))}
                                value={projectId}
                                onChange={setProjectId}
                            />
                            <Button
                                variant={'glass-action'}
                                onClick={handleGenerate}
                                disabled={isLoading || !tokenName.trim()}
                            >
                                {String(t('Генерировать токен'))}
                            </Button>
                        </>
                    ) : (
                        <>
                            <VStack gap={'8'}>
                                <Text title={String(t('Сохраните токен'))} bold />
                                <Text text={String(t('Токен отображается только один раз. Сохраните его в надёжном месте.'))} />
                            </VStack>
                            <pre className={cls.tokenBox}>{generatedToken}</pre>
                            <HStack gap={'8'}>
                                <Button
                                    variant={'glass-action'}
                                    addonLeft={<ContentCopyIcon fontSize={'small'} />}
                                    onClick={handleCopy}
                                >
                                    {copied ? `✓ ${String(t('Скопировано'))}` : String(t('Скопировать'))}
                                </Button>
                                <Button variant={'clear'} onClick={handleClose}>
                                    {String(t('Завершено'))}
                                </Button>
                            </HStack>
                        </>
                    )}
                </VStack>
            </div>
        </Modal>
    )
})

// ─── Accordion Doc Entry ──────────────────────────────────────────────────────

interface DocEntryProps {
    method: 'POST' | 'GET'
    path: string
    description: string
    fullUrl: string
    children: React.ReactNode
}

const DocEntry = memo(({ method, path, description, fullUrl, children }: DocEntryProps) => {
    const { t } = useTranslation('reports')
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(fullUrl).then(() => {
            setCopied(true)
            setTimeout(() => { setCopied(false) }, 2000)
        })
    }, [fullUrl])

    return (
        <div className={`${cls.docEntry} ${open ? cls.docEntryOpen : ''}`}>
            <button
                type={'button'}
                className={cls.docEntryHeader}
                onClick={() => { setOpen(p => !p) }}
                aria-expanded={open}
            >
                <HStack gap={'12'} align={'center'} className={cls.docEntryTitle}>
                    <span className={`${cls.method} ${method === 'GET' ? cls.methodGet : ''}`}>
                        {method}
                    </span>
                    <code className={cls.docPath}>{path}</code>
                    <span className={cls.docDesc}>{description}</span>
                </HStack>
                <HStack gap={'8'} align={'center'}>
                    <span
                        className={`${cls.baseUrlCopy} ${copied ? cls.baseUrlCopied : ''}`}
                        onClick={handleCopy}
                        title={String(t('Скопировать URL'))}
                    >
                        <ContentCopyIcon sx={{ fontSize: 14 }} />
                    </span>
                    <span className={cls.docChevron}>
                        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                </HStack>
            </button>

            {open && (
                <div className={cls.docEntryBody}>
                    {children}
                </div>
            )}
        </div>
    )
})

// ─── API Docs ─────────────────────────────────────────────────────────────────

export const ApiDocs = memo(() => {
    const { t } = useTranslation('reports')
    const base = window.location.origin + '/api'
    const headers = 'Authorization: Bearer oa_xxx\nContent-Type: application/json'
    const json = (value: unknown) => JSON.stringify(value, null, 2)
    const sampleCall = {
        id: 1042,
        channelId: '42',
        callerId: '+79991234567',
        callType: 'outgoing',
        assistantName: 'John Doe',
        source: 'external-api',
        projectId: 1,
        duration: 183,
        transcription: '...',
        analytics: {
            csat: 4,
            summary: '...',
            metrics: {
                customer_sentiment: 'Positive',
                greeting_quality: 85,
                success: true,
                custom_metrics: {},
                _topics: { tags: ['booking'], tag_names: { booking: 'Booking' } }
            }
        }
    }
    return (
        <VStack gap="16" max>
            <Text title={String(t('Документация API'))} bold size="l" />
            <HStack gap="8" wrap="wrap" className={cls.baseUrlRow}>
                <span className={cls.baseUrlLabel}>{String(t('apiDocsBaseUrl'))}</span>
                <code className={cls.baseUrlValue}>{base}</code>
            </HStack>
            <Text text={String(t('apiDocsAuth'))} />
            <Text text={String(t('apiDocsOptions'))} />
            <pre className={cls.codeBlock}>{json({ operatorName: 'John Doe', clientPhone: '+79991234567', callType: 'incoming', language: 'auto', consentObtained: true, consentSource: 'ivr' })}</pre>
            <Text text={String(t('apiDocsDirection'))} />
            <Text text={String(t('apiDocsAdvanced'))} />
            <div className={cls.docList}>
                <DocEntry method="POST" path="/operator-analytics/analyze" fullUrl={base + '/operator-analytics/analyze'} description={String(t('apiDocsUnified'))}>
                    <VStack gap="8" max>
                        <Text text={String(t('apiDocsSources'))} />
                        <pre className={cls.codeBlock}>{headers}</pre>
                        <pre className={cls.codeBlock}>{json({ url: 'https://example.com/call.mp3', callType: 'outgoing', sync: false })}</pre>
                        <pre className={cls.codeBlock}>{json({ file: 'BASE64_AUDIO', filename: 'call.mp3', callType: 'incoming', sync: true })}</pre>
                        <pre className={cls.codeBlock}>{json({ files: [{ data: 'BASE64_AUDIO', filename: 'call1.mp3' }, { data: 'BASE64_AUDIO', filename: 'call2.mp3' }], callType: 'outgoing' })}</pre>
                        <Text text={String(t('apiDocsSync'))} />
                        <Text text={String(t('apiDocsUrlResponse'))} />
                        <pre className={cls.codeBlock}>{json({ id: 42, filename: 'call.mp3', url: 'https://example.com/call.mp3', status: 'processing' })}</pre>
                        <Text text={String(t('apiDocsUrlBatch'))} />
                        <pre className={cls.codeBlock}>{json({ items: [{ id: 42, filename: 'call1.mp3', url: 'https://example.com/call1.mp3', status: 'processing' }] })}</pre>
                        <Text text={String(t('apiDocsBase64Response'))} />
                        <pre className={cls.codeBlock}>{json({ batchId: 'batch_1710000000_abc123', total: 1, items: [{ id: 42, filename: 'call.mp3', status: 'pending' }] })}</pre>
                        <Text text={String(t('apiDocsSyncResponse'))} />
                        <pre className={cls.codeBlock}>{json({ id: 42, filename: 'call.mp3', status: 'completed', operatorName: 'John Doe', clientPhone: '+79991234567', callType: 'outgoing', duration: 183, transcription: '...' })}</pre>
                    </VStack>
                </DocEntry>
                <DocEntry method="POST" path="/operator-analytics/analyze-file" fullUrl={base + '/operator-analytics/analyze-file'} description={String(t('Загрузка аудиофайла (single / batch)'))}>
                    <VStack gap="8" max>
                        <Text text={String(t('apiDocsMultipart'))} />
                        <pre className={cls.codeBlock}>{'curl -X POST ' + base + '/operator-analytics/analyze-file \\\n  -H "Authorization: Bearer oa_xxx" \\\n  -F "file=@/path/to/call.mp3" \\\n  -F "clientPhone=+79991234567" \\\n  -F "callType=outgoing"'}</pre>
                    </VStack>
                </DocEntry>
                <DocEntry method="POST" path="/operator-analytics/analyze-url" fullUrl={base + '/operator-analytics/analyze-url'} description={String(t('Анализ записи по URL (single / batch)'))}>
                    <VStack gap="8" max>
                        <Text text={String(t('apiDocsLegacyUrl'))} />
                        <pre className={cls.codeBlock}>{json({ urls: ['https://example.com/call1.mp3', 'https://example.com/call2.mp3'], operatorName: 'John Doe', callType: 'outgoing' })}</pre>
                    </VStack>
                </DocEntry>
                <DocEntry method="GET" path="/operator-analytics/results" fullUrl={base + '/operator-analytics/results'} description={String(t('Список результатов анализа'))}>
                    <VStack gap="8" max>
                        <Text text={String(t('apiDocsList'))} />
                        <pre className={cls.codeBlock}>{'curl "' + base + '/operator-analytics/results?page=1&limit=20&startDate=2026-10-01&endDate=2026-10-23" -H "Authorization: Bearer oa_xxx"'}</pre>
                        <pre className={cls.codeBlock}>{json({ data: [sampleCall], total: 156, page: 1, limit: 20 })}</pre>
                    </VStack>
                </DocEntry>
                <DocEntry method="GET" path="/operator-analytics/results/:id" fullUrl={base + '/operator-analytics/results/:id'} description={String(t('Результат анализа конкретного звонка'))}>
                    <VStack gap="8" max>
                        <Text text={String(t('apiDocsResult'))} />
                        <pre className={cls.codeBlock}>{json(sampleCall)}</pre>
                        <Text text={String(t('apiDocsPolling'))} />
                    </VStack>
                </DocEntry>
            </div>
            <Text title={String(t('apiDocsCompletionTitle'))} bold />
            <Text text={String(t('apiDocsCompletion'))} />
            <Text text={String(t('apiDocsBatchAuth'))} />
            <Text title={String(t('apiDocsLimitsTitle'))} bold />
            <Text text={String(t('apiDocsLimits'))} />
            <Text text={String(t('apiDocsErrors'))} />
        </VStack>
    )
})

// ─── Main ─────────────────────────────────────────────────────────────────────

export const OperatorApiTokens = memo(() => {
    const { t } = useTranslation('reports')
    const isAdmin = useSelector(isUserAdmin)
    const [filterUserId, setFilterUserId] = useState('')
    const { data: tokens, isLoading } = useListOperatorApiTokens(isAdmin ? (filterUserId || undefined) : undefined)
    const { data: allUsers } = useGetAllUsers(null, { skip: !isAdmin })
    const [revokeToken] = useRevokeOperatorApiToken()
    const [deleteToken] = useDeleteOperatorApiToken()
    const [showModal, setShowModal] = useState(false)

    const ownerNameById = useMemo(() => {
        const map: Record<string, string> = {}
        for (const user of allUsers || []) {
            map[String(user.id)] = user.name || user.email || String(user.id)
        }
        return map
    }, [allUsers])

    const handleRevoke = useCallback(async (id: string) => {
        try {
            await revokeToken(id).unwrap()
            toast.success(String(t('Токен отозван')))
        } catch (err: any) {
            if (!err?.status) toast.error(String(t('Ошибка сети')))
        }
    }, [revokeToken, t])

    const handleDelete = useCallback(async (id: string) => {
        try {
            await deleteToken(id).unwrap()
            toast.success(String(t('Токен удалён')))
        } catch (err: any) {
            if (!err?.status) toast.error(String(t('Ошибка сети')))
        }
    }, [deleteToken, t])

    return (
        <VStack gap={'24'} max className={cls.OperatorApiTokens}>
            <HStack max justify={'between'} align={'center'} wrap={'wrap'} gap={'16'}>
                <Text title={String(t('API Токены'))} size={'l'} bold />
                <Button
                    variant={'glass-action'}
                    addonLeft={<AddIcon fontSize={'small'} />}
                    onClick={() => { setShowModal(true) }}
                >
                    {String(t('Генерировать токен'))}
                </Button>
            </HStack>

            {isAdmin && (
                <ClientSelect
                    label={String(t('Клиент'))}
                    clientId={filterUserId}
                    allowAll
                    onChangeClient={setFilterUserId}
                />
            )}

            {isLoading
                ? [1, 2].map(i => <Skeleton key={i} variant={'rounded'} height={72} className={cls.skeleton} />)
                : (
                    <VStack gap={'8'} max>
                        {tokens?.length
                            ? tokens.map((tok: OperatorApiToken) => (
                                <TokenItem
                                    key={tok.id}
                                    token={tok}
                                    ownerLabel={isAdmin && !filterUserId
                                        ? ownerNameById[String(tok.userId ?? '')]
                                        : undefined}
                                    onRevoke={handleRevoke}
                                    onDelete={handleDelete}
                                />
                            ))
                            : (
                                <Card padding={'48'} max border={'partial'} variant={'glass'}>
                                    <VStack max align={'center'} justify={'center'} gap={'16'}>
                                        <KeyIcon sx={{ fontSize: 52, color: 'var(--icon-redesigned)', opacity: 0.4 }} />
                                        <Text align={'center'} title={String(t('Нет API токенов'))} />
                                        <Text align={'center'} text={String(t('Создайте токен для доступа к API'))} />
                                    </VStack>
                                </Card>
                            )
                        }
                    </VStack>
                )
            }

            <ApiDocs />

            <GenerateModal
                open={showModal}
                onClose={() => { setShowModal(false) }}
                ownerUserId={isAdmin ? (filterUserId || undefined) : undefined}
            />
        </VStack>
    )
})

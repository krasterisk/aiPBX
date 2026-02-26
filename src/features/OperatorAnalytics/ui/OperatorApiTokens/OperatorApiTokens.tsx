import { memo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
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
import { toast } from 'react-toastify'
import cls from './OperatorApiTokens.module.scss'

// ─── Token Item ──────────────────────────────────────────────────────────────

interface TokenItemProps {
    token: OperatorApiToken
    onRevoke: (id: string) => void   // PATCH /revoke — деактивация
    onDelete: (id: string) => void   // DELETE — физическое удаление
}

const TokenItem = memo(({ token, onRevoke, onDelete }: TokenItemProps) => {
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
                            <IconButton size={'small'} onClick={() => setConfirm(false)} className={cls.iconBtn}>
                                <span style={{ fontSize: 13 }}>✕</span>
                            </IconButton>
                        </HStack>
                    ) : (
                        <IconButton
                            size={'small'}
                            onClick={() => setConfirm(true)}
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
}

const GenerateModal = memo(({ open, onClose }: GenerateModalProps) => {
    const { t } = useTranslation('reports')
    const [generateToken, { isLoading }] = useGenerateOperatorApiToken()
    const [tokenName, setTokenName] = useState('')
    const [projectId, setProjectId] = useState('')
    const [generatedToken, setGeneratedToken] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleGenerate = useCallback(async () => {
        if (!tokenName.trim()) return
        try {
            const result = await generateToken({ name: tokenName.trim(), projectId: projectId || undefined }).unwrap()
            setGeneratedToken(result.token)
            setTokenName('')
            setProjectId('')
        } catch (err: any) {
            if (!err?.status) toast.error(String(t('Ошибка сети')))
        }
    }, [tokenName, projectId, generateToken, t])

    const handleCopy = useCallback(() => {
        if (!generatedToken) return
        navigator.clipboard.writeText(generatedToken).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
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
                                onChange={e => setTokenName(e.target.value)}
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
            setTimeout(() => setCopied(false), 2000)
        })
    }, [fullUrl])

    return (
        <div className={`${cls.docEntry} ${open ? cls.docEntryOpen : ''}`}>
            <button
                type={'button'}
                className={cls.docEntryHeader}
                onClick={() => setOpen(p => !p)}
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

const ApiDocs = memo(() => {
    const { t } = useTranslation('reports')
    const base = `${window.location.origin}/api`
    const [copied, setCopied] = useState(false)

    const handleCopyBase = useCallback(() => {
        navigator.clipboard.writeText(base).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }, [base])

    return (
        <VStack gap={'16'} max>
            {/* Title */}
            <Text title={String(t('Документация API'))} bold size={'l'} />

            {/* Base URL row */}
            <HStack gap={'12'} align={'center'} className={cls.baseUrlRow}>
                <span className={cls.baseUrlLabel}>{'Base URL'}</span>
                <code className={cls.baseUrlValue}>{base}</code>
                <button
                    type={'button'}
                    className={`${cls.baseUrlCopy} ${copied ? cls.baseUrlCopied : ''}`}
                    onClick={handleCopyBase}
                    title={String(t('Скопировать URL'))}
                >
                    {copied
                        ? <><ContentCopyIcon sx={{ fontSize: 14 }} />{` ${String(t('Скопировано'))}`}</>
                        : <><ContentCopyIcon sx={{ fontSize: 14 }} />{` ${String(t('Скопировать'))}`}</>
                    }
                </button>
            </HStack>

            {/* Note */}
            <div className={cls.docNote}>
                <KeyIcon sx={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6 }} />
                {String(t('Каждый токен привязан к конкретному проекту при генерации. Все звонки, загруженные через этот токен, автоматически попадают в привязанный проект. Разные проекты — разные токены.'))}
            </div>

            {/* Accordion */}
            <div className={cls.docList}>

                <DocEntry
                    method={'POST'}
                    path={'/operator-analytics/analyze-url'}
                    description={String(t('Анализ записи по URL (single / batch)'))}
                    fullUrl={`${base}/operator-analytics/analyze-url`}
                >
                    <VStack gap={'8'}>
                        <Text text={String(t('Загружает и анализирует аудиозапись(и) по прямой ссылке. Проект определяется автоматически из токена. Поддерживает одиночный URL (синхронно) и массив URL (асинхронно).'))} />
                        <Text text={String(t('Заголовки запроса:'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`Authorization: Bearer <${t('ваш_токен')}>
Content-Type: application/json`}</pre>
                        <Text text={String(t('Тело запроса:'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`{
  "url":          "https://example.com/call.mp3",  // ${t('одиночный URL (синхронно)')}
  "urls":         ["url1", "url2", "url3"],         // ${t('массив URL (асинхронно)')}
  "operatorName": "John Doe",                       // ${t('необязательно')}
  "clientPhone":  "+7 999 123-45-67",              // ${t('необязательно')}
  "language":     "auto"                           // auto | ru | en | de | zh | kz | uk
}`}</pre>
                        <Text text={String(t('Пример (одиночный URL — синхронно):'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`curl -X POST ${base}/operator-analytics/analyze-url \\
  -H "Authorization: Bearer oa_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-storage.com/call.mp3",
    "operatorName": "Иван Петров",
    "language": "ru"
  }'`}</pre>
                        <Text text={String(t('Пример (массив URL — асинхронно):'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`curl -X POST ${base}/operator-analytics/analyze-url \\
  -H "Authorization: Bearer oa_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "urls": [
      "https://your-storage.com/call1.mp3",
      "https://your-storage.com/call2.mp3",
      "https://your-storage.com/call3.mp3"
    ],
    "operatorName": "Иван Петров",
    "language": "ru"
  }'`}</pre>
                        <Text text={String(t('Ответ (batch):'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`{
  "items": [
    { "id": 42, "filename": "call1.mp3", "url": "https://...", "status": "processing" },
    { "id": 43, "filename": "call2.mp3", "url": "https://...", "status": "processing" }
  ]
}`}</pre>
                    </VStack>
                </DocEntry>

                <DocEntry
                    method={'POST'}
                    path={'/operator-analytics/analyze-file'}
                    description={String(t('Загрузка аудиофайла (single / batch)'))}
                    fullUrl={`${base}/operator-analytics/analyze-file`}
                >
                    <VStack gap={'8'}>
                        <Text text={String(t('Загружает аудиофайл(ы) через multipart/form-data. Проект определяется автоматически из токена. Поддерживает один или несколько файлов.'))} />
                        <Text text={String(t('Заголовки запроса:'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`Authorization: Bearer <${t('ваш_токен')}>
Content-Type: multipart/form-data`}</pre>
                        <Text text={String(t('Поля формы:'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`file          ${t('аудиофайл')} (MP3/WAV/OGG/M4A/FLAC/WebM, ${t('до')} 50 ${t('МБ')})  ${t('обязательно')}
operatorName  ${t('имя оператора')}                                       ${t('необязательно')}
clientPhone   ${t('номер телефона клиента')} (+7…)                        ${t('необязательно')}
language      auto | ru | en | de | zh | kz | uk                  ${t('по умолчанию')}: auto`}</pre>
                        <Text text={String(t('Пример (один файл):'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`curl -X POST ${base}/operator-analytics/analyze-file \\
  -H "Authorization: Bearer oa_xxx" \\
  -F "file=@/path/to/call.mp3" \\
  -F "operatorName=Иван Петров" \\
  -F "clientPhone=+79991234567" \\
  -F "language=ru"`}</pre>
                        <Text text={String(t('Ответ (batch):'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`{
  "items": [
    { "id": 42, "filename": "call1.mp3", "status": "processing" },
    { "id": 43, "filename": "call2.mp3", "status": "processing" }
  ]
}`}</pre>
                    </VStack>
                </DocEntry>

                <DocEntry
                    method={'GET'}
                    path={'/operator-analytics/results'}
                    description={String(t('Список результатов анализа'))}
                    fullUrl={`${base}/operator-analytics/results`}
                >
                    <VStack gap={'8'}>
                        <Text text={String(t('Возвращает список проанализированных звонков из проекта токена с пагинацией и фильтрами.'))} />
                        <Text text={String(t('Параметры запроса:'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`page       ${t('номер страницы')}   (${t('по умолчанию')}: 1)
limit      ${t('записей на стр.')}  (${t('по умолчанию')}: 20)
startDate  YYYY-MM-DD       (${t('фильтр по дате от')})
endDate    YYYY-MM-DD       (${t('фильтр по дате до')})`}</pre>
                        <Text text={String(t('Пример:'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`curl "${base}/operator-analytics/results?page=1&limit=20&startDate=2025-01-01" \\
  -H "Authorization: Bearer oa_xxx"`}</pre>
                        <Text text={String(t('Ответ:'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`{
  "data": [ ... ],
  "total": 156,
  "page": 1,
  "limit": 20
}`}</pre>
                    </VStack>
                </DocEntry>

                <DocEntry
                    method={'GET'}
                    path={'/operator-analytics/results/:id'}
                    description={String(t('Результат анализа конкретного звонка'))}
                    fullUrl={`${base}/operator-analytics/results/:id`}
                >
                    <VStack gap={'8'}>
                        <Text text={String(t('Возвращает детальный результат анализа включая транскрипт, метрики и резюме.'))} />
                        <Text text={String(t('Пример:'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`curl "${base}/operator-analytics/results/42" \\
  -H "Authorization: Bearer oa_xxx"`}</pre>
                        <Text text={String(t('Ответ:'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`{
  "id":            42,
  "status":        "completed",
  "operatorName":  "Иван Петров",
  "clientPhone":   "+79991234567",
  "duration":      183,
  "language":      "ru",
  "metrics": {
    "customer_sentiment":  "Positive",
    "csat":                85,
    "greeting_quality":    85,
    "script_compliance":   90,
    "politeness_empathy":  88,
    "active_listening":    76,
    "objection_handling":  70,
    "product_knowledge":   95,
    "problem_resolution":  80,
    "speech_clarity_pace": 82,
    "closing_quality":     78,
    "summary":             "..."
  },
  "transcript": "...",
  "summary":    "..."
}`}</pre>
                        <Text text={String(t('Статус:'))} bold size={'s'} />
                        <pre className={cls.codeBlock}>{`completed   — ${t('анализ завершён, все поля заполнены')}
processing  — ${t('ещё анализируется (metrics/transcript будут пустыми)')}
error       — ${t('ошибка анализа, см. errorMessage')}`}</pre>
                    </VStack>
                </DocEntry>

            </div>
        </VStack>
    )
})

// ─── Main ─────────────────────────────────────────────────────────────────────

export const OperatorApiTokens = memo(() => {
    const { t } = useTranslation('reports')
    const { data: tokens, isLoading } = useListOperatorApiTokens()
    const [revokeToken] = useRevokeOperatorApiToken()
    const [deleteToken] = useDeleteOperatorApiToken()
    const [showModal, setShowModal] = useState(false)

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
                    onClick={() => setShowModal(true)}
                >
                    {String(t('Генерировать токен'))}
                </Button>
            </HStack>

            {isLoading
                ? [1, 2].map(i => <Skeleton key={i} variant={'rounded'} height={72} className={cls.skeleton} />)
                : (
                    <VStack gap={'8'} max>
                        {tokens?.length
                            ? tokens.map((tok: OperatorApiToken) => (
                                <TokenItem
                                    key={tok.id}
                                    token={tok}
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

            <GenerateModal open={showModal} onClose={() => setShowModal(false)} />
        </VStack>
    )
})

import { memo, useCallback, useMemo, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox, FormControlLabel } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { toast } from 'react-toastify'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Card } from '@/shared/ui/redesigned/Card'
import { Textarea } from '@/shared/ui/mui/Textarea'
import {
    AlertConfig,
    DigestConfig,
    useSendOperatorProjectAlertTest,
} from '@/entities/Report'
import { TelegramSetupHelp } from './TelegramSetupHelp'
import cls from './ProjectWizard.module.scss'

interface WizardStepAlertSettingsProps {
    projectId?: string
    alertConfig: AlertConfig
    digestConfig: DigestConfig
    onChange: (config: AlertConfig) => void
}

function parseListInput (raw: string): string[] {
    return raw
        .split(/[,;\s]+/)
        .map(s => s.trim())
        .filter(Boolean)
}

export const WizardStep_AlertSettings = memo(({
    projectId,
    alertConfig,
    digestConfig,
    onChange,
}: WizardStepAlertSettingsProps) => {
    const { t } = useTranslation('reports')
    const [emailDraft, setEmailDraft] = useState('')
    const [chatDraft, setChatDraft] = useState('')
    const [sendTest, { isLoading: isSending }] = useSendOperatorProjectAlertTest()

    const patch = useCallback((partial: Partial<AlertConfig>) => {
        onChange({ ...alertConfig, ...partial })
    }, [alertConfig, onChange])

    const previewCsat = useMemo(() => String(t('ALERT_CSAT_PREVIEW', {
        days: alertConfig.csatDrop.windowDays,
        pct: alertConfig.csatDrop.dropPct,
        min: alertConfig.csatDrop.minCalls,
    })), [alertConfig.csatDrop, t])

    const previewNeg = useMemo(() => String(t('ALERT_NEGATIVE_PREVIEW', {
        days: alertConfig.negativeSpike.windowDays,
        pp: alertConfig.negativeSpike.spikePp,
        min: alertConfig.negativeSpike.minCalls,
    })), [alertConfig.negativeSpike, t])

    const addEmails = useCallback(() => {
        const next = Array.from(new Set([...alertConfig.emails, ...parseListInput(emailDraft)]))
            .filter(e => e.includes('@'))
            .slice(0, 10)
        patch({ emails: next })
        setEmailDraft('')
    }, [alertConfig.emails, emailDraft, patch])

    const addChats = useCallback(() => {
        const next = Array.from(new Set([
            ...alertConfig.telegramChatIds,
            ...parseListInput(chatDraft).filter(id => /^-?\d+$/.test(id)),
        ])).slice(0, 10)
        patch({ telegramChatIds: next })
        setChatDraft('')
    }, [alertConfig.telegramChatIds, chatDraft, patch])

    const onEmailKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addEmails()
        }
    }, [addEmails])

    const onChatKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addChats()
        }
    }, [addChats])

    const handleSendTest = useCallback(async () => {
        if (!projectId) {
            toast.error(String(t('ALERT_SAVE_FIRST')))
            return
        }
        if (!alertConfig.enabled) {
            toast.error(String(t('ALERT_ENABLE_FIRST')))
            return
        }
        const hasOwn = alertConfig.emails.length > 0 || alertConfig.telegramChatIds.length > 0
        const hasDigest = digestConfig.emails.length > 0 || digestConfig.telegramChatIds.length > 0
        if (!alertConfig.inheritRecipientsFromDigest && !hasOwn) {
            toast.error(String(t('ALERT_NEED_RECIPIENTS')))
            return
        }
        if (alertConfig.inheritRecipientsFromDigest && !hasDigest) {
            toast.error(String(t('ALERT_NEED_DIGEST_RECIPIENTS')))
            return
        }
        try {
            const result = await sendTest(projectId).unwrap()
            toast.success(String(t('ALERT_SENT_OK', {
                emailed: result.emailed,
                telegram: result.telegram,
            })))
        } catch (err: any) {
            const msg = err?.data?.message || err?.error || t('ALERT_SENT_ERROR')
            toast.error(String(msg))
        }
    }, [projectId, alertConfig, digestConfig, sendTest, t])

    return (
        <VStack gap={'16'} max>
            <Text text={String(t('ALERT_SETTINGS_HINT'))} size="s" />

            <FormControlLabel
                control={(
                    <Checkbox
                        checked={alertConfig.enabled}
                        onChange={(_, checked) => { patch({ enabled: checked }) }}
                        size="small"
                        sx={{ color: 'var(--icon-redesigned)', '&.Mui-checked': { color: 'var(--accent-redesigned)' } }}
                    />
                )}
                label={String(t('ALERT_ENABLED'))}
                sx={{ color: 'var(--text-redesigned)' }}
            />

            <FormControlLabel
                control={(
                    <Checkbox
                        checked={alertConfig.inheritRecipientsFromDigest}
                        onChange={(_, checked) => { patch({ inheritRecipientsFromDigest: checked }) }}
                        size="small"
                        sx={{ color: 'var(--icon-redesigned)', '&.Mui-checked': { color: 'var(--accent-redesigned)' } }}
                    />
                )}
                label={String(t('ALERT_INHERIT_DIGEST'))}
                sx={{ color: 'var(--text-redesigned)' }}
            />

            {!alertConfig.inheritRecipientsFromDigest && (
                <>
                    <VStack gap={'8'} max>
                        <Text text={String(t('ALERT_EMAILS'))} bold size="s" />
                        <HStack gap={'8'} max wrap="wrap">
                            {alertConfig.emails.map(email => (
                                <button
                                    key={email}
                                    type="button"
                                    className={cls.digestChip}
                                    onClick={() => {
                                        patch({ emails: alertConfig.emails.filter(e => e !== email) })
                                    }}
                                >
                                    {email} ×
                                </button>
                            ))}
                        </HStack>
                        <HStack gap={'8'} max>
                            <Textarea
                                label={String(t('DIGEST_EMAIL_PLACEHOLDER'))}
                                value={emailDraft}
                                onChange={e => { setEmailDraft(e.target.value) }}
                                onKeyDown={onEmailKeyDown}
                                size="small"
                                fullWidth
                                multiline={false}
                            />
                            <Button variant="outline" size="s" onClick={addEmails}>
                                {String(t('DIGEST_ADD'))}
                            </Button>
                        </HStack>
                    </VStack>

                    <VStack gap={'8'} max>
                        <Text text={String(t('ALERT_TELEGRAM'))} bold size="s" />
                        <TelegramSetupHelp />
                        <HStack gap={'8'} max wrap="wrap">
                            {alertConfig.telegramChatIds.map(id => (
                                <button
                                    key={id}
                                    type="button"
                                    className={cls.digestChip}
                                    onClick={() => {
                                        patch({
                                            telegramChatIds: alertConfig.telegramChatIds.filter(c => c !== id),
                                        })
                                    }}
                                >
                                    {id} ×
                                </button>
                            ))}
                        </HStack>
                        <HStack gap={'8'} max>
                            <Textarea
                                label={String(t('DIGEST_CHAT_PLACEHOLDER'))}
                                value={chatDraft}
                                onChange={e => { setChatDraft(e.target.value) }}
                                onKeyDown={onChatKeyDown}
                                size="small"
                                fullWidth
                                multiline={false}
                            />
                            <Button variant="outline" size="s" onClick={addChats}>
                                {String(t('DIGEST_ADD'))}
                            </Button>
                        </HStack>
                    </VStack>
                </>
            )}

            <Card variant="glass" border="partial" padding="16" max>
                <VStack gap={'12'} max>
                    <FormControlLabel
                        control={(
                            <Checkbox
                                checked={alertConfig.csatDrop.enabled}
                                onChange={(_, checked) => {
                                    patch({ csatDrop: { ...alertConfig.csatDrop, enabled: checked } })
                                }}
                                size="small"
                                sx={{ color: 'var(--icon-redesigned)', '&.Mui-checked': { color: 'var(--accent-redesigned)' } }}
                            />
                        )}
                        label={String(t('ALERT_CSAT_TITLE'))}
                        sx={{ color: 'var(--text-redesigned)' }}
                    />
                    <Text text={previewCsat} size="xs" />
                    <HStack gap={'8'} max wrap="wrap">
                        <Textarea
                            label={String(t('ALERT_DROP_PCT'))}
                            value={String(alertConfig.csatDrop.dropPct)}
                            onChange={e => {
                                const n = Number(e.target.value)
                                if (Number.isFinite(n)) {
                                    patch({
                                        csatDrop: {
                                            ...alertConfig.csatDrop,
                                            dropPct: Math.min(100, Math.max(1, Math.round(n))),
                                        },
                                    })
                                }
                            }}
                            size="small"
                            multiline={false}
                            type="number"
                        />
                        <Textarea
                            label={String(t('ALERT_WINDOW_DAYS'))}
                            value={String(alertConfig.csatDrop.windowDays)}
                            onChange={e => {
                                const n = Number(e.target.value)
                                if (Number.isFinite(n)) {
                                    patch({
                                        csatDrop: {
                                            ...alertConfig.csatDrop,
                                            windowDays: Math.min(90, Math.max(1, Math.round(n))),
                                        },
                                    })
                                }
                            }}
                            size="small"
                            multiline={false}
                            type="number"
                        />
                        <Textarea
                            label={String(t('ALERT_MIN_CALLS'))}
                            value={String(alertConfig.csatDrop.minCalls)}
                            onChange={e => {
                                const n = Number(e.target.value)
                                if (Number.isFinite(n)) {
                                    patch({
                                        csatDrop: {
                                            ...alertConfig.csatDrop,
                                            minCalls: Math.min(1000, Math.max(1, Math.round(n))),
                                        },
                                    })
                                }
                            }}
                            size="small"
                            multiline={false}
                            type="number"
                        />
                    </HStack>
                </VStack>
            </Card>

            <Card variant="glass" border="partial" padding="16" max>
                <VStack gap={'12'} max>
                    <FormControlLabel
                        control={(
                            <Checkbox
                                checked={alertConfig.negativeSpike.enabled}
                                onChange={(_, checked) => {
                                    patch({
                                        negativeSpike: { ...alertConfig.negativeSpike, enabled: checked },
                                    })
                                }}
                                size="small"
                                sx={{ color: 'var(--icon-redesigned)', '&.Mui-checked': { color: 'var(--accent-redesigned)' } }}
                            />
                        )}
                        label={String(t('ALERT_NEGATIVE_TITLE'))}
                        sx={{ color: 'var(--text-redesigned)' }}
                    />
                    <Text text={previewNeg} size="xs" />
                    <HStack gap={'8'} max wrap="wrap">
                        <Textarea
                            label={String(t('ALERT_SPIKE_PP'))}
                            value={String(alertConfig.negativeSpike.spikePp)}
                            onChange={e => {
                                const n = Number(e.target.value)
                                if (Number.isFinite(n)) {
                                    patch({
                                        negativeSpike: {
                                            ...alertConfig.negativeSpike,
                                            spikePp: Math.min(100, Math.max(1, Math.round(n))),
                                        },
                                    })
                                }
                            }}
                            size="small"
                            multiline={false}
                            type="number"
                        />
                        <Textarea
                            label={String(t('ALERT_WINDOW_DAYS'))}
                            value={String(alertConfig.negativeSpike.windowDays)}
                            onChange={e => {
                                const n = Number(e.target.value)
                                if (Number.isFinite(n)) {
                                    patch({
                                        negativeSpike: {
                                            ...alertConfig.negativeSpike,
                                            windowDays: Math.min(90, Math.max(1, Math.round(n))),
                                        },
                                    })
                                }
                            }}
                            size="small"
                            multiline={false}
                            type="number"
                        />
                        <Textarea
                            label={String(t('ALERT_MIN_CALLS'))}
                            value={String(alertConfig.negativeSpike.minCalls)}
                            onChange={e => {
                                const n = Number(e.target.value)
                                if (Number.isFinite(n)) {
                                    patch({
                                        negativeSpike: {
                                            ...alertConfig.negativeSpike,
                                            minCalls: Math.min(1000, Math.max(1, Math.round(n))),
                                        },
                                    })
                                }
                            }}
                            size="small"
                            multiline={false}
                            type="number"
                        />
                    </HStack>
                </VStack>
            </Card>

            <Card variant="glass" border="partial" padding="16" max>
                <VStack gap={'8'} max>
                    <FormControlLabel
                        control={(
                            <Checkbox
                                checked={alertConfig.budgetExceeded.enabled}
                                onChange={(_, checked) => {
                                    patch({ budgetExceeded: { enabled: checked } })
                                }}
                                size="small"
                                sx={{ color: 'var(--icon-redesigned)', '&.Mui-checked': { color: 'var(--accent-redesigned)' } }}
                            />
                        )}
                        label={String(t('ALERT_BUDGET_TITLE'))}
                        sx={{ color: 'var(--text-redesigned)' }}
                    />
                    <Text text={String(t('ALERT_BUDGET_HINT'))} size="xs" />
                </VStack>
            </Card>

            <Text text={String(t('ALERT_COOLDOWN_HINT'))} size="xs" />

            <Button
                variant="glass-action"
                addonLeft={<SendIcon fontSize="small" />}
                onClick={() => { void handleSendTest() }}
                disabled={isSending || !projectId}
            >
                {isSending ? String(t('ALERT_SENDING')) : String(t('ALERT_SEND_TEST'))}
            </Button>
        </VStack>
    )
})

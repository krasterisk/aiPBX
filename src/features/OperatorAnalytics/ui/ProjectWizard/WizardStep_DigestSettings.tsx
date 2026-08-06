import { memo, useCallback, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox, FormControlLabel, MenuItem } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { toast } from 'react-toastify'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import {
    DigestConfig,
    DigestReportWindow,
    DigestSchedule,
    useSendOperatorProjectDigest,
} from '@/entities/Report'
import { TelegramSetupHelp } from './TelegramSetupHelp'
import cls from './ProjectWizard.module.scss'

interface WizardStepDigestSettingsProps {
    projectId?: string
    digestConfig: DigestConfig
    onChange: (config: DigestConfig) => void
}

function parseListInput(raw: string): string[] {
    return raw
        .split(/[,;\s]+/)
        .map(s => s.trim())
        .filter(Boolean)
}

export const WizardStep_DigestSettings = memo(({
    projectId,
    digestConfig,
    onChange,
}: WizardStepDigestSettingsProps) => {
    const { t } = useTranslation('reports')
    const [emailDraft, setEmailDraft] = useState('')
    const [chatDraft, setChatDraft] = useState('')
    const [sendDigest, { isLoading: isSending }] = useSendOperatorProjectDigest()

    const patch = useCallback((partial: Partial<DigestConfig>) => {
        onChange({ ...digestConfig, ...partial })
    }, [digestConfig, onChange])

    const addEmails = useCallback(() => {
        const next = Array.from(new Set([...digestConfig.emails, ...parseListInput(emailDraft)]))
            .filter(e => e.includes('@'))
            .slice(0, 10)
        patch({ emails: next })
        setEmailDraft('')
    }, [digestConfig.emails, emailDraft, patch])

    const addChats = useCallback(() => {
        const next = Array.from(new Set([
            ...digestConfig.telegramChatIds,
            ...parseListInput(chatDraft).filter(id => /^-?\d+$/.test(id)),
        ])).slice(0, 10)
        patch({ telegramChatIds: next })
        setChatDraft('')
    }, [digestConfig.telegramChatIds, chatDraft, patch])

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

    const handleSendNow = useCallback(async () => {
        if (!projectId) {
            toast.error(String(t('DIGEST_SAVE_FIRST')))
            return
        }
        if (!digestConfig.emails.length && !digestConfig.telegramChatIds.length) {
            toast.error(String(t('DIGEST_NEED_RECIPIENTS')))
            return
        }
        try {
            const result = await sendDigest(projectId).unwrap()
            toast.success(String(t('DIGEST_SENT_OK', {
                emailed: result.emailed,
                telegram: result.telegram,
            })))
        } catch (err: any) {
            const msg = err?.data?.message || err?.error || t('DIGEST_SENT_ERROR')
            toast.error(String(msg))
        }
    }, [projectId, digestConfig, sendDigest, t])

    return (
        <VStack gap={'16'} max>
            <Text text={String(t('DIGEST_SETTINGS_HINT'))} size="s" />

            <FormControlLabel
                control={(
                    <Checkbox
                        checked={digestConfig.enabled}
                        onChange={(_, checked) => { patch({ enabled: checked }) }}
                        size="small"
                        sx={{ color: 'var(--icon-redesigned)', '&.Mui-checked': { color: 'var(--accent-redesigned)' } }}
                    />
                )}
                label={String(t('DIGEST_ENABLED'))}
                sx={{ color: 'var(--text-redesigned)' }}
            />

            <VStack gap={'8'} max>
                <Text text={String(t('DIGEST_EMAILS'))} bold size="s" />
                <HStack gap={'8'} max wrap="wrap">
                    {digestConfig.emails.map(email => (
                        <button
                            key={email}
                            type="button"
                            className={cls.digestChip}
                            onClick={() => {
                                patch({ emails: digestConfig.emails.filter(e => e !== email) })
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
                <Text text={String(t('DIGEST_TELEGRAM'))} bold size="s" />
                <TelegramSetupHelp />
                <HStack gap={'8'} max wrap="wrap">
                    {digestConfig.telegramChatIds.map(id => (
                        <button
                            key={id}
                            type="button"
                            className={cls.digestChip}
                            onClick={() => {
                                patch({
                                    telegramChatIds: digestConfig.telegramChatIds.filter(c => c !== id),
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

            <Textarea
                select
                label={String(t('DIGEST_SCHEDULE'))}
                value={digestConfig.schedule}
                onChange={e => { patch({ schedule: e.target.value as DigestSchedule }) }}
                size="small"
                fullWidth
                multiline={false}
            >
                <MenuItem value="daily">{String(t('DIGEST_SCHEDULE_DAILY'))}</MenuItem>
                <MenuItem value="weekly">{String(t('DIGEST_SCHEDULE_WEEKLY'))}</MenuItem>
                <MenuItem value="monthly">{String(t('DIGEST_SCHEDULE_MONTHLY'))}</MenuItem>
            </Textarea>

            {digestConfig.schedule === 'weekly' && (
                <Textarea
                    select
                    label={String(t('DIGEST_WEEKDAY'))}
                    value={String(digestConfig.weeklyDay ?? 1)}
                    onChange={e => { patch({ weeklyDay: Number(e.target.value) }) }}
                    size="small"
                    fullWidth
                    multiline={false}
                >
                    {[1, 2, 3, 4, 5, 6, 7].map(d => (
                        <MenuItem key={d} value={String(d)}>
                            {String(t(`DIGEST_WEEKDAY_${d}`))}
                        </MenuItem>
                    ))}
                </Textarea>
            )}

            {digestConfig.schedule === 'monthly' && (
                <Textarea
                    label={String(t('DIGEST_MONTH_DAY'))}
                    value={String(digestConfig.monthlyDay ?? 1)}
                    onChange={e => {
                        const n = Number(e.target.value)
                        if (Number.isFinite(n)) patch({ monthlyDay: Math.min(28, Math.max(1, n)) })
                    }}
                    size="small"
                    fullWidth
                    multiline={false}
                    type="number"
                />
            )}

            <Textarea
                label={String(t('DIGEST_SEND_HOUR'))}
                value={String(digestConfig.sendHour ?? 9)}
                onChange={e => {
                    const n = Number(e.target.value)
                    if (Number.isFinite(n)) patch({ sendHour: Math.min(23, Math.max(0, n)) })
                }}
                size="small"
                fullWidth
                multiline={false}
                type="number"
            />

            <Textarea
                select
                label={String(t('DIGEST_REPORT_WINDOW'))}
                value={digestConfig.reportWindow}
                onChange={e => { patch({ reportWindow: e.target.value as DigestReportWindow }) }}
                size="small"
                fullWidth
                multiline={false}
            >
                <MenuItem value="last_7_days">{String(t('DIGEST_WINDOW_7'))}</MenuItem>
                <MenuItem value="last_30_days">{String(t('DIGEST_WINDOW_30'))}</MenuItem>
                <MenuItem value="previous_calendar_month">{String(t('DIGEST_WINDOW_MONTH'))}</MenuItem>
            </Textarea>

            <Button
                variant="glass-action"
                addonLeft={<SendIcon fontSize="small" />}
                onClick={() => { void handleSendNow() }}
                disabled={isSending || !projectId}
            >
                {isSending ? String(t('DIGEST_SENDING')) : String(t('DIGEST_SEND_NOW'))}
            </Button>
        </VStack>
    )
})

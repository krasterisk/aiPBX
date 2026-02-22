import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Checkbox, FormControlLabel } from '@mui/material'
import WebhookIcon from '@mui/icons-material/Webhook'
import SendIcon from '@mui/icons-material/Send'
import { WebhookEvent } from '@/entities/Report'
import cls from './ProjectWizard.module.scss'

const AVAILABLE_EVENTS: Array<{ value: WebhookEvent; labelKey: string }> = [
    { value: 'analysis.completed', labelKey: 'Событие: анализ завершён' },
    { value: 'analysis.error', labelKey: 'Событие: ошибка анализа' },
]

interface WizardStep4Props {
    webhookUrl: string
    webhookEvents: WebhookEvent[]
    onChangeUrl: (url: string) => void
    onChangeEvents: (events: WebhookEvent[]) => void
}

export const WizardStep4_Webhook = memo(({ webhookUrl, webhookEvents, onChangeUrl, onChangeEvents }: WizardStep4Props) => {
    const { t } = useTranslation('reports')

    const handleToggleEvent = useCallback((event: WebhookEvent) => {
        const has = webhookEvents.includes(event)
        if (has) {
            onChangeEvents(webhookEvents.filter(e => e !== event))
        } else {
            onChangeEvents([...webhookEvents, event])
        }
    }, [webhookEvents, onChangeEvents])

    const handleTestWebhook = useCallback(() => {
        // Stub: would POST to webhook URL
        alert(`Test webhook → ${webhookUrl}`)
    }, [webhookUrl])

    return (
        <VStack gap={'16'} max>
            <Text title={String(t('Webhooks'))} bold />
            <Text text={String(t('Настройте уведомления о событиях проекта'))} />

            <div className={cls.webhookSection}>
                <Textarea
                    label={String(t('URL вебхука'))}
                    value={webhookUrl}
                    onChange={e => onChangeUrl(e.target.value)}
                    placeholder={'https://your-api.com/webhook'}
                    size={'small'}
                    fullWidth
                    multiline={false}
                    InputProps={{
                        startAdornment: <WebhookIcon sx={{ mr: 1, color: 'var(--icon-redesigned)' }} fontSize={'small'} />
                    }}
                />

                <VStack gap={'8'} max>
                    <Text text={String(t('События'))} bold size={'s'} />
                    {AVAILABLE_EVENTS.map(evt => (
                        <FormControlLabel
                            key={evt.value}
                            control={
                                <Checkbox
                                    checked={webhookEvents.includes(evt.value)}
                                    onChange={() => handleToggleEvent(evt.value)}
                                    size={'small'}
                                    sx={{ color: 'var(--icon-redesigned)', '&.Mui-checked': { color: 'var(--accent-redesigned)' } }}
                                />
                            }
                            label={String(t(evt.labelKey))}
                            sx={{ color: 'var(--text-redesigned)' }}
                        />
                    ))}
                </VStack>

                {webhookUrl && (
                    <Button
                        variant={'outline'}
                        addonLeft={<SendIcon fontSize={'small'} />}
                        onClick={handleTestWebhook}
                    >
                        {String(t('Тест вебхука'))}
                    </Button>
                )}
            </div>
        </VStack>
    )
})

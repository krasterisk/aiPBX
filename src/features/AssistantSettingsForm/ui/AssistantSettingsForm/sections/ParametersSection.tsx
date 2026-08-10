import { memo, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Tooltip, Typography } from '@mui/material'
import { Info } from 'lucide-react'
import { Input } from '@/shared/ui/mui/Input'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Slider } from '@/shared/ui/mui/Slider'
import { ModelSelect, VoiceSelect, Assistant, getAssistantFormData } from '@/entities/Assistants'
import { isUserAdmin } from '@/entities/User'
import cls from '../AssistantSettingsForm.module.scss'

interface ParametersSectionProps {
    onChangeText: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onChangeSelect: (field: keyof Assistant) => (event: any, newValue: string) => void
}

export const ParametersSection = memo((props: ParametersSectionProps) => {
    const { onChangeText, onChangeSelect } = props
    const { t } = useTranslation(['playground', 'assistants'])
    const isAdmin = useSelector(isUserAdmin)
    const formFields = useSelector(getAssistantFormData)
    const isNonRealtime = formFields?.pipelineMode === 'non-realtime'
    const temperature = parseFloat(formFields?.temperature || '0.8') || 0.8

    const handleTemperatureChange = (value: number) => {
        const event = {
            target: { value: String(value) },
        } as ChangeEvent<HTMLInputElement>
        onChangeText('temperature')(event)
    }

    return (
        <div className={cls.fieldsGrid}>
            <div className={cls.fullWidth}>
                <Input
                    label={t('Наименование ассистента', { ns: 'assistants' }) ?? ''}
                    onChange={onChangeText('name')}
                    data-testid="AssistantSettingsForm.name"
                    value={formFields?.name || ''}
                    placeholder={t('Название вашего ассистента', { ns: 'assistants' }) ?? ''}
                    required
                    size="small"
                    fullWidth
                />
            </div>

            {!isNonRealtime && (
                <>
                    <ModelSelect
                        label={String(t('Модель'))}
                        value={formFields?.model || ''}
                        onChangeValue={onChangeSelect('model')}
                        required
                        fullWidth
                    />
                    <VoiceSelect
                        label={String(t('Голос'))}
                        value={formFields?.voice ?? ''}
                        model={formFields?.model}
                        onChangeValue={onChangeSelect('voice')}
                        required
                    />
                </>
            )}

            <div className={`${cls.sliderBlock} ${cls.fullWidth}`}>
                <div className={cls.sliderHeader}>
                    <span className={cls.sliderLabel}>
                        {t('Температура')}
                        <Tooltip title={t('tooltip_temperature')} arrow placement="top">
                            <span className={cls.helpIcon}><Info size={14} /></span>
                        </Tooltip>
                    </span>
                    <Typography className={cls.sliderValue} component="span">
                        {temperature.toFixed(1)}
                    </Typography>
                </div>
                <Slider
                    value={temperature}
                    onChange={handleTemperatureChange}
                    min={0.6}
                    max={1.2}
                    step={0.1}
                    size="small"
                />
            </div>

            {isAdmin && (
                <>
                    <Textarea
                        label={t('Максимальное количество токенов в ответе', { ns: 'assistants' }) ?? ''}
                        onChange={onChangeText('max_response_output_tokens')}
                        value={formFields?.max_response_output_tokens || ''}
                        minRows={1}
                        size="small"
                        placeholder="4096/inf"
                    />
                    <Textarea
                        label={t('Модель распознавания речи', { ns: 'assistants' }) ?? ''}
                        onChange={onChangeText('input_audio_transcription_model')}
                        value={formFields?.input_audio_transcription_model || ''}
                        minRows={1}
                        size="small"
                    />
                    <Textarea
                        label={t('Язык распознавания речи', { ns: 'assistants' }) ?? ''}
                        onChange={onChangeText('input_audio_transcription_language')}
                        value={formFields?.input_audio_transcription_language || ''}
                        minRows={1}
                        size="small"
                    />
                    <Textarea
                        label={t('Модель синтеза речи', { ns: 'assistants' }) ?? ''}
                        onChange={onChangeText('output_audio_transcription_model')}
                        value={formFields?.output_audio_transcription_model || ''}
                        minRows={1}
                        size="small"
                    />
                    {!isNonRealtime && (
                        <>
                            <Textarea
                                label={t('Формат входящего аудио', { ns: 'assistants' }) ?? ''}
                                onChange={onChangeText('input_audio_format')}
                                value={formFields?.input_audio_format || ''}
                                minRows={1}
                                size="small"
                            />
                            <Textarea
                                label={t('Формат исходящего аудио', { ns: 'assistants' }) ?? ''}
                                onChange={onChangeText('output_audio_format')}
                                value={formFields?.output_audio_format || ''}
                                minRows={1}
                                size="small"
                            />
                        </>
                    )}
                </>
            )}

            <div className={cls.fullWidth}>
                <Textarea
                    label={t('Комментарий', { ns: 'assistants' }) ?? ''}
                    onChange={onChangeText('comment')}
                    value={formFields?.comment || ''}
                    placeholder={t('Добавьте комментарий (необязательно)', { ns: 'assistants' }) ?? ''}
                    minRows={2}
                    multiline
                    size="small"
                    fullWidth
                />
            </div>
        </div>
    )
})

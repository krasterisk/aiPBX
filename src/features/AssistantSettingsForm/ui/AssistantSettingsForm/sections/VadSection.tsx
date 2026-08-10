import { memo, ChangeEvent, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Tooltip, Typography } from '@mui/material'
import { Info } from 'lucide-react'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Check } from '@/shared/ui/mui/Check'
import { Slider } from '@/shared/ui/mui/Slider'
import { Assistant, getAssistantFormData, assistantFormActions } from '@/entities/Assistants'
import { isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import cls from '../AssistantSettingsForm.module.scss'

interface VadSectionProps {
    onChangeText: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onChangeCheckbox: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement>) => void
}

interface VadParameter {
    field: keyof Assistant
    labelKey: string
    tooltipKey: string
    min: number
    max: number
    step: number
    unit: string
}

const vadTypes = [
    { value: 'server_vad', label: 'Server VAD' },
    { value: 'none', label: 'None' },
]

const noiseReductionTypes = [
    { value: 'none', label: 'None' },
    { value: 'near_field', label: 'Near Field' },
    { value: 'far_field', label: 'Far Field' },
]

export const VadSection = memo((props: VadSectionProps) => {
    const { onChangeText, onChangeCheckbox } = props
    const { t } = useTranslation(['playground', 'assistants'])
    const isAdmin = useSelector(isUserAdmin)
    const formFields = useSelector(getAssistantFormData)
    const dispatch = useAppDispatch()
    const isNonRealtime = formFields?.pipelineMode === 'non-realtime'

    const vadParameters: VadParameter[] = [
        {
            field: 'turn_detection_threshold',
            labelKey: 'Порог',
            tooltipKey: 'tooltip_threshold',
            min: 0,
            max: 1,
            step: 0.01,
            unit: '',
        },
        {
            field: 'turn_detection_prefix_padding_ms',
            labelKey: 'Префиксный отступ (мс)',
            tooltipKey: 'tooltip_prefix_padding',
            min: 0,
            max: 1000,
            step: 50,
            unit: t('мс'),
        },
        {
            field: 'turn_detection_silence_duration_ms',
            labelKey: 'Длительность тишины (мс)',
            tooltipKey: 'tooltip_silence_duration',
            min: 100,
            max: 5000,
            step: 100,
            unit: t('мс'),
        },
        {
            field: 'idle_timeout_ms',
            labelKey: 'Время простоя (мс)',
            tooltipKey: 'tooltip_idle_timeout',
            min: 6000,
            max: 60000,
            step: 1000,
            unit: t('мс'),
        },
    ]

    const getValue = (field: keyof Assistant, defaultValue: number): number => {
        const value = formFields?.[field]
        if (value) return parseFloat(String(value))
        if (field === 'idle_timeout_ms') return 10000
        return defaultValue
    }

    const handleSliderChange = (field: keyof Assistant) => (value: number) => {
        const event = {
            target: { value: String(value) },
        } as ChangeEvent<HTMLInputElement>
        onChangeText(field)(event)
    }

    const handleVadTypeChange = useCallback((_: any, newValue: { value: string } | null) => {
        dispatch(assistantFormActions.updateForm({
            turn_detection_type: newValue?.value || '',
        }))
    }, [dispatch])

    const handleNoiseReductionChange = useCallback((_: any, newValue: { value: string } | null) => {
        dispatch(assistantFormActions.updateForm({
            input_audio_noise_reduction: newValue?.value || 'near_field',
        }))
    }, [dispatch])

    useEffect(() => {
        if (isAdmin && formFields && !formFields.input_audio_noise_reduction) {
            dispatch(assistantFormActions.updateForm({
                input_audio_noise_reduction: 'near_field',
            }))
        }
    }, [isAdmin, formFields, dispatch])

    const currentVadType = formFields?.turn_detection_type || ''
    const currentNoiseReduction = formFields?.input_audio_noise_reduction || 'near_field'

    return (
        <div className={cls.fieldsGrid}>
            {isAdmin && (
                <>
                    <Combobox
                        label={t('Тип VAD', { ns: 'assistants' }) ?? ''}
                        options={vadTypes}
                        value={vadTypes.find(o => o.value === currentVadType) || null}
                        onChange={handleVadTypeChange}
                        getOptionLabel={(option: { label: string }) => option.label}
                        isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                        fullWidth
                        size="small"
                    />
                    {!isNonRealtime && (
                        <Combobox
                            label={t('Тип определения шума (Voice Detection Type)', { ns: 'assistants' }) ?? ''}
                            options={noiseReductionTypes}
                            value={noiseReductionTypes.find(o => o.value === currentNoiseReduction) || null}
                            onChange={handleNoiseReductionChange}
                            getOptionLabel={(option: { label: string }) => option.label}
                            isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                            fullWidth
                            size="small"
                        />
                    )}
                    {!isNonRealtime && (
                        <div className={cls.fullWidth}>
                            <Textarea
                                label={t('Семантический VAD', { ns: 'assistants' }) ?? ''}
                                onChange={onChangeText('semantic_eagerness')}
                                value={formFields?.semantic_eagerness || ''}
                                minRows={1}
                                size="small"
                            />
                        </div>
                    )}
                </>
            )}

            {!isNonRealtime && (
                <div className={`${cls.checkStack} ${cls.fullWidth}`}>
                    <Check
                        checked={formFields?.interrupt_response ?? true}
                        onChange={onChangeCheckbox('interrupt_response')}
                        label={
                            <span className={cls.sliderLabel}>
                                {t('Прерывание речи')}
                                <Tooltip title={t('interruptResponseTooltip')} arrow placement="top">
                                    <span className={cls.helpIcon}><Info size={14} /></span>
                                </Tooltip>
                            </span>
                        }
                    />
                </div>
            )}

            {vadParameters.map((param) => {
                const value = getValue(param.field, param.min)
                return (
                    <div key={param.field} className={`${cls.sliderBlock} ${cls.fullWidth}`}>
                        <div className={cls.sliderHeader}>
                            <span className={cls.sliderLabel}>
                                {t(param.labelKey)}
                                <Tooltip title={t(param.tooltipKey)} arrow placement="top">
                                    <span className={cls.helpIcon}><Info size={14} /></span>
                                </Tooltip>
                            </span>
                            <Typography className={cls.sliderValue} component="span">
                                {`${value}${param.unit}`}
                            </Typography>
                        </div>
                        <Slider
                            value={value}
                            onChange={handleSliderChange(param.field)}
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            size="small"
                        />
                    </div>
                )
            })}
        </div>
    )
})

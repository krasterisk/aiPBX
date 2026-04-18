import { memo, ChangeEvent, useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Check } from '@/shared/ui/mui/Check'
import { Slider, Typography, Tooltip, Collapse } from '@mui/material'
import { Info } from 'lucide-react'
import { Assistant, getAssistantFormData, assistantFormActions } from '@/entities/Assistants'
import { isUserAdmin } from '@/entities/User'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { Button } from '@/shared/ui/redesign-v3/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import cls from './VadSettingsCard.module.scss'

interface VadSettingsCardProps {
    className?: string
    onChangeTextHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onChangeSelectHandler?: (field: keyof Assistant) => (event: any, newValue: string) => void
    onChangeCheckboxHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement>) => void
    initialExpanded?: boolean
}

interface ModelParameter {
    field: keyof Assistant
    labelKey: string
    tooltipKey: string
    min: number
    max: number
    step: number
    unit: string
    marks: Array<{ value: number, label: string }>
}

const vadTypes = [
    { value: 'server_vad', label: 'Server VAD' },
    { value: 'none', label: 'None' }
]

const noiseReductionTypes = [
    { value: 'none', label: 'None' },
    { value: 'near_field', label: 'Near Field' },
    { value: 'far_field', label: 'Far Field' }
]

export const VadSettingsCard = memo((props: VadSettingsCardProps) => {
    const {
        className,
        onChangeTextHandler,
        onChangeCheckboxHandler,
        initialExpanded = false,
    } = props

    const { t } = useTranslation('assistants')
    const isAdmin = useSelector(isUserAdmin)
    const formFields = useSelector(getAssistantFormData)
    const dispatch = useAppDispatch()
    const [expanded, setExpanded] = useState(initialExpanded)

    const isNonRealtime = formFields?.pipelineMode === 'non-realtime'

    const handleExpandClick = useCallback(() => {
        setExpanded((prev) => !prev)
    }, [])

    const vadParameters: ModelParameter[] = [
        {
            field: 'turn_detection_threshold',
            labelKey: 'Порог обнаружения',
            tooltipKey: 'tooltip_vad_threshold',
            min: 0,
            max: 1,
            step: 0.01,
            unit: '',
            marks: [
                { value: 0, label: '0' },
                { value: 0.5, label: '0.5' },
                { value: 1, label: '1' }
            ]
        },
        {
            field: 'turn_detection_prefix_padding_ms',
            labelKey: 'Длительность аудио',
            tooltipKey: 'tooltip_audio_duration',
            min: 0,
            max: 1000,
            step: 50,
            unit: t('ms'),
            marks: [
                { value: 0, label: '0' },
                { value: 500, label: '500' },
                { value: 1000, label: '1K' }
            ]
        },
        {
            field: 'turn_detection_silence_duration_ms',
            labelKey: 'Тишина',
            tooltipKey: 'tooltip_silence_duration',
            min: 100,
            max: 5000,
            step: 100,
            unit: t('ms'),
            marks: [
                { value: 100, label: '100' },
                { value: 2500, label: '2.5K' },
                { value: 5000, label: '5K' }
            ]
        },
        {
            field: 'idle_timeout_ms',
            labelKey: 'Время простоя',
            tooltipKey: 'tooltip_idle_timeout',
            min: 6000,
            max: 60000,
            step: 1000,
            unit: t('ms'),
            marks: [
                { value: 6000, label: '6K' },
                { value: 30000, label: '30K' },
                { value: 60000, label: '60K' }
            ]
        }
    ]

    const handleSliderChange = (field: keyof Assistant) => (_: Event, value: number | number[]) => {
        const newValue = Array.isArray(value) ? value[0] : value
        const event = {
            target: { value: String(newValue) }
        } as ChangeEvent<HTMLInputElement>
        onChangeTextHandler?.(field)(event)
    }

    const getValue = (field: keyof Assistant, defaultValue: number): number => {
        const value = formFields?.[field]
        if (value) {
            return parseFloat(String(value))
        }
        if (field === 'idle_timeout_ms') {
            return 10000
        }
        return defaultValue
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

    // Set default value for noise reduction if null and admin
    useEffect(() => {
        if (isAdmin && formFields && !formFields.input_audio_noise_reduction) {
            dispatch(assistantFormActions.updateForm({
                input_audio_noise_reduction: 'near_field'
            }))
        }
    }, [isAdmin, formFields, dispatch])

    const currentVadType = formFields?.turn_detection_type || ''
    const currentNoiseReduction = formFields?.input_audio_noise_reduction || 'near_field'

    return (
        <div className={classNames(cls.VadSettingsCard, {}, [className])}>
            <HStack
                max
                justify="between"
                align="center"
                className={cls.header}
                onClick={handleExpandClick}
            >
                <HStack gap="8" align="center">
                    <GraphicEqIcon className={cls.headerIcon} />
                    <Text
                        title={t('Автоматическое обнаружение голоса (VAD)')}
                        className={cls.cardTitle}
                        bold
                    />
                </HStack>

                <Button
                    className={classNames(cls.expandButton, { [cls.expanded]: expanded })}
                    aria-expanded={expanded}
                    aria-label={t('Показать больше') || 'Show more'}
                    size="m"
                    variant="clear"
                    square
                >
                    <ExpandMoreIcon />
                </Button>
            </HStack>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <VStack max gap="24" className={cls.content}>
                    
                    {isAdmin && (
                        <VStack max gap="16">
                            <Combobox
                                label={t('Тип VAD') ?? ''}
                                options={vadTypes}
                                value={vadTypes.find(o => o.value === currentVadType) || null}
                                onChange={handleVadTypeChange}
                                getOptionLabel={(option: { label: string }) => option.label}
                                isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                                fullWidth
                            />

                            {!isNonRealtime && (
                                <Combobox
                                    label={t('Тип определения шума (Voice Detection Type)') ?? ''}
                                    options={noiseReductionTypes}
                                    value={noiseReductionTypes.find(o => o.value === currentNoiseReduction) || null}
                                    onChange={handleNoiseReductionChange}
                                    getOptionLabel={(option: { label: string }) => option.label}
                                    isOptionEqualToValue={(option: { value: string }, val: { value: string }) => option.value === val.value}
                                    fullWidth
                                />
                            )}

                            {!isNonRealtime && (
                                <Textarea
                                    label={t('Семантический VAD') ?? ''}
                                    onChange={onChangeTextHandler?.('semantic_eagerness')}
                                    data-testid="AssistantForm.semantic_eagerness"
                                    value={formFields?.semantic_eagerness || ''}
                                    minRows={1}
                                />
                            )}
                        </VStack>
                    )}

                    {!isNonRealtime && (
                        <Check
                            checked={formFields?.interrupt_response ?? true}
                            onChange={onChangeCheckboxHandler?.('interrupt_response')}
                            label={
                                <HStack gap="8" align="center">
                                    {t('Прерывание речи')}
                                    <Tooltip
                                        title={t('interruptResponseTooltip')}
                                        arrow
                                        placement="top"
                                        enterTouchDelay={0}
                                        leaveTouchDelay={3000}
                                        slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                                    >
                                        <span className={cls.helpIcon}><Info size={16} /></span>
                                    </Tooltip>
                                </HStack>
                            }
                        />
                    )}

                    {vadParameters.map((param) => {
                        const value = getValue(param.field, param.min)

                        return (
                            <VStack key={param.field} max gap="8">
                                <HStack max justify="between" align="center">
                                    <HStack gap="8" align="center">
                                        <Typography className={cls.label}>
                                            {t(param.labelKey)}
                                        </Typography>
                                        <Tooltip
                                            title={t(param.tooltipKey)}
                                            arrow
                                            placement="top"
                                            enterTouchDelay={0}
                                            leaveTouchDelay={3000}
                                            slotProps={{ popper: { modifiers: [{ name: 'preventOverflow', options: { boundary: 'window' } }] } }}
                                        >
                                            <span className={cls.helpIcon}><Info size={16} /></span>
                                        </Tooltip>
                                    </HStack>
                                    <Text
                                        text={`${value}${param.unit}`}
                                        className={cls.value}
                                        bold
                                    />
                                </HStack>

                                <Slider
                                    value={value}
                                    onChange={handleSliderChange(param.field)}
                                    min={param.min}
                                    max={param.max}
                                    step={param.step}
                                    marks={param.marks}
                                    className={cls.slider}
                                    sx={{
                                        color: 'var(--accent-redesigned)',
                                        '& .MuiSlider-thumb': {
                                            backgroundColor: 'var(--accent-redesigned)',
                                            border: '2px solid var(--light-bg-redesigned)',
                                            boxShadow: 'var(--shadow-accent-sm)',
                                            '&:hover, &.Mui-focusVisible': {
                                                boxShadow: 'var(--glow-accent)',
                                            },
                                        },
                                        '& .MuiSlider-track': {
                                            background: 'linear-gradient(90deg, var(--accent-redesigned), var(--icon-redesigned))',
                                            border: 'none',
                                        },
                                        '& .MuiSlider-rail': {
                                            backgroundColor: 'var(--divider-solid)',
                                            opacity: 0.3,
                                        },
                                        '& .MuiSlider-mark': {
                                            backgroundColor: 'var(--hint-redesigned)',
                                        },
                                        '& .MuiSlider-markLabel': {
                                            color: 'var(--hint-redesigned)',
                                            fontSize: '12px',
                                        }
                                    }}
                                />
                            </VStack>
                        )
                    })}
                </VStack>
            </Collapse>
        </div>
    )
})

import { memo, ChangeEvent, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Slider, Typography, Tooltip, Collapse } from '@mui/material'
import { Info } from 'lucide-react'
import { Assistant, getAssistantFormData } from '@/entities/Assistants'
import { isUserAdmin } from '@/entities/User'
import { Button } from '@/shared/ui/redesign-v3/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SettingsIcon from '@mui/icons-material/Settings'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import cls from './ModelParametersCard.module.scss'

interface ModelParametersCardProps {
    className?: string
    onChangeTextHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export const ModelParametersCard = memo((props: ModelParametersCardProps) => {
    const {
        className,
        onChangeTextHandler
    } = props

    const { t } = useTranslation('assistants')
    const isAdmin = useSelector(isUserAdmin)
    const formFields = useSelector(getAssistantFormData)
    const [expanded, setExpanded] = useState(false)

    const isNonRealtime = formFields?.pipelineMode === 'non-realtime'
    
    const handleExpandClick = useCallback(() => {
        setExpanded((prev) => !prev)
    }, [])

    const temperature = parseFloat(formFields?.temperature || '0.8') || 0.8

    const handleTemperatureChange = (_: Event, value: number | number[]) => {
        const newValue = Array.isArray(value) ? value[0] : value
        const event = {
            target: { value: String(newValue) }
        } as ChangeEvent<HTMLInputElement>
        onChangeTextHandler?.('temperature')(event)
    }

    return (
        <div className={classNames(cls.ModelParametersCard, {}, [className])}>
            <HStack
                max
                justify="between"
                align="center"
                className={cls.header}
                onClick={handleExpandClick}
            >
                <HStack gap="8" align="center">
                    <SettingsIcon className={cls.headerIcon} />
                    <Text
                        title={t('Параметры Модели')}
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
                    {/* Temperature Slider */}
                    <VStack max gap="8">
                        <HStack max justify="between" align="center">
                            <HStack gap="8" align="center">
                                <ThermostatIcon className={cls.headerIcon} fontSize="small" />
                                <Typography className={cls.label}>
                                    {t('Температура')}
                                </Typography>
                                <Tooltip
                                    title={t('tooltip_temperature')}
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
                                text={String(temperature.toFixed(1))}
                                className={cls.value}
                                bold
                            />
                        </HStack>

                        <Slider
                            value={temperature}
                            onChange={handleTemperatureChange}
                            min={0.6}
                            max={1.2}
                            step={0.1}
                            marks={[
                                { value: 0.6, label: '0.6' },
                                { value: 0.9, label: '0.9' },
                                { value: 1.2, label: '1.2' }
                            ]}
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

                    {isAdmin && (
                        <VStack max gap="16">
                            <Textarea
                                label={t('Максимальное количество токенов в ответе') ?? ''}
                                onChange={onChangeTextHandler?.('max_response_output_tokens')}
                                data-testid="AssistantForm.max_response_output_tokens"
                                value={formFields?.max_response_output_tokens || ''}
                                minRows={1}
                                placeholder="4096/inf"
                            />

                            <Textarea
                                label={t('Модель распознавания речи') ?? ''}
                                onChange={onChangeTextHandler?.('input_audio_transcription_model')}
                                data-testid="AssistantForm.input_audio_transcription_model"
                                value={formFields?.input_audio_transcription_model || ''}
                                minRows={1}
                            />

                            <Textarea
                                label={t('Язык распознавания речи') ?? ''}
                                onChange={onChangeTextHandler?.('input_audio_transcription_language')}
                                data-testid="AssistantForm.input_audio_transcription_language"
                                value={formFields?.input_audio_transcription_language || ''}
                                minRows={1}
                            />

                            <Textarea
                                label={t('Модель синтеза речи') ?? ''}
                                onChange={onChangeTextHandler?.('output_audio_transcription_model')}
                                data-testid="AssistantForm.output_audio_transcription_model"
                                value={formFields?.output_audio_transcription_model || ''}
                                minRows={1}
                            />

                            {!isNonRealtime && (
                                <>
                                    <Textarea
                                        label={t('Формат входящего аудио') ?? ''}
                                        onChange={onChangeTextHandler?.('input_audio_format')}
                                        data-testid="AssistantForm.input_audio_format"
                                        value={formFields?.input_audio_format || ''}
                                        minRows={1}
                                    />

                                    <Textarea
                                        label={t('Формат исходящего аудио') ?? ''}
                                        onChange={onChangeTextHandler?.('output_audio_format')}
                                        data-testid="AssistantForm.output_audio_format"
                                        value={formFields?.output_audio_format || ''}
                                        minRows={1}
                                    />
                                </>
                            )}
                        </VStack>
                    )}
                </VStack>
            </Collapse>
        </div>
    )
})

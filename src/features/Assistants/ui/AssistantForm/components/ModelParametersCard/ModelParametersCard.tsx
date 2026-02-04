import { memo, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { classNames } from '@/shared/lib/classNames/classNames'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Slider, Typography, Tooltip } from '@mui/material'
import { Assistant } from '@/entities/Assistants/model/types/assistants'
import { getAssistantFormData } from '@/entities/Assistants/model/selectors/assistantFormSelectors'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import cls from './ModelParametersCard.module.scss'

interface ModelParametersCardProps {
    className?: string
    onChangeTextHandler?: (field: keyof Assistant) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

interface ModelParameter {
    field: keyof Assistant
    labelKey: string
    tooltipKey: string
    min: number
    max: number
    step: number
    unit: string
    marks: { value: number; label: string }[]
}

export const ModelParametersCard = memo((props: ModelParametersCardProps) => {
    const {
        className,
        onChangeTextHandler
    } = props

    const { t } = useTranslation('assistants')
    const formFields = useSelector(getAssistantFormData)

    const temperature = parseFloat(formFields?.temperature || '0.8') || 0.8

    const handleTemperatureChange = (_: Event, value: number | number[]) => {
        const newValue = Array.isArray(value) ? value[0] : value
        const event = {
            target: { value: String(newValue) }
        } as ChangeEvent<HTMLInputElement>
        onChangeTextHandler?.('temperature')(event)
    }

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
            unit: 'мс',
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
            unit: 'мс',
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
            unit: 'мс',
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
        // Специальное дефолтное значение для idle_timeout_ms
        if (field === 'idle_timeout_ms') {
            return 10000
        }
        return defaultValue
    }

    return (
        <div className={classNames(cls.ModelParametersCard, {}, [className])}>
            <HStack max justify="between" align="center" className={cls.header}>
                <HStack gap="8" align="center">
                    <GraphicEqIcon className={cls.headerIcon} />
                    <Text
                        title={t('Параметры')}
                        className={cls.cardTitle}
                        bold
                    />
                </HStack>
            </HStack>

            <VStack max gap="24">
                {/* Temperature Slider */}
                <VStack max gap="8">
                    <HStack max justify="between" align="center">
                        <HStack gap="8" align="center">
                            <ThermostatIcon className={cls.headerIcon} fontSize="small" />
                            <Typography className={cls.label}>
                                {t('Температура')}
                            </Typography>
                            <Tooltip title={t('tooltip_temperature')} placement="top">
                                <HelpOutlineIcon fontSize="small" className={cls.helpIcon} />
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

                {vadParameters.map((param) => {
                    const value = getValue(param.field, param.min)

                    return (
                        <VStack key={param.field} max gap="8">
                            <HStack max justify="between" align="center">
                                <HStack gap="8" align="center">
                                    <Typography className={cls.label}>
                                        {t(param.labelKey)}
                                    </Typography>
                                    <Tooltip title={t(param.tooltipKey)} placement="top">
                                        <HelpOutlineIcon fontSize="small" className={cls.helpIcon} />
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
        </div>
    )
})

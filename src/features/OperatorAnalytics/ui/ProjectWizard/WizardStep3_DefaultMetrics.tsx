import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Checkbox, FormControlLabel } from '@mui/material'
import { DefaultMetricKey } from '@/entities/Report'
import LockIcon from '@mui/icons-material/Lock'
import cls from './ProjectWizard.module.scss'

const LOCKED_METRICS = ['average_score', 'sentiment', 'summary'] as const

const ALL_DEFAULT_METRICS: Array<{ key: DefaultMetricKey; labelKey: string }> = [
    { key: 'greeting_quality', labelKey: 'Качество приветствия' },
    { key: 'script_compliance', labelKey: 'Следование скрипту' },
    { key: 'politeness_empathy', labelKey: 'Вежливость и эмпатия' },
    { key: 'active_listening', labelKey: 'Активное слушание' },
    { key: 'objection_handling', labelKey: 'Работа с возражениями' },
    { key: 'product_knowledge', labelKey: 'Знание продукта' },
    { key: 'problem_resolution', labelKey: 'Решение проблемы' },
    { key: 'speech_clarity_pace', labelKey: 'Темп речи' },
    { key: 'closing_quality', labelKey: 'Качество завершения' },
]

interface WizardStep3Props {
    visibleMetrics: DefaultMetricKey[]
    onChange: (metrics: DefaultMetricKey[]) => void
}

export const WizardStep3_DefaultMetrics = memo(({ visibleMetrics, onChange }: WizardStep3Props) => {
    const { t } = useTranslation('reports')

    const handleToggle = useCallback((key: DefaultMetricKey) => {
        const isVisible = visibleMetrics.includes(key)
        if (isVisible) {
            onChange(visibleMetrics.filter(m => m !== key))
        } else {
            onChange([...visibleMetrics, key])
        }
    }, [visibleMetrics, onChange])

    return (
        <VStack gap={'16'} max>
            <Text title={String(t('Стандартные метрики'))} bold />
            <Text text={String(t('Выберите метрики для отображения в дашборде'))} />

            {/* Locked metrics — always active */}
            <VStack gap={'8'} max>
                <Text text={String(t('Всегда активны'))} bold size={'s'} />
                <div className={cls.metricsChecklist}>
                    {LOCKED_METRICS.map(key => (
                        <div key={key} className={`${cls.metricCheckRow} ${cls.locked}`}>
                            <LockIcon sx={{ fontSize: 16, color: 'var(--icon-redesigned)', opacity: 0.5 }} />
                            <FormControlLabel
                                control={<Checkbox checked disabled size={'small'} />}
                                label={String(t(key === 'average_score' ? 'Средняя оценка' : key === 'sentiment' ? 'Настроение' : 'Саммари'))}
                                sx={{ color: 'var(--text-redesigned)', margin: 0, '& .Mui-disabled': { color: 'var(--icon-redesigned) !important' } }}
                            />
                        </div>
                    ))}
                </div>
            </VStack>

            {/* Optional metrics */}
            <VStack gap={'8'} max>
                <Text text={String(t('Опциональные метрики'))} bold size={'s'} />
                <div className={cls.metricsChecklist}>
                    {ALL_DEFAULT_METRICS.map(m => (
                        <div
                            key={m.key}
                            className={cls.metricCheckRow}
                            onClick={() => handleToggle(m.key)}
                            style={{ cursor: 'pointer' }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={visibleMetrics.includes(m.key)}
                                        size={'small'}
                                        sx={{ color: 'var(--icon-redesigned)', '&.Mui-checked': { color: 'var(--accent-redesigned)' } }}
                                    />
                                }
                                label={String(t(m.labelKey))}
                                sx={{ color: 'var(--text-redesigned)', margin: 0 }}
                                onClick={e => e.stopPropagation()}
                            />
                        </div>
                    ))}
                </div>
            </VStack>
        </VStack>
    )
})

import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Checkbox, FormControlLabel } from '@mui/material'
import { DefaultMetricKey } from '@/entities/Report'
import LockIcon from '@mui/icons-material/Lock'
import { ALL_DEFAULT_METRICS, LOCKED_SUMMARY_METRICS } from '../../lib/metricVisual'
import cls from './ProjectWizard.module.scss'

interface WizardStep3Props {
    visibleMetrics: DefaultMetricKey[]
    onToggle: (key: DefaultMetricKey) => void
}

export const WizardStep3_DefaultMetrics = memo(({ visibleMetrics, onToggle }: WizardStep3Props) => {
    const { t } = useTranslation('reports')

    return (
        <VStack gap={'16'} max>
            <Text text={String(t('Выберите метрики для отображения в дашборде'))} />
            <Text
                text={String(t('METRIC_PICKER_HINT'))}
                size={'s'}
            />

            <VStack gap={'8'} max>
                <Text text={String(t('Всегда активны'))} bold size={'s'} />
                <div className={cls.metricsChecklist}>
                    {LOCKED_SUMMARY_METRICS.map(m => (
                        <div key={m.key} className={`${cls.metricCheckRow} ${cls.locked}`}>
                            <LockIcon sx={{ fontSize: 16, color: 'var(--icon-redesigned)', opacity: 0.5 }} />
                            <div className={cls.metricCheckContent}>
                                <FormControlLabel
                                    control={<Checkbox checked disabled size={'small'} />}
                                    label={String(t(m.labelKey))}
                                    sx={{
                                        color: 'var(--text-redesigned)',
                                        margin: 0,
                                        alignItems: 'flex-start',
                                        '& .Mui-disabled': { color: 'var(--icon-redesigned) !important' },
                                    }}
                                />
                                <Text
                                    text={String(t(m.descriptionKey))}
                                    size={'s'}
                                    className={cls.metricDescription}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </VStack>

            <VStack gap={'8'} max>
                <Text text={String(t('Опциональные метрики'))} bold size={'s'} />
                <div className={cls.metricsChecklist}>
                    {ALL_DEFAULT_METRICS.map(m => (
                        <div
                            key={m.key}
                            className={cls.metricCheckRow}
                            onClick={() => { onToggle(m.key) }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    onToggle(m.key)
                                }
                            }}
                        >
                            <Checkbox
                                checked={visibleMetrics.includes(m.key)}
                                size={'small'}
                                tabIndex={-1}
                                sx={{
                                    color: 'var(--icon-redesigned)',
                                    '&.Mui-checked': { color: 'var(--accent-redesigned)' },
                                    paddingTop: '2px',
                                }}
                            />
                            <div className={cls.metricCheckContent}>
                                <Text text={String(t(m.labelKey))} bold size={'s'} />
                                <Text
                                    text={String(t(m.descriptionKey))}
                                    size={'s'}
                                    className={cls.metricDescription}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </VStack>
        </VStack>
    )
})

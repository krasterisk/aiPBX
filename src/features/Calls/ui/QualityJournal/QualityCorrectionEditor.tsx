import { useSaveQualityPreviewOverridesMutation as useSaveMetricOverrides, useDeleteQualityPreviewOverrideMutation as useDeleteMetricOverride } from '@/entities/Report'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    JOURNAL_METRIC_LABELS,
    type QualityDetail,
    type MetricOverrideInput,
} from '@/entities/Report'
import cls from './CallsJournal.module.scss'

/** Uses the already-loaded immutable rubric/result; no separate overrides query. */
export function QualityCorrectionEditor({ channelId, detail }: { channelId: string, detail: QualityDetail }) {
    const { t } = useTranslation('quality-journal')
    const { t: r } = useTranslation('reports')
    const [save, saveState] = useSaveMetricOverrides()
    const [remove, removeState] = useDeleteMetricOverride()
    const [key, setKey] = useState('')
    const [status, setStatus] = useState<'assessed' | 'not_applicable' | 'insufficient_evidence'>('assessed')
    const [value, setValue] = useState('')
    const [note, setNote] = useState('')
    const [message, setMessage] = useState('')
    const choices = [
        ...detail.criteria,
        ...[
            { id: 'csat', type: 'number' },
            { id: 'success', type: 'boolean' },
            { id: 'customer_sentiment', type: 'enum' },
        ].map((rule) => ({ ...rule, origin: 'summary' as const })),
    ]
    const rule = choices.find((rule) => `${rule.origin}:${rule.id}` === key)
    const label = (id: string, origin: string) =>
        origin === 'summary'
            ? t(id === 'csat' ? 'csat' : id === 'success' ? 'result' : 'sentiment')
            : origin === 'default'
            ? r(JOURNAL_METRIC_LABELS[id] || id)
            : detail.criteria.find((rule) => rule.id === id && rule.origin === origin)?.name || id
    const corrections =
        detail.corrections ??
        detail.evaluation?.result.criteria
            .filter((item) => item.source === 'human')
            .map((item) => ({ metricId: item.id, origin: item.origin, status: item.status, value: item.value })) ??
        []
    const payload = (): MetricOverrideInput | null => {
        if (!rule) return null
        const base = { metricId: rule.id, origin: rule.origin, status, note: note.trim() || null }
        if (status !== 'assessed') return note.trim() ? base : null
        if (!value.trim()) return null
        if (rule.type === 'number') {
return Number.isFinite(Number(value.replace(',', '.')))
                ? { ...base, numValue: Number(value.replace(',', '.')) }
                : null
}
        if (rule.type === 'boolean') { return ['true', 'false'].includes(value) ? { ...base, boolValue: value === 'true' } : null }
        return { ...base, strValue: value.trim() }
    }
    const submit = async () => {
        const change = payload()
        if (!change) return
        try {
            await save({ channelId, overrides: [change] }).unwrap()
            setMessage('qualityCorrectionSaved')
            setKey('')
            setValue('')
            setNote('')
        } catch {
            setMessage('qualityCorrectionError')
        }
    }
    const reset = async (id: string) => {
        try {
            await remove({ channelId, metricId: id }).unwrap()
            setMessage('qualityCorrectionSaved')
        } catch {
            setMessage('qualityCorrectionError')
        }
    }
    return (
        <div className={cls.correction}>
            <p className={cls.note}>{t('qualityCorrectionHint')}</p>
            {corrections.map((item) => (
                <div className={cls.correctionRow} key={`${item.origin}:${item.metricId}`}>
                    <span>
                        {label(item.metricId, item.origin ?? 'default')} ·{' '}
                        {item.status && item.status !== 'assessed'
                            ? t('quality_' + item.status)
                            : String('value' in item ? item.value : item.numValue ?? item.boolValue ?? item.strValue)}
                    </span>
                    <button
                        type="button"
                        className={cls.button}
                        disabled={removeState.isLoading || saveState.isLoading}
                        onClick={() => {
                            void reset(item.metricId)
                        }}
                    >
                        {t('qualityRestoreModel')}
                    </button>
                </div>
            ))}
            <label>
                {t('qualityCriterion')}
                <select
                    value={key}
                    onChange={(e) => {
                        setKey(e.target.value)
                        setValue('')
                        setStatus('assessed')
                        setMessage('')
                    }}
                >
                    <option value="">{t('qualityChooseCriterion')}</option>
                    {choices.map((rule) => (
                        <option key={`${rule.origin}:${rule.id}`} value={`${rule.origin}:${rule.id}`}>
                            {label(rule.id, rule.origin)}
                        </option>
                    ))}
                </select>
            </label>
            {rule && (
                <>
                    {rule.origin !== 'summary' && (
                        <label>
                            {t('qualityApplicability')}
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value as typeof status)
                                    setValue('')
                                }}
                            >
                                {(['assessed', 'not_applicable', 'insufficient_evidence'] as const).map((status) => (
                                    <option key={status} value={status}>
                                        {t('quality_' + status)}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                    {status === 'assessed' && (
                        <label>
                            {t('qualityAnswer')}
                            {rule.type === 'boolean' ? (
                                <select
                                    value={value}
                                    onChange={(e) => {
                                        setValue(e.target.value)
                                    }}
                                >
                                    <option value="">{t('qualityChooseAnswer')}</option>
                                    <option value="true">{t('yes')}</option>
                                    <option value="false">{t('no')}</option>
                                </select>
                            ) : rule.origin === 'summary' && rule.id === 'customer_sentiment' ? (
                                <select
                                    value={value}
                                    onChange={(e) => {
                                        setValue(e.target.value)
                                    }}
                                >
                                    <option value="">{t('qualityChooseAnswer')}</option>
                                    {['Positive', 'Neutral', 'Negative'].map((value) => (
                                        <option key={value} value={value}>
                                            {t('mood_' + value.toLowerCase())}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={rule.type === 'number' ? 'number' : 'text'}
                                    step="any"
                                    min={rule.id === 'csat' && rule.origin === 'summary' ? 1 : undefined}
                                    max={rule.id === 'csat' && rule.origin === 'summary' ? 5 : undefined}
                                    value={value}
                                    onChange={(e) => {
                                        setValue(e.target.value)
                                    }}
                                />
                            )}
                        </label>
                    )}
                    <label>
                        {t('rationale')}
                        <textarea
                            value={note}
                            maxLength={5000}
                            required={status !== 'assessed'}
                            onChange={(e) => {
                                setNote(e.target.value)
                            }}
                        />
                    </label>
                    <button
                        type="button"
                        className={cls.button}
                        disabled={!payload() || saveState.isLoading || removeState.isLoading}
                        onClick={() => {
                            void submit()
                        }}
                    >
                        {t('qualitySaveCorrection')}
                    </button>
                </>
            )}
            {message && <p role="status">{t(message)}</p>}
        </div>
    )
}

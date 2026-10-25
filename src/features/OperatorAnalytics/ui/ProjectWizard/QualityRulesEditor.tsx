import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetQualityRulesQuery, useSaveQualityRulesMutation, JOURNAL_METRIC_LABELS } from '@/entities/Report'
import type { QualityConfig, QualityRule } from '@/entities/Report'

import cls from './QualityRulesEditor.module.scss'

/** Rules are saved separately and affect subsequent evaluations only. */
export function QualityRulesEditor({ projectId }: { projectId: number }) {
    const { t } = useTranslation('quality-score')
    const { t: r } = useTranslation('reports')
    const { currentData, isFetching, isError, refetch } = useGetQualityRulesQuery(projectId)
    const [save, { isLoading }] = useSaveQualityRulesMutation()
    const [draft, setDraft] = useState<QualityConfig | null>(null)
    const [message, setMessage] = useState('')
    const config = draft ?? currentData?.config ?? {}
    const patch = (rule: QualityRule, change: NonNullable<QualityConfig['criteria']>[string]) => {
        const key = `${rule.origin}:${rule.id}`
        setDraft({ ...config, criteria: { ...config.criteria, [key]: { ...config.criteria?.[key], ...change } } })
        setMessage('')
    }
    const submit = async () => {
        try {
            await save({ id: projectId, config }).unwrap()
            setDraft(null)
            setMessage('saved')
        } catch {
            setMessage('saveError')
        }
    }
    if (isError) {
return (
            <p role="alert">
                {t('loadError')}{' '}
                <button
                    type="button"
                    onClick={() => {
                        void refetch()
                    }}
                >
                    {t('retry')}
                </button>
            </p>
        )
}
    if (!currentData) return <p role="status">{t('loading')}</p>
    return (
        <section className={cls.editor} aria-label={String(t('title'))}>
            <p>{t('hint')}</p>
            {!currentData.enabled && <p className={cls.note}>{t('inactive')}</p>}
            <label>
                {t('coverage')}{' '}
                <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={(config.minimumCoverage ?? currentData.minimumCoverage) * 100}
                    onChange={(e) => {
                        setDraft({ ...config, minimumCoverage: Number(e.target.value) / 100 })
                    }}
                />{' '}
                %
            </label>
            {currentData.criteria.map((original) => {
                const rule = { ...original, ...config.criteria?.[`${original.origin}:${original.id}`] }
                const n = rule.normalization
                return (
                    <details className={cls.rule} key={`${rule.origin}:${rule.id}`}>
                        <summary>
                            {rule.origin === 'default' ? r(JOURNAL_METRIC_LABELS[rule.id] || rule.name) : rule.name}{' '}
                            <span>
                                {t(rule.included ? 'included' : 'excluded')} · {t('weight')} {rule.weight}
                            </span>
                        </summary>
                        <div className={cls.fields}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={rule.included}
                                    onChange={(e) => {
                                        patch(rule, {
                                            included: e.target.checked,
                                            ...(!e.target.checked ? { critical: 'none' } : {}),
                                        })
                                    }}
                                />{' '}
                                {t('include')}
                            </label>
                            <label>
                                {t('weight')}{' '}
                                <input
                                    type="number"
                                    min="0.01"
                                    max="1000"
                                    step="0.1"
                                    value={rule.weight}
                                    onChange={(e) => {
                                        patch(rule, { weight: Number(e.target.value) })
                                    }}
                                />
                            </label>
                            <label>
                                {t('critical')}{' '}
                                <select
                                    disabled={!rule.included}
                                    value={rule.critical}
                                    onChange={(e) => {
                                        patch(rule, { critical: e.target.value as QualityRule['critical'] })
                                    }}
                                >
                                    {(['none', 'flag', 'fail'] as const).map((value) => (
                                        <option key={value} value={value}>
                                            {t('critical_' + value)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {rule.type === 'number' && (
                                <>
                                    <label>
                                        {t('minimum')}{' '}
                                        <input
                                            type="number"
                                            value={n.kind === 'linear' ? n.min : 0}
                                            onChange={(e) => {
                                                patch(rule, {
                                                    normalization: {
                                                        kind: 'linear',
                                                        min: Number(e.target.value),
                                                        max: n.kind === 'linear' ? n.max : 100,
                                                        inverted: n.kind === 'linear' && n.inverted,
                                                    },
                                                })
                                            }}
                                        />
                                    </label>
                                    <label>
                                        {t('maximum')}{' '}
                                        <input
                                            type="number"
                                            value={n.kind === 'linear' ? n.max : 100}
                                            onChange={(e) => {
                                                patch(rule, {
                                                    normalization: {
                                                        kind: 'linear',
                                                        min: n.kind === 'linear' ? n.min : 0,
                                                        max: Number(e.target.value),
                                                        inverted: n.kind === 'linear' && n.inverted,
                                                    },
                                                })
                                            }}
                                        />
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={n.kind === 'linear' && Boolean(n.inverted)}
                                            onChange={(e) => {
                                                patch(rule, {
                                                    normalization: {
                                                        kind: 'linear',
                                                        min: n.kind === 'linear' ? n.min : 0,
                                                        max: n.kind === 'linear' ? n.max : 100,
                                                        inverted: e.target.checked,
                                                    },
                                                })
                                            }}
                                        />{' '}
                                        {t('inverted')}
                                    </label>
                                </>
                            )}
                            {rule.type === 'boolean' && (
                                <label>
                                    {t('positiveAnswer')}{' '}
                                    <select
                                        value={n.kind === 'points' && n.values.true === 0 ? 'false' : 'true'}
                                        onChange={(e) => {
                                            patch(rule, {
                                                normalization: {
                                                    kind: 'points',
                                                    maxPoints: 1,
                                                    values:
                                                        e.target.value === 'true'
                                                            ? { true: 1, false: 0 }
                                                            : { true: 0, false: 1 },
                                                },
                                            })
                                        }}
                                    >
                                        <option value="true">{t('yes')}</option>
                                        <option value="false">{t('no')}</option>
                                    </select>
                                </label>
                            )}
                            {['enum', 'string'].includes(rule.type) && (
                                <PointsMapping
                                    key={JSON.stringify(n)}
                                    normalization={n}
                                    onChange={(normalization) => {
                                        patch(rule, { normalization })
                                    }}
                                />
                            )}
                        </div>
                    </details>
                )
            })}
            <p className={cls.note}>{t('criticalHint')}</p>
            <p className={cls.note}>
                {t('revision')}: {currentData.revisionId.slice(0, 12)}
            </p>
            {message && <p role="status">{t(message)}</p>}
            <button
                type="button"
                disabled={!draft || isLoading || isFetching}
                onClick={() => {
                    void submit()
                }}
            >
                {t(isLoading ? 'saving' : 'save')}
            </button>
        </section>
    )
}

function PointsMapping({
    normalization,
    onChange,
}: {
    normalization: QualityRule['normalization']
    onChange: (value: QualityRule['normalization']) => void
}) {
    const { t } = useTranslation('quality-score')
    const [text, setText] = useState(
        JSON.stringify(normalization.kind === 'points' ? normalization.values : {}, null, 2)
    )
    const [invalid, setInvalid] = useState(false)
    return (
        <label className={cls.mapping}>
            {t('mapping')}
            <textarea
                value={text}
                onChange={(e) => {
                    setText(e.target.value)
                    setInvalid(false)
                }}
                onBlur={() => {
                    try {
                        const values: unknown = JSON.parse(text)
                        if (
                            !values ||
                            typeof values !== 'object' ||
                            Array.isArray(values) ||
                            !Object.keys(values).length ||
                            Object.values(values).some(
                                (value) =>
                                    typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100
                            )
                        ) { throw new Error('Invalid points') }
                        onChange({ kind: 'points', maxPoints: 100, values: values as Record<string, number> })
                    } catch {
                        setInvalid(true)
                    }
                }}
            />
            {invalid && <span role="alert">{t('mappingError')}</span>}
        </label>
    )
}

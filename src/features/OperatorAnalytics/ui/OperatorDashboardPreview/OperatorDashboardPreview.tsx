import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart3, Check, ChevronRight, Clock3, Phone, Users } from 'lucide-react'
import {
    useGetOperatorDashboard,
    WITHOUT_PROJECT_FILTER,
    type AgentScorecard,
    type OperatorDashboardResponse,
    type OperatorProject
} from '@/entities/Report'
import { SidePanel } from '@/shared/ui/redesign-v3'
import { formatTenantMoney } from '@/shared/lib/functions/formatDisplayMoney'
import { ALL_DEFAULT_METRICS, normalizeRate } from '../../lib/metricVisual'
import { PreviewMainCalls, PreviewPanel, callsEntry, type PreviewEntry } from './PreviewPanel'
import { dayQuery, hourQuery, trendSeries, operatorQuery, previewDuration, type PreviewFilters } from './previewModel'
import cls from './OperatorDashboardPreview.module.scss'

interface Props {
    filters: PreviewFilters
    data?: OperatorDashboardResponse
    loading: boolean
    error: boolean
    projects: OperatorProject[]
    project?: OperatorProject
    onProjectChange: (id: string) => void
    onRetry: () => void
}

function Section({
    title,
    hint,
    children,
    className = '',
    action
}: {
    title: string
    hint?: string
    children: ReactNode
    className?: string
    action?: ReactNode
}) {
    return (
        <section className={`${cls.section} ${className}`}>
            <header className={cls.sectionHeader}>
                <div>
                    <h2>{title}</h2>
                    {hint && <p>{hint}</p>}
                </div>
                {action}
            </header>
            <div className={cls.sectionBody}>{children}</div>
        </section>
    )
}

const identity = (o: AgentScorecard) => JSON.stringify([o.operatorAccountId, o.operatorId, o.operatorName])

export function OperatorDashboardPreview(props: Props) {
    const { t, i18n } = useTranslation('call-records-preview')
    const { t: r } = useTranslation('reports')
    const [operatorId, setOperatorId] = useState('')
    const [allMetrics, setAllMetrics] = useState(false)
    const [stack, setStack] = useState<PreviewEntry[]>([])
    const focus = useRef<HTMLElement | null>(null)
    const selected = props.data?.agentScorecards?.find(o => identity(o) === operatorId)
    const scope = selected ? operatorQuery(selected) : {}
    const filters = { ...props.filters, ...scope }
    const summaryQuery = useGetOperatorDashboard(
        {
            ...props.filters,
            ...(scope.userId ? { userId: scope.userId } : {}),
            ...(scope.operatorId ? { operatorId: scope.operatorId } : {}),
            ...(scope.operatorNameExact ? { operatorName: scope.operatorNameExact } : {})
        },
        { skip: !selected || props.loading || props.error }
    )
    const data = selected ? summaryQuery.currentData : props.data
    const loading = props.loading || Boolean(selected && (summaryQuery.isFetching || !data) && !summaryQuery.isError)
    const error = props.error || Boolean(selected && summaryQuery.isError)
    const open = (entry: PreviewEntry) => {
        if (!stack.length) focus.current = document.activeElement as HTMLElement
        setStack(old => [...old, entry])
    }
    const close = () => {
        setStack([])
        focus.current?.focus()
    }
    useEffect(() => {
        setStack([])
    }, [operatorId])
    const current = stack.at(-1)
    const metric = (metricId: string, title: string) => {
        open({
            kind: 'metric',
            title,
            entry: {
                kind: 'operatorMetric',
                metricId,
                metricLabel: title,
                ...(selected
                    ? {
                          operatorName: selected.operatorName,
                          operatorId: selected.operatorId,
                          operatorAccountId: selected.operatorAccountId
                      }
                    : {})
            },
            filters
        })
    }
    const noOperator = (name?: string | null) => (!name || name === 'Unknown Operator' ? String(t('noOperator')) : name)
    const total = data?.totalAnalyzed ?? 0
    const success = Math.min(100, Math.max(0, normalizeRate(data?.successRate)))
    const successCount = Math.round((total * success) / 100)
    const cost = data?.totalAmountCurrency ?? data?.totalCost ?? 0
    const defaults = ALL_DEFAULT_METRICS.filter(
        m => !props.project?.visibleDefaultMetrics?.length || props.project.visibleDefaultMetrics.includes(m.key)
    )
    const displayMetrics = allMetrics ? defaults : defaults.slice(0, 4)
    const trend = data ? trendSeries(data.timeSeries, filters) : { unit: 'day', points: [] }
    const useHourly = trend.unit === 'hour'
    const series = trend.points.slice().sort((a, b) => a.label.localeCompare(b.label))
    const bucketTitle = (label: string) =>
        useHourly
            ? new Date(label).toLocaleString(i18n.language, {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
              })
            : label
    const max = Math.max(1, ...series.map(point => point.callsCount))
    const stats = data?.operatorTopicStats
    const topics = stats?.topics ?? data?.tagStats?.map(tag => ({ tagId: tag.tagId, name: tag.name, callsCount: tag.callsCount })) ?? []
    const money = (value: number) => formatTenantMoney(value, 2) || '0'
    return (
        <div className={cls.root} data-testid="call-records-preview">
            <div className={cls.previewHeader}>
                <span className={cls.previewBadge}>{t('preview')}</span>
                <p>{t('previewHint')}</p>
            </div>
            <div className={cls.filters}>
                <label>
                    {t('project')}
                    <select
                        aria-label={String(t('project'))}
                        value={props.filters.projectId ?? ''}
                        onChange={e => {
                            props.onProjectChange(e.target.value)
                        }}
                    >
                        {props.projects.map(p => (
                            <option key={p.id} value={String(p.id)}>
                                {p.name}
                            </option>
                        ))}
                        <option value={WITHOUT_PROJECT_FILTER}>{t('withoutProject')}</option>
                    </select>
                </label>
                <label>
                    {t('operator')}
                    <select
                        aria-label={String(t('operator'))}
                        value={operatorId}
                        onChange={e => {
                            setOperatorId(e.target.value)
                        }}
                        disabled={props.loading || props.error}
                    >
                        <option value="">{t('allOperators')}</option>
                        {props.data?.agentScorecards
                            ?.filter(o => o.operatorId || o.operatorName !== 'Unknown Operator')
                            .map(o => (
                                <option key={identity(o)} value={identity(o)}>
                                    {noOperator(o.operatorName)}
                                </option>
                            ))}
                    </select>
                </label>
                <p className={cls.caption}>{t('detailsHint')}</p>
            </div>
            {error ? (
                <div className={cls.message} role="alert">
                    <p>{t('loadError')}</p>
                    <button
                        className={cls.button}
                        onClick={() => {
                            if (selected && !props.error) summaryQuery.refetch()
                            else props.onRetry()
                        }}
                    >
                        {t('retry')}
                    </button>
                </div>
            ) : loading || !data ? (
                <div className={cls.loading} role="status">
                    {t('loading')}
                </div>
            ) : (
                <>
                    {(data.excludedLowQualityCount ?? 0) > 0 && (
                        <p className={cls.caption}>{r('DASHBOARD_EXCLUDED_LOW_QUALITY', { count: data.excludedLowQualityCount })}</p>
                    )}
                    <section className={cls.kpis} aria-label={String(t('summary'))}>
                        {[
                            { label: t('calls'), value: total, hint: t('analyzed'), icon: Phone, query: filters },
                            {
                                label: t('score'),
                                value: total ? data.averageScore.toFixed(1) : '—',
                                hint: t('scoreHint'),
                                icon: BarChart3,
                                query: filters
                            },
                            {
                                label: t('duration'),
                                value: total ? previewDuration(data.averageDuration) : '—',
                                hint: t('durationHint'),
                                icon: Clock3,
                                query: filters
                            },
                            {
                                label: t('successful'),
                                value: total ? `${success.toFixed(0)}%` : '—',
                                hint: t('successCount', { count: successCount, total }),
                                icon: Check,
                                query: { ...filters, success: true }
                            }
                        ].map(item => (
                            <button
                                type="button"
                                className={cls.kpi}
                                key={String(item.label)}
                                onClick={() => {
                                    open(callsEntry(String(item.label), item.query))
                                }}
                            >
                                <span>
                                    {item.label}
                                    <item.icon size={17} aria-hidden />
                                </span>
                                <strong>{item.value}</strong>
                                <small>
                                    {item.hint}
                                    <ChevronRight size={13} aria-hidden />
                                </small>
                            </button>
                        ))}
                    </section>
                    <details className={cls.finance}>
                        <summary>{t('expenses')}</summary>
                        <div>
                            <span>
                                {t('totalCost')} <b>{money(cost)}</b>
                            </span>
                            <span>
                                {t('averageCost')} <b>{money(total ? cost / total : 0)}</b>
                            </span>
                        </div>
                    </details>
                    {!total && <div className={cls.emptySummary}>{t('noCalls')}</div>}
                    <div className={cls.grid}>
                        <Section
                            title={String(t('trend'))}
                            hint={String(t(useHourly ? 'hourlyHint' : 'trendHint'))}
                            className={cls.trend}
                            action={
                                <span className={cls.caption}>
                                    {t({ hour: 'byHour', day: 'byDay', month: 'byMonth', year: 'byYear' }[trend.unit] ?? 'byDay')}
                                </span>
                            }
                        >
                            {series.length ? (
                                <div className={cls.chartScroll}>
                                    <div
                                        className={cls.chart}
                                        style={{ gridTemplateColumns: `repeat(${series.length}, minmax(34px, 1fr))` }}
                                    >
                                        {series.map(point => (
                                            <button
                                                type="button"
                                                key={point.label}
                                                title={`${bucketTitle(point.label)}: ${point.callsCount}`}
                                                onClick={() => {
                                                    const query = useHourly
                                                        ? hourQuery(point.label, filters)
                                                        : dayQuery(point.label, filters)
                                                    if (query) open(callsEntry(`${t('calls')} / ${bucketTitle(point.label)}`, query))
                                                }}
                                            >
                                                <span>{point.callsCount}</span>
                                                <i style={{ height: `${Math.max(2, (point.callsCount * 90) / max)}px` }} />
                                                <small>
                                                    {useHourly
                                                        ? new Date(point.label).toLocaleTimeString(i18n.language, {
                                                              hour: '2-digit',
                                                              minute: '2-digit'
                                                          })
                                                        : /^\d{4}-\d{2}(-\d{2})?$/.test(point.label)
                                                        ? new Date(
                                                              `${point.label.length === 7 ? point.label + '-01' : point.label}T12:00:00Z`
                                                          ).toLocaleDateString(i18n.language, {
                                                              day: point.label.length === 7 ? undefined : 'numeric',
                                                              month: 'short',
                                                              timeZone: 'UTC'
                                                          })
                                                        : point.label}
                                                </small>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className={cls.message}>{t('noCalls')}</p>
                            )}
                        </Section>
                        <Section title={String(t('outcome'))} hint={String(t('outcomeHint'))} className={cls.outcome}>
                            <div className={cls.outcomeValue}>
                                <strong>{total ? `${success.toFixed(0)}%` : '—'}</strong>
                                <span>{t('successful')}</span>
                            </div>
                            <div className={cls.successTrack} aria-hidden>
                                <i style={{ width: `${success}%` }} />
                            </div>
                            <div className={cls.outcomeButtons}>
                                {([true, false] as const).map(ok => (
                                    <button
                                        key={String(ok)}
                                        type="button"
                                        onClick={() => {
                                            open(callsEntry(String(t(ok ? 'successful' : 'unsuccessful')), { ...filters, success: ok }))
                                        }}
                                    >
                                        <span>{t(ok ? 'successful' : 'unsuccessful')}</span>
                                        <b>{ok ? successCount : Math.max(0, total - successCount)}</b>
                                        <ChevronRight size={14} aria-hidden />
                                    </button>
                                ))}
                            </div>
                            <details className={cls.sentiment}>
                                <summary>{t('sentiment')}</summary>
                                {(['positive', 'neutral', 'negative'] as const).map(key => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => {
                                            open(callsEntry(String(t(key)), { ...filters, sentiment: key }))
                                        }}
                                    >
                                        <span>{t(key)}</span>
                                        <b>{data.sentimentDistribution[key]}</b>
                                        <ChevronRight size={14} aria-hidden />
                                    </button>
                                ))}
                            </details>
                        </Section>
                        <Section
                            title={String(t('topics'))}
                            hint={String(t(stats?.hasMultipleTopics ? 'multipleTopics' : 'topicsHint'))}
                            className={cls.topics}
                        >
                            <div className={cls.rowLabels}>
                                <span>{t('topic')}</span>
                                <span>{t('calls')}</span>
                                <span>{t('share')}</span>
                                <span />
                            </div>
                            {topics.length ? (
                                topics.map(topic => (
                                    <button
                                        className={cls.topicRow}
                                        type="button"
                                        key={topic.tagId ?? 'none'}
                                        onClick={() => {
                                            open(
                                                callsEntry(
                                                    topic.name,
                                                    {
                                                        ...filters,
                                                        ...(topic.tagId === null ? { withoutTopic: true } : { tagId: topic.tagId })
                                                    },
                                                    topic.tagId
                                                )
                                            )
                                        }}
                                    >
                                        <span>
                                            {topic.name}
                                            <i className={cls.topicTrack}>
                                                <i style={{ width: `${total ? Math.min(100, (topic.callsCount * 100) / total) : 0}%` }} />
                                            </i>
                                        </span>
                                        <b>{topic.callsCount}</b>
                                        <small>{total ? `${Math.round((topic.callsCount * 100) / total)}%` : '—'}</small>
                                        <ChevronRight size={15} aria-hidden />
                                    </button>
                                ))
                            ) : (
                                <p className={cls.message}>{t('noTopics')}</p>
                            )}
                        </Section>
                        <Section title={String(t('quality'))} hint={String(t('qualityHint'))} className={cls.quality}>
                            {displayMetrics.map(m => {
                                const value = data.aggregatedMetrics[m.key]
                                return (
                                    <button
                                        type="button"
                                        className={cls.metricRow}
                                        key={m.key}
                                        onClick={() => {
                                            metric(m.key, String(r(m.labelKey)))
                                        }}
                                    >
                                        <span>
                                            {r(m.labelKey)}
                                            <i className={cls.metricTrack}>
                                                <i style={{ width: `${Math.max(0, Math.min(100, value ?? 0))}%` }} />
                                            </i>
                                        </span>
                                        <b>{total && Number.isFinite(value) ? Math.round(value) : '—'}</b>
                                        <ChevronRight size={15} aria-hidden />
                                    </button>
                                )
                            })}
                            {defaults.length > 4 && (
                                <button
                                    type="button"
                                    className={cls.textButton}
                                    onClick={() => {
                                        setAllMetrics(!allMetrics)
                                    }}
                                >
                                    {t(allMetrics ? 'lessMetrics' : 'allMetrics', { count: defaults.length })}
                                </button>
                            )}
                            {props.project?.customMetricsSchema?.length ? (
                                <details className={cls.custom}>
                                    <summary>{t('customMetrics')}</summary>
                                    {props.project.customMetricsSchema.map(m => {
                                        const aggregate = data.customMetricsAggregated?.[m.id]
                                        return (
                                            <button
                                                type="button"
                                                className={cls.metricRow}
                                                key={m.id}
                                                onClick={() => {
                                                    metric(m.id, m.name)
                                                }}
                                            >
                                                <span>
                                                    {m.name}
                                                    {aggregate?.distribution && (
                                                        <small>
                                                            {Object.entries(aggregate.distribution)
                                                                .map(([label, count]) => `${label}: ${count}`)
                                                                .join(' · ')}
                                                        </small>
                                                    )}
                                                </span>
                                                <b>{aggregate?.value != null ? Math.round(aggregate.value * 100) / 100 : '—'}</b>
                                                <ChevronRight size={15} aria-hidden />
                                            </button>
                                        )
                                    })}
                                </details>
                            ) : null}
                        </Section>
                        <Section title={String(t('operators'))} hint={String(t('operatorsHint'))} className={cls.operators}>
                            <div className={cls.tableWrap}>
                                <table className={cls.table}>
                                    <thead>
                                        <tr>
                                            <th>{t('operator')}</th>
                                            <th>{t('calls')}</th>
                                            <th>{t('score')}</th>
                                            <th>{t('successful')}</th>
                                            <th>{r('CSAT')}</th>
                                            <th>{t('negative')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.agentScorecards?.map(o => (
                                            <tr key={identity(o)}>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className={cls.personButton}
                                                        onClick={() => {
                                                            open(
                                                                callsEntry(noOperator(o.operatorName), { ...filters, ...operatorQuery(o) })
                                                            )
                                                        }}
                                                    >
                                                        <span className={cls.avatar}>
                                                            <Users size={16} aria-hidden />
                                                        </span>
                                                        <strong>{noOperator(o.operatorName)}</strong>
                                                        <ChevronRight size={15} aria-hidden />
                                                    </button>
                                                </td>
                                                <td data-label={String(t('calls'))}>
                                                    <button
                                                        type="button"
                                                        className={cls.textButton}
                                                        onClick={() => {
                                                            open(
                                                                callsEntry(noOperator(o.operatorName), { ...filters, ...operatorQuery(o) })
                                                            )
                                                        }}
                                                    >
                                                        {o.callsCount}
                                                    </button>
                                                </td>
                                                <td data-label={String(t('score'))}>
                                                    {o.scoredCalls === 0 ? '—' : o.averageScore.toFixed(1)}
                                                </td>
                                                <td data-label={String(t('successful'))}>
                                                    {o.callsCount ? `${normalizeRate(o.successRate).toFixed(0)}%` : '—'}
                                                </td>
                                                <td data-label={String(r('CSAT'))}>{o.avgCsat ?? '—'}</td>
                                                <td data-label={String(t('negative'))}>{o.negativeRate.toFixed(0)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {!data.agentScorecards?.length && <p className={cls.message}>{t('noCalls')}</p>}
                        </Section>
                        <Section title={String(t('calls'))} hint={String(t('callsHint'))} className={cls.callSection}>
                            <PreviewMainCalls
                                key={JSON.stringify(filters)}
                                query={filters}
                                project={props.project}
                                onOpen={channelId => {
                                    open({ kind: 'call', title: String(t('callAnalysis')), channelId })
                                }}
                            />
                        </Section>
                    </div>
                </>
            )}
            <SidePanel
                className={cls.sidePanel}
                isOpen={Boolean(current)}
                onClose={close}
                title={current?.title ?? ''}
                onBack={
                    stack.length > 1
                        ? () => {
                              setStack(old => old.slice(0, -1))
                          }
                        : undefined
                }
                backLabel={stack.length > 1 ? String(t('backTo', { title: stack[stack.length - 2].title })) : undefined}
            >
                {current && data && (
                    <PreviewPanel
                        entry={current}
                        data={data}
                        project={props.project}
                        open={open}
                        update={entry => {
                            setStack(old => [...old.slice(0, -1), entry])
                        }}
                    />
                )}
            </SidePanel>
        </div>
    )
}

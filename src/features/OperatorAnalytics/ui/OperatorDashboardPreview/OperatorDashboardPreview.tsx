import { Tooltip } from '@mui/material'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart3, Check, ChevronDown, ChevronRight, Clock3, Phone, Users, ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import {
    useQualityDashboardQuery as useGetOperatorDashboard,
    WITHOUT_PROJECT_FILTER,
    type OperatorDashboardResponse,
    type OperatorProject
} from '@/entities/Report'
import { SidePanel } from '@/shared/ui/redesign-v3'
import { ALL_DEFAULT_METRICS, normalizeRate } from '../../lib/metricVisual'
import { PreviewPanel, callsEntry, type PreviewEntry } from './PreviewPanel'
import {
    dayQuery,
    hourQuery,
    trendSeries,
    operatorQuery,
    previewDuration,
    operatorIdentity,
    operatorSelection,
    scoreTone,
    sortedOperators,
    customMetricDisplay,
    type OperatorSortKey,
    type PreviewFilters
} from './previewModel'
import { OperatorFilter } from './OperatorFilter'
import cls from './OperatorDashboardPreview.module.scss'

interface Props {
    renderCallDetail?: (channelId: string, onDeleted: () => void) => ReactNode
    peopleControl?: ReactNode
    isAdmin?: boolean
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

const identity = operatorIdentity

export function OperatorDashboardPreview(props: Props) {
    const { t, i18n } = useTranslation('call-records-preview')
    const { t: r } = useTranslation('reports')
    const [operatorIds, setOperatorIds] = useState<string[]>([])
    const [sort, setSort] = useState<{ key: OperatorSortKey, descending: boolean }>({ key: 'averageScore', descending: true })
    const [stack, setStack] = useState<PreviewEntry[]>([])
    const focus = useRef<HTMLElement | null>(null)
    const selected = props.data?.agentScorecards?.filter(o => operatorIds.includes(identity(o))) ?? []
    const single = selected.length === 1 ? selected[0] : undefined
    const scope = operatorSelection(selected)
    const filters = { ...props.filters, ...scope }
    const summaryQuery = useGetOperatorDashboard(filters, { skip: !selected.length || props.loading || props.error, refetchOnMountOrArgChange: true, pollingInterval: 15000 })
    const data = selected.length ? summaryQuery.currentData : props.data
    const loading = props.loading || Boolean(selected.length && (summaryQuery.isFetching || !data) && !summaryQuery.isError)
    const error = props.error || Boolean(selected.length && summaryQuery.isError)
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
    }, [operatorIds])
    const current = stack.at(-1)
    const metric = (metricId: string, title: string) => {
        open({
            kind: 'metric',
            title,
            entry: {
                kind: 'operatorMetric',
                metricId,
                metricLabel: title,
                ...(single
                    ? {
                          operatorName: single.operatorName,
                          operatorId: single.operatorId,
                          operatorAccountId: single.operatorAccountId
                      }
                    : {})
            },
            filters
        })
    }
    const noOperator = (name?: string | null) => (!name || name === 'Unknown Operator' ? String(t('noOperator')) : name)
    const total = data?.totalAnalyzed ?? 0
    const successCount = data?.successfulCount
    const unsuccessfulCount = data?.unsuccessfulCount
    const unknownOutcomeCount = data?.unknownOutcomeCount ?? 0
    const knownOutcomes = (successCount ?? 0) + (unsuccessfulCount ?? 0)
    const success = successCount != null && unsuccessfulCount != null
        ? (knownOutcomes ? successCount * 100 / knownOutcomes : 0)
        : Math.min(100, Math.max(0, data?.successRate ?? 0))
    const hasOutcome = successCount != null ? knownOutcomes > 0 : total > 0
    const defaults = ALL_DEFAULT_METRICS.filter(
        m => !props.project?.visibleDefaultMetrics?.length || props.project.visibleDefaultMetrics.includes(m.key)
    )
    const displayMetrics = defaults
    const operators = sortedOperators(data?.agentScorecards ?? [], sort.key, sort.descending)
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
    const topics = (stats?.topics ?? data?.tagStats?.map(tag => ({ tagId: tag.tagId, name: tag.name, callsCount: tag.callsCount })) ?? [])
        .filter(topic => topic.tagId !== null || topic.callsCount > 0)
        .map(topic => ({
            ...topic,
            name: topic.tagId === null ? String(t('withoutTopic')) : topic.name?.trim() || String(t('unnamedTopic'))
        }))
    return (
        <div className={cls.root} data-testid="call-records-preview">
            <div className={cls.filters}>
                <label className={cls.filterControl}>
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
                    <ChevronDown size={15} aria-hidden />
                </label>
                {props.peopleControl ?? (<OperatorFilter
                    options={props.data?.agentScorecards?.filter(o => o.operatorId || o.operatorName !== 'Unknown Operator') ?? []}
                    value={operatorIds}
                    onChange={setOperatorIds}
                    disabled={props.loading || props.error}
                />)}
            </div>
            {error ? (
                <div className={cls.message} role="alert">
                    <p>{t('loadError')}</p>
                    <button
                        className={cls.button}
                        onClick={() => {
                            if (selected.length && !props.error) summaryQuery.refetch()
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
                    {props.isAdmin && (data.excludedLowQualityCount ?? 0) > 0 && (
                        <p className={cls.caption}>{t('lowQualityAdminHint', { count: data.excludedLowQualityCount })}</p>
                    )}
                    <section className={cls.kpis} aria-label={String(t('summary'))}>
                        {[
                            { label: t('calls'), value: total, hint: t('analyzed'), icon: Phone, query: filters },
                            {
                                label: t('score'),
                                value: total && data.averageScore != null && data.scoredCalls !== 0 ? data.averageScore.toFixed(1) : '—',
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
                                value: hasOutcome ? `${success.toFixed(0)}%` : '—',
                                hint: successCount == null ? '' : t('successCount', { count: successCount, total: knownOutcomes }),
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
                    {!total && <div className={cls.emptySummary}>{t('noCalls')}</div>}
                    <div className={cls.grid}>
                        <Section
                            title={String(t('trend'))}
                            hint={String(t('trendHint'))}
                            className={cls.trend}
                            action={
                                <span className={cls.caption}>
                                    {t({ hour: 'byHour', day: 'byDay', month: 'byMonth', year: 'byYear' }[trend.unit] ?? 'byDay')}
                                </span>
                            }
                        >
                            <div className={cls.chartLegend}>
                                {(['incoming', 'outgoing', 'internal'] as const).map(type => (
                                    <span key={type}>
                                        <i data-type={type} />
                                        {t('type_' + type)}
                                    </span>
                                ))}
                            </div>
                            {series.length ? (
                                <div className={cls.chartScroll}>
                                    <div
                                        className={cls.chart}
                                        data-unit={trend.unit}
                                        style={{ gridTemplateColumns: `repeat(${series.length}, minmax(${useHourly ? '0' : '34px'}, 1fr))` }}
                                    >
                                        {series.map((point, index) => {
                                            const openBucket = (callType?: 'incoming' | 'outgoing' | 'internal') => {
                                                const query = useHourly ? hourQuery(point.label, filters) : dayQuery(point.label, filters)
                                                if (query) {
open(
                                                        callsEntry(
                                                            String(t('calls')) +
                                                                ' / ' +
                                                                bucketTitle(point.label) +
                                                                (callType ? ' / ' + String(t('type_' + callType)) : ''),
                                                            { ...query, ...(callType ? { callType } : {}) }
                                                        )
                                                    )
}
                                            }
                                            return (
                                                <div key={point.label} className={cls.chartBucket}>
                                                    <button
                                                        type="button"
                                                        className={cls.bucketTotal}
                                                        title={bucketTitle(point.label) + ': ' + point.callsCount}
                                                        onClick={() => {
                                                            openBucket()
                                                        }}
                                                    >
                                                        {point.callsCount}
                                                    </button>
                                                    <div className={cls.barStack}>
                                                        {point.byCallType ? (
                                                            (['incoming', 'outgoing', 'internal'] as const)
                                                                .filter(type => point.byCallType![type] > 0)
                                                                .map(type => (
                                                                    <Tooltip
                                                                        key={type}
                                                                        title={bucketTitle(point.label) + ' / ' + String(t('type_' + type)) + ': ' + point.byCallType![type]}
                                                                        arrow
                                                                        enterTouchDelay={0}
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            className={cls.barSegment}
                                                                            data-type={type}
                                                                            style={{ height: (point.byCallType![type] * 90) / max + 'px' }}
                                                                            aria-label={
                                                                                String(t('type_' + type)) +
                                                                                ': ' +
                                                                                point.byCallType![type] +
                                                                                ' / ' +
                                                                                bucketTitle(point.label)
                                                                            }
                                                                            onClick={() => {
                                                                                openBucket(type)
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                ))
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className={cls.barSegment}
                                                                data-type="incoming"
                                                                style={{ height: Math.max(2, (point.callsCount * 90) / max) + 'px' }}
                                                                aria-label={String(t('calls')) + ' / ' + bucketTitle(point.label)}
                                                                onClick={() => {
                                                                    openBucket()
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className={cls.bucketDate}
                                                        data-axis-label={!useHourly || index % 4 === 0}
                                                        aria-label={bucketTitle(point.label)}
                                                        onClick={() => {
                                                            openBucket()
                                                        }}
                                                    >
                                                        {useHourly
                                                            ? new Date(point.label).toLocaleTimeString(i18n.language, {
                                                                  hour: '2-digit',
                                                                  minute: '2-digit'
                                                              })
                                                            : /^\d{4}-\d{2}(-\d{2})?$/.test(point.label)
                                                            ? new Date(
                                                                  (point.label.length === 7 ? point.label + '-01' : point.label) +
                                                                      'T12:00:00Z'
                                                              ).toLocaleDateString(i18n.language, {
                                                                  day: point.label.length === 7 ? undefined : 'numeric',
                                                                  month: 'short',
                                                                  timeZone: 'UTC'
                                                              })
                                                            : point.label}
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <p className={cls.message}>{t('noCalls')}</p>
                            )}
                        </Section>
                        <Section title={String(t('outcome'))} hint={String(t('outcomeHint'))} className={cls.outcome}>
                            <div className={cls.outcomeValue}>
                                <strong>{hasOutcome ? `${success.toFixed(0)}%` : '—'}</strong>
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
                                        <b>{(ok ? successCount : unsuccessfulCount) ?? '—'}</b>
                                        <ChevronRight size={14} aria-hidden />
                                    </button>
                                ))}
                                {unknownOutcomeCount > 0 && <button type="button" className={cls.unknownOutcome} onClick={() => {
                                    open(callsEntry(String(t('outcomeUnknown')), { ...filters, withoutOutcome: true }))
                                }}><span>{t('outcomeUnknown')}</span><b>{unknownOutcomeCount}</b><ChevronRight size={14} aria-hidden /></button>}
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
                                        <span className={cls.operatorScore} data-tone={key === 'positive' ? 'high' : key === 'negative' ? 'low' : 'none'}>
                                            <i aria-hidden />
                                            {t(key)}
                                        </span>
                                        <b>{data.sentimentDistribution[key].toLocaleString(i18n.language, { maximumFractionDigits: 2 })}%</b>
                                        <ChevronRight size={14} aria-hidden />
                                    </button>
                                ))}
                            </details>
                        </Section>
                        <Section
                            title={String(t('topics'))}
                            hint={String(t('topicsHint'))}
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
                                        <b className={cls.operatorScore} data-tone={scoreTone(total ? value : undefined)}>
                                            <i aria-hidden />
                                            {total && Number.isFinite(value) ? `${Math.round(value)}%` : '—'}
                                        </b>
                                        <ChevronRight size={15} aria-hidden />
                                    </button>
                                )
                            })}
                            {props.project?.customMetricsSchema?.map(m => {
                                const display = customMetricDisplay(m, data.customMetricsAggregated?.[m.id])
                                return (
                                    <button
                                        type="button"
                                        className={cls.metricRow}
                                        key={m.id}
                                        onClick={() => {
                                            metric(m.id, m.name)
                                        }}
                                        title={display.distribution ?? m.description}
                                    >
                                        <span>
                                            {m.name}
                                            <i className={cls.metricTrack}>
                                                <i style={{ width: (display.percent ?? 0) + '%' }} />
                                            </i>
                                        </span>
                                        <b className={cls.operatorScore} data-tone={scoreTone(
                                            !total || display.percent == null || (m.type !== 'number' && m.type !== 'boolean') || m.polarity === 'neutral'
                                                ? undefined
                                                : m.polarity === 'negative' ? 100 - display.percent : display.percent
                                        )}>
                                            <i aria-hidden />
                                            {total ? display.text : '—'}
                                        </b>
                                        <ChevronRight size={15} aria-hidden />
                                    </button>
                                )
                            })}
                        </Section>
                        <Section title={String(t('operators'))} hint={String(t('operatorsHint'))} className={cls.operators}>
                            <div className={cls.mobileSort}>
                                <label>
                                    {t('sortBy')}
                                    <select aria-label={String(t('sortBy'))} value={sort.key} onChange={e => {
                                        setSort({ key: e.target.value as OperatorSortKey, descending: e.target.value !== 'operatorName' })
                                    }}>
                                        {(['operatorName', 'callsCount', 'averageScore', 'successRate', 'avgCsat', 'negativeRate'] as OperatorSortKey[]).map((key, index) => <option key={key} value={key}>{[t('operator'), t('calls'), t('score'), t('successful'), r('CSAT'), t('negative')][index]}</option>)}
                                    </select>
                                </label>
                                <button type="button" className={cls.iconButton} aria-label={String(t(sort.descending ? 'sortAscending' : 'sortDescending'))} onClick={() => { setSort({ ...sort, descending: !sort.descending }) }}>
                                    {sort.descending ? <ArrowDown size={16} aria-hidden /> : <ArrowUp size={16} aria-hidden />}
                                </button>
                            </div>
                            <div className={cls.tableWrap}>
                                <table className={cls.table}>
                                    <thead>
                                        <tr>
                                            {(
                                                [
                                                    'operatorName',
                                                    'callsCount',
                                                    'averageScore',
                                                    'successRate',
                                                    'avgCsat',
                                                    'negativeRate'
                                                ] as OperatorSortKey[]
                                            ).map((key, index) => (
                                                <th
                                                    key={key}
                                                    aria-sort={sort.key === key ? (sort.descending ? 'descending' : 'ascending') : 'none'}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSort({
                                                                key,
                                                                descending: sort.key === key ? !sort.descending : key !== 'operatorName'
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            [
                                                                t('operator'),
                                                                t('calls'),
                                                                t('score'),
                                                                t('successful'),
                                                                r('CSAT'),
                                                                t('negative')
                                                            ][index]
                                                        }
                                                        {sort.key === key ? (
                                                            sort.descending ? (
                                                                <ArrowDown size={13} aria-hidden />
                                                            ) : (
                                                                <ArrowUp size={13} aria-hidden />
                                                            )
                                                        ) : (
                                                            <ChevronsUpDown size={13} aria-hidden />
                                                        )}
                                                    </button>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {operators.map(o => (
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
                                                    <span
                                                        className={cls.operatorScore}
                                                        data-tone={scoreTone(o.scoredCalls === 0 ? null : o.averageScore)}
                                                    >
                                                        <i />
                                                        {o.scoredCalls === 0 ? '—' : Number(o.averageScore.toFixed(1))}
                                                    </span>
                                                </td>
                                                <td data-label={String(t('successful'))}>
                                                    {o.callsCount ? `${normalizeRate(o.successRate).toFixed(0)}%` : '—'}
                                                </td>
                                                <td data-label={String(r('CSAT'))}>{typeof o.avgCsat === 'number' && Number.isFinite(o.avgCsat) ? Number(o.avgCsat.toFixed(2)) : '—'}</td>
                                                <td data-label={String(t('negative'))}>{o.negativeRate.toFixed(0)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {!data.agentScorecards?.length && <p className={cls.message}>{t('noCalls')}</p>}
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
                        renderCallDetail={props.renderCallDetail ? channelId => props.renderCallDetail!(channelId, () => { close(); props.onRetry() }) : undefined}
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

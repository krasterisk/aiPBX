import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'
import type { OperatorDashboardResponse, OperatorProject } from '@/entities/Report'
import { CallPanelBody } from '../OperatorDashboard/DrilldownPanel/CallPanelBody'
import { OperatorMetricPanelBody } from '../OperatorDashboard/DrilldownPanel/OperatorPanelBody'
import type { PanelEntry } from '../../model/panelStack'
import { PreviewCalls } from './PreviewCalls'
import { operatorQuery, type PreviewCallsQuery, type PreviewFilters } from './previewModel'
import cls from './OperatorDashboardPreview.module.scss'

export type PreviewEntry =
    | {
          kind: 'calls'
          title: string
          query: PreviewCallsQuery
          topicId?: string | null
          page: number
          search: string
          tab: 'calls' | 'operators'
      }
    | { kind: 'call', title: string, channelId: string }
    | { kind: 'metric', title: string, entry: Extract<PanelEntry, { kind: 'operatorMetric' }>, filters: PreviewFilters }

interface Props {
    entry: PreviewEntry
    data: OperatorDashboardResponse
    project?: OperatorProject
    open: (entry: PreviewEntry) => void
    update: (entry: PreviewEntry) => void
}

export function callsEntry(title: string, query: PreviewCallsQuery, topicId?: string | null): Extract<PreviewEntry, { kind: 'calls' }> {
    return { kind: 'calls', title, query, topicId, page: 1, search: '', tab: 'calls' }
}

export function PreviewPanel({ entry, data, project, open, update }: Props) {
    const { t } = useTranslation('call-records-preview')
    const openCall = (channelId: string) => {
        open({ kind: 'call', title: String(t('callAnalysis')), channelId })
    }
    if (entry.kind === 'call') {
        return (
            <div className={cls.legacy}>
                <CallPanelBody channelId={entry.channelId} />
            </div>
        )
    }
    if (entry.kind === 'metric') {
        return (
            <div className={cls.legacy}>
                <OperatorMetricPanelBody
                    entry={entry.entry}
                    filters={entry.filters}
                    description={project?.customMetricsSchema?.find(m => m.id === entry.entry.metricId)?.description}
                    onOpenCall={openCall}
                />
            </div>
        )
    }
    const topics = data.operatorTopicStats
    const hasOperators = entry.topicId !== undefined && Boolean(topics)
    const operators =
        topics?.operators
            .map(o => ({ ...o, count: o.topics.find(item => item.tagId === entry.topicId)?.callsCount ?? 0 }))
            .filter(o => o.count > 0) ?? []
    const topicCount = topics?.topics.find(topic => topic.tagId === entry.topicId)?.callsCount ?? 0
    return (
        <div className={cls.panelContent}>
            {hasOperators && (
                <div className={cls.tabs} role="tablist" aria-label={String(t('details'))}>
                    {(['calls', 'operators'] as const).map(tab => (
                        <button
                            type="button"
                            role="tab"
                            key={tab}
                            aria-selected={entry.tab === tab}
                            onClick={() => {
                                update({ ...entry, tab })
                            }}
                        >
                            {t(tab)}
                        </button>
                    ))}
                </div>
            )}
            {hasOperators && entry.tab === 'operators' ? (
                <div>
                    <p className={cls.caption}>{t('topicOperatorsHint')}</p>
                    {operators.length ? (
                        operators.map((o, index) => (
                            <button
                                type="button"
                                key={`${o.operatorAccountId}:${o.operatorId}:${index}`}
                                className={cls.operatorCard}
                                onClick={() => {
                                    open(
                                        callsEntry(`${o.operatorName || t('noOperator')} / ${entry.title}`, {
                                            ...entry.query,
                                            ...operatorQuery({ ...o, operatorName: o.operatorName ?? 'Unknown Operator' })
                                        })
                                    )
                                }}
                            >
                                <span className={cls.operatorHead}>
                                    <strong>{o.operatorName || t('noOperator')}</strong>
                                    <ChevronRight size={17} aria-hidden />
                                </span>
                                <span className={cls.operatorNumbers}>
                                    <span>
                                        <small>{t('calls')}</small>
                                        <b>{o.count}</b>
                                    </span>
                                    <span>
                                        <small>{t('share')}</small>
                                        <b>{topicCount ? `${Math.round((o.count * 100) / topicCount)}%` : '—'}</b>
                                    </span>
                                </span>
                            </button>
                        ))
                    ) : (
                        <p className={cls.message}>{t('noCalls')}</p>
                    )}
                </div>
            ) : (
                <PreviewCalls
                    key={JSON.stringify(entry.query)}
                    query={entry.query}
                    project={project}
                    page={entry.page}
                    search={entry.search}
                    onPage={page => {
                        update({ ...entry, page })
                    }}
                    onSearch={search => {
                        update({ ...entry, search, page: 1 })
                    }}
                    onOpen={openCall}
                />
            )}
        </div>
    )
}

export function PreviewMainCalls(props: Omit<React.ComponentProps<typeof PreviewCalls>, 'page' | 'search' | 'onPage' | 'onSearch'>) {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    return (
        <PreviewCalls
            {...props}
            page={page}
            search={search}
            onPage={setPage}
            onSearch={value => {
                setSearch(value)
                setPage(1)
            }}
        />
    )
}

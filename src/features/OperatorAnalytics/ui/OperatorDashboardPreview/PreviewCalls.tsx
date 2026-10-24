import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@mui/material'
import { ChevronLeft, ChevronRight, Download, Search, PhoneIncoming, PhoneOutgoing, Network } from 'lucide-react'
import { useGetOperatorCdrs, type OperatorProject } from '@/entities/Report'
import { operatorCallScore } from '../../lib/operatorCallScore'
import { ALL_DEFAULT_METRICS } from '../../lib/metricVisual'
import { previewCsv, previewDuration, scoreTone, type PreviewCallsQuery } from './previewModel'
import cls from './OperatorDashboardPreview.module.scss'

interface Props {
    query: PreviewCallsQuery
    project?: OperatorProject
    page: number
    search: string
    onPage: (page: number) => void
    onSearch: (search: string) => void
    onOpen: (channelId: string) => void
}

export function PreviewCalls({ query, project, page, search, onPage, onSearch, onOpen }: Props) {
    const { t } = useTranslation('call-records-preview')
    const { t: r } = useTranslation('reports')
    const [input, setInput] = useState(search)
    const limit = 10
    const {
        currentData: data,
        isFetching,
        isError,
        refetch
    } = useGetOperatorCdrs({ ...query, page, limit, search: search || undefined, sortField: 'createdAt', sortOrder: 'DESC' })
    const rows = data?.data ?? []
    const total = data?.total ?? 0
    const pages = Math.max(1, Math.ceil(total / limit))
    const score = (call: (typeof rows)[number]) => {
        const metrics = call.metrics ?? call.analytics?.metrics
        return operatorCallScore(
            metrics
                ? {
                      ...metrics,
                      custom_metrics: call.customMetrics ?? (metrics as unknown as Record<string, unknown>).custom_metrics
                  }
                : undefined,
            project
                ? project.visibleDefaultMetrics?.length
                    ? project.visibleDefaultMetrics
                    : ALL_DEFAULT_METRICS.map(m => m.key)
                : undefined,
            Boolean(project)
        )
    }
    const operator = (call: (typeof rows)[number]) => {
        const name = (call.assistantName || call.operatorName || '').trim()
        return name && name !== 'Unknown Operator' ? name : String(t('noOperator'))
    }
    const scoreMetrics = [
        ...ALL_DEFAULT_METRICS.filter(m => !project?.visibleDefaultMetrics?.length || project.visibleDefaultMetrics.includes(m.key)).map(
            m => String(r(m.labelKey))
        ),
        ...(project?.customMetricsSchema?.filter(m => m.type === 'number' || m.type === 'boolean').map(m => m.name) ?? [])
    ].join(', ')
    const typeIcon = (type?: string | null) =>
        type === 'outgoing' ? (
            <PhoneOutgoing size={14} aria-hidden />
        ) : type === 'internal' ? (
            <Network size={14} aria-hidden />
        ) : (
            <PhoneIncoming size={14} aria-hidden />
        )
    const exportPage = () => {
        const csv = previewCsv([
            [
                String(t('date')),
                String(t('operator')),
                String(t('extension')),
                String(t('client')),
                String(t('duration')),
                String(t('score'))
            ],
            ...rows.map(call => [
                new Date(call.createdAt).toLocaleString(),
                operator(call),
                call.operatorExtension ?? '',
                call.clientPhone || call.callerId || '',
                previewDuration(call.duration),
                score(call) ?? ''
            ])
        ])
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
        const link = document.createElement('a')
        link.href = url
        link.download = 'call-records-page.csv'
        link.click()
        setTimeout(() => {
            URL.revokeObjectURL(url)
        }, 1000)
    }
    return (
        <div className={cls.calls}>
            <div className={cls.callToolbar}>
                <form
                    onSubmit={e => {
                        e.preventDefault()
                        onSearch(input.trim())
                    }}
                >
                    <Search size={16} aria-hidden />
                    <input
                        aria-label={String(t('search'))}
                        placeholder={String(t('search'))}
                        value={input}
                        onChange={e => {
                            setInput(e.target.value)
                        }}
                    />
                    <button type="submit" className={cls.textButton}>
                        {t('find')}
                    </button>
                </form>
                <button
                    type="button"
                    className={cls.iconButton}
                    onClick={exportPage}
                    disabled={!rows.length || isFetching}
                    aria-label={String(t('exportPage'))}
                    title={String(t('exportPage'))}
                >
                    <Download size={17} aria-hidden />
                </button>
            </div>
            {isError ? (
                <div className={cls.message} role="alert">
                    <p>{t('loadError')}</p>
                    <button type="button" className={cls.button} onClick={refetch}>
                        {t('retry')}
                    </button>
                </div>
            ) : isFetching && !data ? (
                <p className={cls.message} role="status">
                    {t('loading')}
                </p>
            ) : !rows.length ? (
                <p className={cls.message}>{t('noCalls')}</p>
            ) : (
                <div aria-busy={isFetching}>
                    {rows.map(call => (
                        <button
                            type="button"
                            className={cls.callRow}
                            key={call.id}
                            onClick={() => {
                                onOpen(String(call.channelId || call.id))
                            }}
                            aria-label={String(
                                t('openCall', { date: new Date(call.createdAt).toLocaleString(), operator: operator(call) })
                            )}
                        >
                            <time dateTime={call.createdAt} className={cls.callDate}>
                                <strong>{new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                                <span>{new Date(call.createdAt).toLocaleDateString()}
                                <Tooltip title={String(t('type_' + (call.callType ?? 'incoming')))} arrow enterTouchDelay={0}>
                                    <span
                                        className={cls.callType}
                                        tabIndex={0}
                                        aria-label={String(t('type_' + (call.callType ?? 'incoming')))}
                                        onClick={event => {
                                            event.stopPropagation()
                                        }}
                                        onKeyDown={event => {
                                            event.stopPropagation()
                                        }}
                                    >
                                        {typeIcon(call.callType)}
                                    </span>
                                </Tooltip>
                                </span>
                            </time>
                            <span className={cls.callIdentity}>
                                <strong>{operator(call)}</strong>
                                <span>
                                    {call.clientPhone || call.callerId || '—'}
                                    {call.operatorExtension && (
                                        <>
                                            {' '}
                                            · {t('extensionShort')} {call.operatorExtension}
                                        </>
                                    )}
                                </span>
                            </span>
                            <span className={cls.callDuration} title={String(t('duration'))}>
                                {previewDuration(call.duration)}
                            </span>
                            <Tooltip title={String(t('callScoreHint', { metrics: scoreMetrics }))} arrow enterTouchDelay={0}>
                                <span
                                    className={cls.score}
                                    tabIndex={0}
                                    data-tone={scoreTone(score(call))}
                                    onClick={event => {
                                        event.stopPropagation()
                                    }}
                                    onKeyDown={event => {
                                        event.stopPropagation()
                                    }}
                                >
                                    <i />
                                    {score(call) ?? '—'}
                                    <small>{score(call) != null ? '/ 100' : ''}</small>
                                </span>
                            </Tooltip>
                            <ChevronRight className={cls.chevron} size={17} aria-hidden />
                        </button>
                    ))}
                </div>
            )}
            <div className={cls.pagination}>
                <span>{t('page', { page, pages, total })}</span>
                <div>
                    <button
                        type="button"
                        className={cls.iconButton}
                        onClick={() => {
                            onPage(page - 1)
                        }}
                        disabled={page <= 1 || isFetching}
                        aria-label={String(t('previous'))}
                    >
                        <ChevronLeft size={17} />
                    </button>
                    <button
                        type="button"
                        className={cls.iconButton}
                        onClick={() => {
                            onPage(page + 1)
                        }}
                        disabled={page >= pages || isFetching}
                        aria-label={String(t('next'))}
                    >
                        <ChevronRight size={17} />
                    </button>
                </div>
            </div>
        </div>
    )
}

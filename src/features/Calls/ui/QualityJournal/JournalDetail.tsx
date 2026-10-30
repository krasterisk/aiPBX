import { useAnalyzeQualityPreviewMutation, useGetQualityDetailQuery, useGetQualityHistoryQuery, publishedQuality, formatQualityScore } from '@/entities/Report'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { ChevronRight } from 'lucide-react'
import { isUserAdmin } from '@/entities/User'
import { useGetReportDialogs, isOperatorAnalyticsSource, type Report, type OperatorProject } from '@/entities/Report'

import { AudioPlayback, SidePanel } from '@/shared/ui/redesign-v3'
import { callCosts } from '../../lib/callCosts'
import { CallAdminActions } from './CallAdminActions'

import { journalDuration, journalScoreTone } from '../../lib/journalModel'
import { journalMetrics, qualityJournalMetrics, journalTurns, metricPercent, type JournalMetric } from '../../lib/journalDetailModel'
import cls from './CallsJournal.module.scss'
import { QualityCorrectionEditor } from './QualityCorrectionEditor'

type DetailTab = 'overview' | 'transcript' | 'metadata'
export function JournalDetail({ report: initialReport, project, onDeleted }: { report: Report, project?: OperatorProject, onDeleted?: () => void }) {
    const { t, i18n } = useTranslation('quality-journal')
    const { t: r } = useTranslation('reports')
    const admin = useSelector(isUserAdmin)
    const operator = isOperatorAnalyticsSource(initialReport.source)
    const [runId, setRunId] = useState<string | undefined>()
    const [showHistory, setShowHistory] = useState(false)
    const [historyBefore, setHistoryBefore] = useState<string | undefined>()
    const detail = useGetQualityDetailQuery({ channelId: initialReport.channelId, runId }, { refetchOnMountOrArgChange: true })
    const history = useGetQualityHistoryQuery({ channelId: initialReport.channelId, before: historyBefore }, { skip: !admin || !operator || !showHistory })
    const report: Report = detail.currentData ? { ...initialReport, ...detail.currentData.record, analytics: detail.currentData.analytics ?? undefined } : initialReport
    const tabs: DetailTab[] = admin ? ['overview', 'transcript', 'metadata'] : ['overview', 'transcript']
    const [tab, setTab] = useState<DetailTab>('overview')
    const [selectedMetric, setSelectedMetric] = useState<JournalMetric | null>(null)
    const { currentData: dialogs, isFetching, isError, refetch } = useGetReportDialogs(report.channelId, { skip: tab !== 'transcript' || Boolean(report.transcription) || Boolean(runId) })
    const [analyzePreview, previewRequest] = useAnalyzeQualityPreviewMutation()
    const [message, setMessage] = useState('')
    const metrics = report.analytics?.metrics
    const evaluation = detail.currentData?.evaluation
    const items = evaluation && detail.currentData ? qualityJournalMetrics(detail.currentData) : journalMetrics(report)
    const turns = journalTurns(report, runId ? undefined : dialogs)
    const score = operator ? publishedQuality(report.analytics) : null
    const success = report.analytics?.qualitySummary?.success ?? metrics?.scenario_analysis?.success ?? metrics?.success
    const mood = String(report.analytics?.sentiment || metrics?.customer_sentiment || metrics?.user_satisfaction?.sentiment || '').toLowerCase()
    const sentiment = ['positive', 'neutral', 'negative'].includes(mood) ? mood : 'unknown'
    const csat = report.analytics?.csat ?? metrics?.csat ?? metrics?.user_satisfaction?.csat
    const topics = metrics?._topics
    const [tagIds, setTagIds] = useState(topics?.tags ?? [])
    const [tagNames, setTagNames] = useState(topics?.tag_names ?? {})
    const identity = <>
        <small>{new Date(report.createdAt).toLocaleString(i18n.language)}</small>
        <div className={cls.detailPhoneLine}><h2>{report.callerId || t('noPhone')}</h2><span className={cls.direction}>{t('type_' + (report.callType || 'incoming'))}</span></div>
        <p>{report.assistantName || t('noOperator')}{report.operatorExtension ? ` · ${t('extension')} ${report.operatorExtension}` : ''} · {journalDuration(report.duration)}</p>
        <div className={cls.detailBadges}>{tagIds.map(tag => <span className={cls.topic} key={tag}>{tagNames[tag] || project?.callTaxonomy?.find(item => item.id === tag)?.name || tag}</span>)}<span className={cls.result}>{report.status === 'processing' ? t('processing') : report.analytics ? t('analyzed') : t('notAnalyzed')}</span></div>
    </>
    const metricValue = (item: JournalMetric) => item.status && item.status !== 'assessed' ? t('quality_' + item.status) : typeof item.value === 'boolean' ? t(item.value ? 'yes' : 'no') : `${typeof item.value === 'number' ? Number(item.value.toFixed(2)) : item.value}${item.unit ? ` ${item.unit}` : ''}`
    const metricTone = (item: JournalMetric) => {
        const percent = metricPercent(item)
        return item.polarity === 'neutral' || !item.polarity ? 'none' : journalScoreTone(percent == null ? null : item.polarity === 'negative' ? 100 - percent : percent)
    }
    const assessment = (key: string) => {
        const correction = detail.currentData?.corrections?.find(item => item.metricId === key && item.origin === 'summary')
        const value = correction ? { rationale: correction.note ?? undefined, quote: undefined } : metrics?._assessments?.[key]
        return value && <div className={cls.assessment}>{value.rationale && <p>{value.rationale}</p>}{value.quote && <blockquote>{value.quote}</blockquote>}</div>
    }
    const copyId = async () => {
        try { await navigator.clipboard.writeText(report.channelId); setMessage(String(t('copied'))) } catch { setMessage(String(t('copyError'))) }
    }
    const exportDetails = () => {
        // Export only this authorized record, without an executable spreadsheet format.
        const blob = new Blob([JSON.stringify({ id: report.id, channelId: report.channelId, createdAt: report.createdAt, analytics: report.analytics, transcription: report.transcription, dialogs }, null, 2)], { type: 'application/json;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a'); link.href = url; link.download = `call-${String(report.id).replace(/[^a-z0-9_-]/gi, '_')}.json`; link.click(); URL.revokeObjectURL(url)
    }
    if (runId && !detail.currentData) return <div className={cls.detailBody}><p role={detail.isError ? 'alert' : 'status'}>{t(detail.isError ? 'qualityLoadError' : 'loading')}</p><button type="button" className={cls.button} onClick={() => { setRunId(undefined) }}>{t('qualityCurrent')}</button></div>
    return <div className={cls.detail}>
        {detail.isFetching && <p role="status">{t('loading')}</p>}
        {detail.isError && <p role="alert">{t('qualityLoadError')} <button type="button" onClick={() => { void detail.refetch() }}>{t('retry')}</button></p>}
        <header className={cls.detailHeader}>
            {report.recordUrl ? <AudioPlayback src={report.recordUrl} label={String(t('listen'))} iconOnly>{identity}</AudioPlayback> : identity}
            {!report.recordUrl && <p className={cls.note}>{t('noRecording')}</p>}
        </header>
        <div className={cls.detailTabs} role="tablist" aria-label={String(t('detailSections'))}>{tabs.map(value => <button type="button" role="tab" id={`journal-tab-${value}`} aria-controls={`journal-panel-${value}`} aria-selected={tab === value} tabIndex={tab === value ? 0 : -1} key={value} onClick={() => { setTab(value) }} onKeyDown={e => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return
            e.preventDefault(); const values = tabs; const next = e.key === 'Home' ? 0 : e.key === 'End' ? values.length - 1 : (values.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : values.length - 1)) % values.length; setTab(values[next]); document.getElementById(`journal-tab-${values[next]}`)?.focus()
        }}>{t('detail_' + value)}</button>)}</div>
        <div role="tabpanel" id={`journal-panel-${tab}`} aria-labelledby={`journal-tab-${tab}`} className={cls.detailBody}>
            {tab === 'overview' && <>

                <div className={cls.detailStats}>
                    <div><small>{t('metricScore')}</small><strong className={cls.score} data-tone={journalScoreTone(score)}><i aria-hidden />{formatQualityScore(score)}{score != null && <small>/100</small>}</strong></div>
                    <div><small>{t('csat')}</small><strong>{csat ?? '—'}{csat != null && <small> /5</small>}</strong></div>
                    <div><small>{t('sentiment')}</small><strong className={cls.mood} data-mood={sentiment}><i aria-hidden />{t('mood_' + sentiment)}</strong></div>
                </div>

                <section className={cls.detailSection}><h3>{t('summary')}</h3><p>{report.analytics?.summary || metrics?.summary || t('noSummary')}</p></section>
                <section className={cls.detailSection}><h3>{t('result')}</h3><p>{success === true ? t('successful') : success === false ? t('unsuccessful') : t('noResult')}</p>{metrics?.scenario_analysis?.summary && <p>{metrics.scenario_analysis.summary}</p>}{assessment('success')}{assessment('customer_sentiment')}{assessment('csat')}</section>
                <section className={cls.detailSection}><h3>{t('detail_metrics')}</h3>
                <p className={cls.note}>{t('metricsHint')}</p>
                {!items.length && <p>{t('noMetrics')}</p>}
                {items.map(item => <button type="button" key={item.id} className={cls.detailMetric} onClick={() => { setSelectedMetric(item) }}>
                    <div><span>{r(item.label)}</span><strong className={cls.score} data-tone={metricTone(item)}><i aria-hidden />{metricValue(item)}<ChevronRight size={14} aria-hidden /></strong></div>
                    {metricPercent(item) != null && <span className={cls.metricTrack}><i style={{ width: `${metricPercent(item)}%` }} /></span>}
                </button>)}
                {operator && metrics && !runId && <details className={cls.supervisor}><summary>{t('supervisor')}</summary>{evaluation && detail.currentData ? <QualityCorrectionEditor channelId={report.channelId} detail={detail.currentData} /> : null}</details>}
                </section>
                <details className={cls.callCost}><summary>{t('callCost')}</summary>
                    {callCosts(report).length ? callCosts(report).map(group => <dl className={cls.costRows} key={group.currency}>
                        {Object.entries(group.items).map(([key, amount]) => <div key={key}><dt>{t('cost_' + key)}</dt><dd>{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: group.currency, maximumFractionDigits: 4 }).format(amount)}</dd></div>)}
                        <div><dt>{t('cost_total')}</dt><dd>{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: group.currency, maximumFractionDigits: 4 }).format(group.total)}</dd></div>
                        {group.freeRuns > 0 && <div><dt>{t('freeRuns')}</dt><dd>{group.freeRuns}</dd></div>}
                    </dl>) : <p className={cls.note}>{t('noBilling')}</p>}
                </details>
                {!report.analytics && <p className={cls.note}>{t(report.status === 'processing' ? 'processing' : 'notAnalyzed')}</p>}
            </>}
            {tab === 'transcript' && <>
                {isFetching && <p role="status">{t('loading')}</p>}
                {isError && <div role="alert"><p>{t('transcriptError')}</p><button type="button" className={cls.button} onClick={() => { void refetch() }}>{t('retry')}</button></div>}
                {!turns.length && !isFetching && !isError && <p className={cls.note}>{t('noTranscript')}</p>}
                {turns.some(turn => turn.start == null) && <p className={cls.note}>{t('timestampUnavailable')}</p>}
                <div className={cls.transcript}>{turns.map(turn => <div key={turn.id} className={cls.turn} data-role={['operator', 'Assistant'].includes(turn.role) ? 'operator' : ['customer', 'User'].includes(turn.role) ? 'customer' : 'unknown'}>
                    <div className={cls.turnRole}><span>{t(['operator', 'Assistant'].includes(turn.role) ? 'speakerOperator' : ['customer', 'User'].includes(turn.role) ? 'speakerClient' : 'transcriptText')}</span>{turn.start != null ? <time>{journalDuration(turn.start)}</time> : <span className={cls.note} title={String(t('timestampUnavailable'))}>—</span>}</div><p>{turn.text}</p>
                </div>)}</div>
            </>}
            {admin && tab === 'metadata' && <>
                {operator && <section className={cls.detailSection}>
                    <p>{t('quality_' + (report.analytics?.qualityStatus || 'legacy'))}{report.analytics?.qualityCoverage != null && ` · ${t('qualityCoverage')}: ${Math.round(report.analytics.qualityCoverage * 100)}%`}</p>
                    {report.analytics?.qualityContextIncomplete && <p className={cls.note}>{t('qualityHistorical')}</p>}
                    {evaluation && <p className={cls.note}>{evaluation.result.formulaVersion} · {t('qualityCritical_' + evaluation.result.criticalStatus)}</p>}
                    <button type="button" className={cls.button} onClick={() => { setShowHistory(true) }}>{t('qualityHistory')}</button>
                    {runId && <button type="button" className={cls.button} onClick={() => { setRunId(undefined) }}>{t('qualityCurrent')}</button>}
                </section>}
                <CallAdminActions report={report} operator={operator} disabled={Boolean(runId) || previewRequest.isLoading || detail.isFetching} onDeleted={onDeleted} onChanged={() => { void detail.refetch() }} onCopy={() => { void copyId() }} onExport={exportDetails} onPreview={operator && !runId ? () => { setMessage(''); void analyzePreview(report.channelId).unwrap().catch(() => { setMessage(String(t('analysisError'))) }) } : undefined} />
                <dl className={cls.detailMeta}>{[
                    ['source', t('source_' + report.source)], ['type', t('type_' + (report.callType || 'incoming'))], ['date', new Date(report.createdAt).toLocaleString(i18n.language)],
                    ['person', report.assistantName], ['extension', report.operatorExtension], ['duration', journalDuration(report.duration)], ['project', project?.name || report.projectId],
                    ['recordFile', report.recordUrl?.split('?')[0].split('/').pop()], ['recordId', report.id], ['channelId', report.channelId], ['account', report.userId], ['model', metrics?._model?.name]
                ].map(([key, value]) => <div key={String(key)}><dt>{t(String(key))}</dt><dd>{value ?? '—'}</dd></div>)}</dl>
                <details className={cls.supervisor}><summary>{t('billingDetails')}</summary>{report.billingRecords?.length ? report.billingRecords.map(row => <dl className={cls.detailMeta} key={row.id}><div><dt>{r(row.type)}</dt><dd>{row.totalCost == null ? '—' : new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'USD', maximumFractionDigits: 6 }).format(row.totalCost)}</dd></div><div><dt>{t('tokens')}</dt><dd>{row.totalTokens}</dd></div></dl>) : <p className={cls.note}>{t('noBilling')}</p>}</details>
            </>}
        </div>
        {message && <p role="status" className={cls.note}>{message}</p>}

        <SidePanel isOpen={Boolean(selectedMetric)} onClose={() => { setSelectedMetric(null) }} onBack={() => { setSelectedMetric(null) }} backLabel={String(t('backToCall'))} title={selectedMetric ? String(r(selectedMetric.label)) : ''} className={cls.panel}>
            {selectedMetric && <div className={cls.detailBody}>
                <strong className={cls.metricHero} data-tone={metricTone(selectedMetric)}>{metricValue(selectedMetric)}</strong>
                {selectedMetric.min != null && selectedMetric.max != null && <p className={cls.note}>{t('scale', { min: selectedMetric.min, max: selectedMetric.max })}</p>}
                {selectedMetric.status && <p className={cls.note}>{t('quality_' + selectedMetric.status)} · {t('qualitySource_' + selectedMetric.source)}{selectedMetric.included ? ` · ${t('qualityWeight')}: ${selectedMetric.weight}` : ` · ${t('qualityExcluded')}`}</p>}
                {selectedMetric.normalized != null && <p>{t('qualityNormalized')}: {Math.round(selectedMetric.normalized * 100)} /100</p>}
                <section className={cls.detailSection}><h3>{t('rationale')}</h3><p>{selectedMetric.rationale || t('noRationale')}</p></section>
                {selectedMetric.quote && <section className={cls.detailSection}><h3>{t('supportingQuote')}</h3><blockquote>{selectedMetric.quote}</blockquote></section>}
            </div>}
        </SidePanel>
        <SidePanel isOpen={admin && showHistory} onClose={() => { setShowHistory(false) }} onBack={() => { setShowHistory(false) }} backLabel={String(t('backToCall'))} title={String(t('qualityHistory'))} className={cls.panel}>
            <div className={cls.detailBody}>
                {history.isFetching && <p role="status">{t('loading')}</p>}
                {history.isError && <p role="alert">{t('qualityLoadError')}</p>}
                {history.currentData?.map(item => <button type="button" className={cls.detailMetric} key={item.id} onClick={() => { setRunId(item.id); setShowHistory(false) }}>
                    <div><span>{new Date(item.createdAt).toLocaleString(i18n.language)} · {t('qualityKind_' + item.kind)}</span><strong>{item.score == null ? '—' : Math.round(item.score)} /100</strong></div>
                    <small>{t('quality_' + item.status)} · {Math.round(item.coverage * 100)}% {t('qualityCoverage')}{item.contextIncomplete && ` · ${t('qualityHistorical')}`}</small>
                </button>)}
                {history.currentData?.length === 20 && <button type="button" className={cls.button} onClick={() => { setHistoryBefore(history.currentData?.[19].id) }}>{t('qualityOlder')}</button>}
                {historyBefore && <button type="button" className={cls.button} onClick={() => { setHistoryBefore(undefined) }}>{t('qualityNewest')}</button>}
            </div>
        </SidePanel>
    </div>
}

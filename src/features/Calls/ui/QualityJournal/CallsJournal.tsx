import { useQualityJournalQuery as useGetCallJournalQuery, useLazyQualityJournalQuery as useLazyGetCallJournalQuery, publishedQuality, formatQualityScore } from '@/entities/Report'
import { QualityRulesEditor } from '@/features/OperatorAnalytics'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@mui/material'
import { ArrowDown, ArrowUp, Check, ChevronLeft, ChevronRight, Clock3, Download, Filter, Network, PhoneIncoming, PhoneOutgoing, RefreshCw, Search, X } from 'lucide-react'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { getUserAuthData, isUserAdmin, ClientFilter } from '@/entities/User'
import {
    useGetCallJournalOptionsQuery, useGetOperatorProjects,
    useBatchProgress, isOperatorAnalyticsSource, type JournalPersonOption, type Report
} from '@/entities/Report'

import { SidePanel, FilterPanel } from '@/shared/ui/redesign-v3'
import { BatchProgressBar } from '../BatchProgressBar/BatchProgressBar'
import { formatCallCost } from '../../lib/formatCallCost'
import { buildCallsExportSheet } from '../../lib/qualityCallsExportSheet'
import { journalPeriod, journalQuery, journalDateInput, journalCustomRange, journalDuration, journalScoreTone, journalProject, shiftJournalRange, type JournalFilters, type JournalPeriod } from '../../lib/journalModel'
import { JournalMultiSelect } from './JournalMultiSelect'
import { JournalDetail } from './JournalDetail'
import cls from './CallsJournal.module.scss'

const SOURCE_VALUES = ['call', 'widget', 'playground', 'external-api', 'external-front']
const TYPE_VALUES = ['incoming', 'outgoing', 'internal']
const LIMIT = 20

export function QualityJournal() {
    const { t, i18n } = useTranslation('quality-journal')
    const { t: r } = useTranslation('reports')
    const admin = useSelector(isUserAdmin)
    const auth = useSelector(getUserAuthData)
    const [filters, setFilters] = useState<JournalFilters>(() => ({
        ...journalPeriod('week'), search: '', sources: [], callTypes: [], people: [], csat: [], tagIds: [], tagId: '', projectId: '', sortField: 'createdAt', sortOrder: 'DESC'
    }))
    const [period, setPeriod] = useState<JournalPeriod | null>('week')
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [filterOpen, setFilterOpen] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [message, setMessage] = useState('')
    const [dateError, setDateError] = useState(false)
    const [custom, setCustom] = useState({ start: journalDateInput(filters.startDate), end: journalDateInput(filters.endDate) })
    const [poll, setPoll] = useState(0)
    const focus = useRef<HTMLElement | null>(null)
    const mounted = useRef(true)
    const batch = useBatchProgress()
    const userId = admin ? filters.userId : String(auth?.vpbx_user_id || auth?.id || '')
    const query = useMemo(() => journalQuery({ ...filters, userId }, page, LIMIT), [filters, page, userId])
    const signature = JSON.stringify({ ...query, page: 1, limit: 1000 })
    const currentSignature = useRef(signature)
    currentSignature.current = signature
    const { currentData: data, isFetching, isError, refetch } = useGetCallJournalQuery(query, {
        skip: !auth, refetchOnFocus: true, refetchOnReconnect: true, pollingInterval: batch.isActive ? 5000 : poll
    })
    const optionsSelection = useMemo(() => {
        const { page: _page, limit: _limit, sortField: _sortField, sortOrder: _sortOrder, people: _people, ...selection } = query
        return selection
    }, [query])
    const optionsQuery = useGetCallJournalOptionsQuery(optionsSelection, { skip: !auth })
    const { currentData: projects = [] } = useGetOperatorProjects(userId || undefined, { skip: !auth })
    const [fetchExportPage] = useLazyGetCallJournalQuery()
    const rows = data?.rows ?? []
    const total = data?.count ?? 0
    const pages = Math.max(1, Math.ceil(total / LIMIT))
    const selected = rows.find(row => row.id === selectedId)
    const patch = (value: Partial<JournalFilters>) => {
        setFilters(old => ({ ...old, ...value }))
        setPage(1); setSelectedId(null); setMessage('')
    }
    useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
    useEffect(() => {
        if (search.trim() === filters.search) return
        const timer = setTimeout(() => {
            setFilters(old => old.search === search.trim() ? old : { ...old, search: search.trim() })
            setPage(1); setSelectedId(null)
        }, 350)
        return () => { clearTimeout(timer) }
    }, [search, filters.search])
    useEffect(() => {
        if (data && !isFetching && page > pages) setPage(pages)
        setPoll(data?.rows.some(row => row.status === 'processing') ? 5000 : 0)
    }, [data, isFetching, page, pages])
    const close = () => { setSelectedId(null); focus.current?.focus() }
    const closeFilters = () => { setFilterOpen(false); setDateError(false); setCustom({ start: journalDateInput(filters.startDate), end: journalDateInput(filters.endDate) }) }
    const open = (row: Report) => { focus.current = document.activeElement as HTMLElement; setSelectedId(row.id) }
    const emptyFilters = () => {
        patch({ people: [], sources: [], callTypes: [], csat: [], projectId: '', tagId: '', tagIds: [], search: '' })
        setSearch('')
    }
    const choosePeriod = (value: JournalPeriod) => {
        const range = journalPeriod(value)
        setPeriod(value); patch(range); setDateError(false)
        setCustom({ start: journalDateInput(range.startDate), end: journalDateInput(range.endDate) })
    }
    const shift = (direction: -1 | 1) => {
        const range = shiftJournalRange(filters, direction)
        if (Date.parse(range.startDate) > Date.parse(journalPeriod('day').endDate)) return
        patch(range); setDateError(false)
        setCustom({ start: journalDateInput(range.startDate), end: journalDateInput(range.endDate) })
    }
    const customDate = (edge: 'start' | 'end', value: string) => {
        const next = { ...custom, [edge]: value }
        setCustom(next)
        const range = journalCustomRange(next.start, next.end)
        setDateError(!range)
        if (range) { setPeriod(null); patch(range) }
    }
    const peopleOptions = optionsQuery.currentData?.people ?? []
    const sourceOptions: JournalPersonOption[] = SOURCE_VALUES.map(value => ({ value, label: String(t('source_' + value)) }))
    const typeOptions: JournalPersonOption[] = TYPE_VALUES.map(value => ({ value, label: String(t('type_' + value)) }))
    const csatOptions: JournalPersonOption[] = ['1', '2', '3', '4', '5', 'none'].map(value => ({ value, label: value === 'none' ? String(t('withoutCsat')) : `${value} / 5` }))
    const tags = projects.filter(p => !filters.projectId || String(p.id) === filters.projectId).flatMap(p => p.callTaxonomy ?? [])
    const tagOptions = Array.from(new Map(tags.map(tag => [tag.id, tag])).values())
    const activeFilters = filters.people.length + filters.sources.length + filters.callTypes.length + filters.csat.length + Number(Boolean(filters.projectId)) + (filters.tagIds?.length ?? 0)
    const sort = (field: string) => { patch({ sortField: field, sortOrder: filters.sortField === field && filters.sortOrder === 'DESC' ? 'ASC' : 'DESC' }) }
    const tableScore = (row: Report) => {
        if (isOperatorAnalyticsSource(row.source)) {
            const value = publishedQuality(row.analytics)
            return { value, maximum: 100, hint: String(t('metricScoreHint')), tone: journalScoreTone(value) }
        }
        const value = null
        return { value, maximum: 5, hint: String(t('csatHint')), tone: journalScoreTone(value == null ? null : value * 20) }
    }
    const outcome = (row: Report) => {
        if (row.status === 'processing') return <span className={cls.result}><Clock3 size={13} aria-hidden />{t('processing')}</span>
        const success = row.analytics?.qualitySummary?.success ?? row.analytics?.metrics?.scenario_analysis?.success ?? row.analytics?.metrics?.success
        return <span className={cls.result}>{success === true && <Check size={13} aria-hidden />}{success === true ? t('successful') : success === false ? t('unsuccessful') : row.analytics ? '—' : t('notAnalyzed')}</span>
    }
    const exportAll = async () => {
        if (!data?.count || exporting || isFetching || search.trim() !== filters.search) return
        const frozen = signature
        setExporting(true); setMessage('')
        try {
            const records = new Map<string, Report>()
            let expected = 0
            for (let exportPage = 1; ; exportPage++) {
                if (!mounted.current || currentSignature.current !== frozen) throw new Error('Selection changed')
                const request = fetchExportPage({ ...query, page: exportPage, limit: 1000 }, false)
                let result
                try { result = await request.unwrap() } finally { request.unsubscribe() }
                if (exportPage === 1) expected = result.count
                const before = records.size
                result.rows.forEach(row => records.set(row.id, row))
                if (records.size >= expected) break
                if (!result.rows.length || records.size === before || result.rows.length < 1000) throw new Error('Dataset changed')
            }
            if (!mounted.current || currentSignature.current !== frozen) throw new Error('Selection changed')
            const sheetData = buildCallsExportSheet(Array.from(records.values()), r)
            const sheet = XLSX.utils.json_to_sheet(sheetData.rows, { header: sheetData.headers })
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, sheet, 'calls')
            FileSaver.saveAs(new Blob([XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })]), 'calls_export.xlsx')
        } catch { if (mounted.current) setMessage(String(t('exportError'))) } finally { if (mounted.current) setExporting(false) }
    }
    const tableHeaders = [
        { label: 'date', field: 'createdAt' }, { label: 'client', field: 'callerId' }, { label: 'person', field: 'assistantName' },
        { label: 'topic', field: 'topic' }, { label: 'score', field: 'qualityScore' }, { label: 'csat', field: 'csat' }, { label: 'result', field: 'scenarioSuccess' }, { label: 'duration', field: 'duration' }, { label: 'cost', field: 'cost' }
    ]
    const multi = (key: 'people' | 'sources' | 'callTypes' | 'csat' | 'tagIds', label: string, options: JournalPersonOption[], disabled = false) =>
        <JournalMultiSelect label={String(t(label))} options={options} value={filters[key] ?? []} onChange={value => { patch({ [key]: value }) }} disabled={disabled} />
    return <section className={cls.root} data-testid="CallsJournal">
        <header className={cls.header}>
            <div><div className={cls.headerTitle}><h1>{t('title')}</h1></div>
                <p>{t('subtitle')}</p></div>
            <div className={cls.actions}>
                <button type="button" className={cls.button} onClick={() => { void exportAll() }} disabled={!total || isFetching || exporting || search.trim() !== filters.search} aria-label={String(t('export'))} title={String(t('export'))}><Download size={16} aria-hidden /><span>{t(exporting ? 'exporting' : 'export')}</span></button>
            </div>
        </header>
        <div className={cls.period}>
            <div className={cls.presets} role="group" aria-label={String(t('period'))}>{(['day', 'week', 'month', 'year'] as const).map(value => <button type="button" key={value} aria-pressed={period === value} onClick={() => { choosePeriod(value) }}>{t('period_' + value)}</button>)}</div>
            <div className={cls.range}>
                <button type="button" aria-label={String(t('previousPeriod'))} onClick={() => { shift(-1) }}><ChevronLeft size={18} aria-hidden /></button>
                <span aria-live="polite">{new Date(filters.startDate).toLocaleDateString(i18n.language)} — {new Date(filters.endDate).toLocaleDateString(i18n.language)}</span>
                <button type="button" aria-label={String(t('nextPeriod'))} disabled={Date.parse(shiftJournalRange(filters, 1).startDate) > Date.parse(journalPeriod('day').endDate)} onClick={() => { shift(1) }}><ChevronRight size={18} aria-hidden /></button>
            </div>
        </div>
        {batch.isActive && <BatchProgressBar batches={batch.batches} progress={batch.progress} completed={batch.completed} failed={batch.failed} total={batch.total} onDismiss={batch.dismiss} />}
        <div className={cls.toolbar}>
            <form className={cls.search} onSubmit={e => { e.preventDefault(); patch({ search: search.trim() }) }}><Search size={15} aria-hidden /><input type="search" value={search} onChange={e => { setSearch(e.target.value) }} aria-label={String(t('search'))} placeholder={String(t('search'))} /><button type="submit" aria-label={String(t('find'))}><ChevronRight size={15} aria-hidden /></button></form>
            {multi('people', 'people', peopleOptions, optionsQuery.isFetching)}
            {multi('tagIds', 'topic', tagOptions.map(tag => ({ value: tag.id, label: tag.name })))}
            <div className={cls.toolbarActions}>
                <strong className={cls.callCount} aria-live="polite">{data ? t('count', { count: total }) : t('loading')}</strong>
                <button type="button" className={`${cls.button} ${cls.filtersButton}`} onClick={() => { setFilterOpen(true) }} aria-label={String(t('filters'))}><Filter size={16} aria-hidden /><span>{t('filters')}{activeFilters ? ` · ${activeFilters}` : ''}</span></button>
            </div>
        </div>
        <div className={`${cls.metaLine} ${!(activeFilters > 0 || filters.search || isFetching) ? cls.metaLineEmpty : ''}`}>
            <div className={cls.chips}>
                {(filters.tagIds ?? []).map(id => <button type="button" className={cls.chip} key={id} onClick={() => { patch({ tagIds: filters.tagIds?.filter(value => value !== id) }) }}>{tagOptions.find(tag => tag.id === id)?.name || id}<X size={12} aria-hidden /></button>)}
                {(activeFilters > 0 || filters.search) && <button type="button" className={cls.chip} onClick={emptyFilters}>{t('reset')}</button>}
                {isFetching && <span className={cls.note}>{t('updating')}</span>}
            </div>
            <select className={cls.sort} aria-label={String(t('sort'))} value={`${filters.sortField}:${filters.sortOrder}`} onChange={e => { const [sortField, sortOrder] = e.target.value.split(':'); patch({ sortField, sortOrder: sortOrder as 'ASC' | 'DESC' }) }}>
                {[['createdAt:DESC', 'newest'], ['createdAt:ASC', 'oldest'], ['duration:DESC', 'longest'], ['duration:ASC', 'shortest'], ['assistantName:ASC', 'byPerson'], ['assistantName:DESC', 'byPersonDesc'], ['qualityScore:DESC', 'qualityHigh'], ['qualityScore:ASC', 'qualityLow'], ['csat:DESC', 'csatHigh'], ['csat:ASC', 'csatLow']].map(([value, label]) => <option key={value} value={value}>{t(label)}</option>)}
            </select>
        </div>
        {message && <p role="alert" className={cls.error}>{message}</p>}
        <div className={cls.journal} aria-busy={isFetching}>
            {isError ? <div className={cls.empty} role="alert"><h2>{t('loadError')}</h2><button type="button" className={cls.button} onClick={() => { void refetch() }}>{t('retry')}</button></div> : !data ? <div className={cls.empty}>{t('loading')}</div> : !rows.length ? <div className={cls.empty}><h2>{t('empty')}</h2><p>{t('emptyHint')}</p><button type="button" className={cls.button} onClick={() => { emptyFilters(); choosePeriod('week') }}>{t('reset')}</button></div> : <table className={`${cls.table} ${isFetching ? cls.busy : ''}`}>
                <thead><tr>{tableHeaders.map(head => <th key={head.label} aria-sort={head.field ? filters.sortField === head.field ? filters.sortOrder === 'DESC' ? 'descending' : 'ascending' : 'none' : undefined}>
                    {head.field ? <button type="button" onClick={() => { sort(head.field) }}>{t(head.label)}{filters.sortField === head.field && (filters.sortOrder === 'DESC' ? <ArrowDown size={12} aria-hidden /> : <ArrowUp size={12} aria-hidden />)}</button> : t(head.label)}
                </th>)}<th aria-label={String(t('details'))} /></tr></thead>
                <tbody>{rows.map(row => {
                    const value = tableScore(row)
                    const tags = row.analytics?.metrics?._topics
                    const type = row.callType || 'incoming'
                    const Icon = type === 'outgoing' ? PhoneOutgoing : type === 'internal' ? Network : PhoneIncoming
                    return <tr key={row.id} className={cls.row} tabIndex={0} aria-label={String(t('openCall', { date: new Date(row.createdAt).toLocaleString(i18n.language) }))}
                        onClick={() => { open(row) }} onKeyDown={e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(row) } }}>
                        <td className={cls.date}>{new Date(row.createdAt).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}<small>{new Date(row.createdAt).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' })}</small></td>
                        <td><span className={cls.phone}><Tooltip title={String(t('type_' + type))}><span role="img" aria-label={String(t('type_' + type))}><Icon size={14} aria-hidden /></span></Tooltip><span className={cls.phoneNumber}>{row.callerId || t('noPhone')}</span></span></td>
                        <td><span className={cls.person}>{row.assistantName && row.assistantName !== 'Unknown Operator' ? row.assistantName : t('noOperator')}</span><small className={cls.sourceLabel}>{SOURCE_VALUES.includes(row.source || '') ? t('source_' + row.source) : row.source || '—'}{row.operatorExtension ? ` · ${t('extension')} ${row.operatorExtension}` : ''}</small></td>
                        <td>{tags?.tags?.length ? tags.tags.map(tag => <button type="button" key={tag} className={cls.topic} title={tags.tag_names?.[tag] || tag} onClick={e => { e.stopPropagation(); patch({ tagId: '', tagIds: [tag], projectId: row.projectId ? String(row.projectId) : '' }) }}>{tags.tag_names?.[tag] || tag}</button>) : <span className={cls.note}>—</span>}</td>
                        <td>{value.value != null ? <Tooltip title={value.hint}><span className={cls.score} data-tone={value.tone}><i aria-hidden />{formatQualityScore(value.value)}<small>/{value.maximum}</small></span></Tooltip> : <Tooltip title={String(t('quality_' + (row.analytics?.qualityStatus || 'legacy')))}><span>—</span></Tooltip>}</td>
                        <td><Tooltip title={String(t('csatHint'))}><span className={cls.score}>{row.analytics?.csat ?? '—'}{row.analytics?.csat != null && <small>/5</small>}</span></Tooltip></td><td>{outcome(row)}</td><td>{journalDuration(row.duration)}</td><td className={cls.callCost} data-label={String(t('cost'))}>{formatCallCost(row, i18n.language)}</td><td><ChevronRight size={15} aria-hidden className={cls.chevron} /></td>
                    </tr>
                })}</tbody>
            </table>}
            <footer className={cls.pagination}><span>{data ? t('pagination', { from: total ? (page - 1) * LIMIT + 1 : 0, to: Math.min(page * LIMIT, total), total }) : t('loading')}</span><div className={cls.actions}>
                <button type="button" className={cls.iconButton} onClick={() => { void refetch() }} disabled={isFetching} aria-label={String(t('refresh'))}><RefreshCw size={14} aria-hidden /></button>
                <button type="button" className={cls.iconButton} onClick={() => { setPage(old => old - 1); setSelectedId(null) }} disabled={page <= 1 || isFetching} aria-label={String(t('previousPage'))}><ChevronLeft size={16} aria-hidden /></button>
                <span>{page} / {pages}</span>
                <button type="button" className={cls.iconButton} onClick={() => { setPage(old => old + 1); setSelectedId(null) }} disabled={page >= pages || isFetching} aria-label={String(t('nextPage'))}><ChevronRight size={16} aria-hidden /></button>
            </div></footer>
        </div>
        {filters.projectId && <details className={cls.note}><summary>{t('previewRules')}</summary><QualityRulesEditor projectId={Number(filters.projectId)} /></details>}
        <FilterPanel open={filterOpen} onClose={closeFilters} title={String(t('filters'))} onReset={emptyFilters} resetLabel={String(t('reset'))} applyLabel={String(t('done'))} invalid={dateError}
            dates={{ ...custom, fromLabel: String(t('from')), toLabel: String(t('to')), onChange: customDate, error: dateError ? String(t('invalidDates')) : undefined }}
            fields={[
                { id: 'people', label: String(t('people')), options: peopleOptions, value: filters.people, onChange: (value: string[]) => { patch({ people: value }) }, disabled: optionsQuery.isFetching },
                { id: 'sources', label: String(t('sources')), options: sourceOptions, value: filters.sources, onChange: (value: string[]) => { patch({ sources: value }) } },
                { id: 'types', label: String(t('types')), options: typeOptions, value: filters.callTypes, onChange: (value: string[]) => { patch({ callTypes: value }) } },
                { id: 'csat', label: String(t('csat')), options: csatOptions, value: filters.csat, onChange: (value: string[]) => { patch({ csat: value }) } },
                { id: 'project', label: String(t('project')), options: projects.map(p => ({ value: String(p.id), label: p.name })), value: filters.projectId ? [filters.projectId] : [], multiple: false, onChange: (value: string[]) => { patch({ projectId: value[0] || '', tagIds: [] }) } },
                { id: 'topics', label: String(t('topic')), options: tagOptions.map(tag => ({ value: tag.id, label: tag.name })), value: filters.tagIds ?? [], onChange: (value: string[]) => { patch({ tagIds: value }) } }
            ].map(field => ({ ...field, messages: { all: String(t('all')), selected: count => String(t('selectedCount', { count })), search: String(t('find')), clear: String(t('clearSelection')), empty: String(t('noOptions')), unknown: String(t('selectedValue')) } }))}>
            {admin && <ClientFilter value={filters.userId || ''} label={String(t('account'))} onChange={value => { patch({ userId: value, people: [], projectId: '', tagIds: [] }) }} messages={{ all: String(t('all')), selected: count => String(t('selectedCount', { count })), search: String(t('find')), clear: String(t('clearSelection')), empty: String(t('noOptions')), unknown: String(t('selectedValue')) }}/>}
            {optionsQuery.isError && <p role="alert">{t('optionsError')}</p>}
            {optionsQuery.currentData?.limitReached && <p>{t('optionsLimit')}</p>}
        </FilterPanel>
        <SidePanel isOpen={Boolean(selected)} onClose={close} title={String(t('details'))} className={cls.panel}>{selected && <JournalDetail key={selected.channelId} report={selected} project={journalProject(selected, projects)} onDeleted={() => { close(); void refetch() }} />}</SidePanel>
    </section>
}

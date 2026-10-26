import { FilterPanel, SelectControl, type SelectControlProps } from '@/shared/ui/redesign-v3'
import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { PreviewDatePresets } from './PreviewDatePresets'
import { customDateRange, type DateRange } from './datePresets'
import { useTranslation } from 'react-i18next'
import { DashboardLayout } from '@/widgets/DashboardLayout'
import { OperatorDashboardPreview } from '@/features/OperatorAnalytics'
import { CallAnalysisDetail } from '@/features/Calls'
import { useGetOperatorDashboard, useGetOperatorProjects, WITHOUT_PROJECT_FILTER, useGetCallJournalOptionsQuery } from '@/entities/Report'
import { getUserAuthData, isUserAdmin, ClientFilter } from '@/entities/User'
import {
    dashboardPageReducer,
    getDashboardStartDate,
    getDashboardEndDate,
    getDashboardUserId
} from '@/features/Dashboard'
import { DynamicModuleLoader, type ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

const reducers: ReducersList = { dashboardPage: dashboardPageReducer }

function PreviewContent() {
    const { t } = useTranslation('call-records-preview')
    const { t: j } = useTranslation('quality-journal')
    const [params, setParams] = useSearchParams()
    const admin = useSelector(isUserAdmin)
    const auth = useSelector(getUserAuthData)
    const clientId = useSelector(getDashboardUserId)
    const startDate = useSelector(getDashboardStartDate)
    const endDate = useSelector(getDashboardEndDate)
    const [account, setAccount] = useState<string | undefined>()
    const userId = admin ? account ?? clientId : auth?.vpbx_user_id || auth?.id
    const [filterOpen, setFilterOpen] = useState(false)
    const [selection, setSelection] = useState({ people: [] as string[], sources: [] as string[], callTypes: [] as string[], csat: [] as string[], tagIds: [] as string[] })
    const {
        data: projects,
        isError: projectError,
        refetch: retryProjects
    } = useGetOperatorProjects(admin && userId ? String(userId) : undefined)
    const [selected, setSelected] = useState(params.get('projectId') || '')
    const projectId = selected || (projects?.length ? String(projects[0].id) : projects ? WITHOUT_PROJECT_FILTER : '')
    const normalized = useMemo(() =>
        /^\d{4}-\d{2}-\d{2}$/.test(startDate || '') && /^\d{4}-\d{2}-\d{2}$/.test(endDate || '')
            ? customDateRange(startDate, endDate)
            : null, [startDate, endDate])
    // Keep ISO ranges local: the original dashboard stores date-only filters.
    const [period, setPeriod] = useState<DateRange | null>(normalized)
    useEffect(() => { setPeriod(normalized) }, [normalized])
    const filters = {
        startDate: period?.startDate ?? startDate,
        endDate: period?.endDate ?? endDate,
        projectId,
        ...Object.fromEntries(Object.entries(selection).filter(([,values]) => values.length).map(([key, values]) => [key, key === 'csat' ? values.join(',') : JSON.stringify(key === 'people' ? values.map(value => JSON.parse(value)) : values)])),
        ...(userId ? { userId: String(userId) } : {})
    }
    const options = useGetCallJournalOptionsQuery({ userId: userId ? String(userId) : undefined, startDate: filters.startDate || '', endDate: filters.endDate || '' }, { skip: !auth })
    const messages: SelectControlProps['messages'] = { all: String(j('all')), selected: count => String(j('selectedCount', { count })), search: String(j('find')), clear: String(j('clearSelection')), empty: String(j('noOptions')), unknown: String(j('selectedValue')) }
    const people = options.currentData?.people ?? []
    const dateValue = (value?: string) => { const date = new Date(value || ''); return Number.isNaN(date.getTime()) ? '' : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
    const [custom, setCustom] = useState({ start: dateValue(filters.startDate), end: dateValue(filters.endDate) })
    const [invalidDates, setInvalidDates] = useState(false)
    useEffect(() => { setCustom({ start: dateValue(filters.startDate), end: dateValue(filters.endDate) }) }, [filters.startDate, filters.endDate])
    const reset = () => { setSelection({ people: [], sources: [], callTypes: [], csat: [], tagIds: [] }) }
    const changeProject = (value: string) => { setSelected(value); setSelection(old => ({ ...old, tagIds: [] })); const next = new URLSearchParams(params); next.set('projectId', value); setParams(next, { replace: true }) }
    const field = (key: keyof typeof selection, label: string, values: Array<{ value: string, label: string }>) => ({ id: key, label: String(j(label)), options: values, value: selection[key], onChange: (value: string[]) => { setSelection(old => ({ ...old, [key]: value })) }, messages })
    const panelFields = [field('people', 'people', people), field('sources', 'sources', ['call', 'widget', 'playground', 'external-api', 'external-front'].map(value => ({ value, label: String(j('source_' + value)) }))), field('callTypes', 'types', ['incoming', 'outgoing', 'internal'].map(value => ({ value, label: String(j('type_' + value)) }))), field('csat', 'csat', ['1', '2', '3', '4', '5', 'none'].map(value => ({ value, label: value === 'none' ? String(j('withoutCsat')) : `${value} / 5` }))), { id: 'project', label: String(j('project')), options: [...(projects ?? []).map(project => ({ value: String(project.id), label: project.name })), { value: WITHOUT_PROJECT_FILTER, label: String(t('withoutProject')) }], value: [projectId], onChange: (value: string[]) => { changeProject(value[0] || '') }, multiple: false, messages }, field('tagIds', 'topic', (projects?.find(project => String(project.id) === projectId)?.callTaxonomy ?? []).map(tag => ({ value: tag.id, label: tag.name })))]
    const query = useGetOperatorDashboard(filters, { skip: !startDate || !endDate || !projectId || projectError })
    return (
        <DashboardLayout
            title={String(t('title'))}
            periodControl={() =>
                startDate && endDate ? (
                    <PreviewDatePresets
                        value={{ startDate: filters.startDate, endDate: filters.endDate }}
                        onOpenFilters={() => { setFilterOpen(true) }}
                        onChange={setPeriod}
                    />
                ) : null
            }
        >
            <OperatorDashboardPreview
                renderCallDetail={(channelId, onDeleted) => <CallAnalysisDetail channelId={channelId} project={projects?.find(p => String(p.id) === projectId)} onDeleted={onDeleted} />}
                key={JSON.stringify(filters)}
                peopleControl={<SelectControl label={String(j('people'))} options={people} value={selection.people} onChange={value => { setSelection(old => ({ ...old, people: value })) }} disabled={options.isFetching} messages={messages}/> }
                isAdmin={admin}
                filters={filters}
                data={query.data}
                loading={query.isLoading || query.isFetching || !projects}
                error={query.isError || projectError}
                onRetry={() => {
                    if (projectError) retryProjects()
                    else query.refetch()
                }}
                projects={projects ?? []}
                project={projects?.find(p => String(p.id) === projectId)}
                onProjectChange={changeProject}
            />
            <FilterPanel open={filterOpen} onClose={() => { setFilterOpen(false); setInvalidDates(false); setCustom({ start: dateValue(filters.startDate), end: dateValue(filters.endDate) }) }} title={String(j('filters'))} fields={panelFields} onReset={reset} resetLabel={String(j('reset'))} applyLabel={String(j('done'))} invalid={invalidDates}
                dates={{ ...custom, fromLabel: String(j('from')), toLabel: String(j('to')), error: invalidDates ? String(j('invalidDates')) : undefined, onChange: (edge, value) => { const next = { ...custom, [edge]: value }; setCustom(next); const range = customDateRange(next.start, next.end); setInvalidDates(!range); if (range)setPeriod(range) } }}>
                {admin && <ClientFilter value={userId ? String(userId) : ''} label={String(j('account'))} messages={messages} onChange={value => { setAccount(value); setSelected(''); reset() }}/>}
                {options.isError && <p role="alert">{j('optionsError')}</p>}
            </FilterPanel>
        </DashboardLayout>
    )
}

export default function DashboardCallRecordsPreviewPage() {
    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            <PreviewContent />
        </DynamicModuleLoader>
    )
}

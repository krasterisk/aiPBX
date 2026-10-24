import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { PreviewDatePresets } from './PreviewDatePresets'
import { customDateRange, type DateRange } from './datePresets'
import { useTranslation } from 'react-i18next'
import { DashboardLayout } from '@/widgets/DashboardLayout'
import { OperatorDashboardPreview } from '@/features/OperatorAnalytics'
import { useGetOperatorDashboard, useGetOperatorProjects, WITHOUT_PROJECT_FILTER } from '@/entities/Report'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
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
    const [params, setParams] = useSearchParams()
    const admin = useSelector(isUserAdmin)
    const auth = useSelector(getUserAuthData)
    const clientId = useSelector(getDashboardUserId)
    const startDate = useSelector(getDashboardStartDate)
    const endDate = useSelector(getDashboardEndDate)
    const userId = admin ? clientId : auth?.vpbx_user_id || auth?.id
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
        ...(userId ? { userId: String(userId) } : {})
    }
    const query = useGetOperatorDashboard(filters, { skip: !startDate || !endDate || !projectId || projectError })
    return (
        <DashboardLayout
            title={String(t('title'))}
            periodControl={onOpenFilters =>
                startDate && endDate ? (
                    <PreviewDatePresets
                        value={{ startDate: filters.startDate, endDate: filters.endDate }}
                        onOpenFilters={onOpenFilters}
                        onChange={setPeriod}
                    />
                ) : null
            }
        >
            <OperatorDashboardPreview
                key={JSON.stringify(filters)}
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
                onProjectChange={value => {
                    setSelected(value)
                    const next = new URLSearchParams(params)
                    next.set('projectId', value)
                    setParams(next, { replace: true })
                }}
            />
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

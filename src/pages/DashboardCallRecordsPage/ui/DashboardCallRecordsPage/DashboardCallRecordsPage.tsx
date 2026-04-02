import { memo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DashboardLayout } from '@/widgets/DashboardLayout'
import { OperatorDashboard, DashboardBuilder } from '@/features/OperatorAnalytics'
import { useGetOperatorDashboard, useGetOperatorProjects } from '@/entities/Report'
import { dashboardPageReducer, getDashboardStartDate, getDashboardEndDate, getDashboardUserId } from '@/features/Dashboard'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { getUserAuthData, isUserAdmin } from '@/entities/User'

const reducers: ReducersList = { dashboardPage: dashboardPageReducer }

const DashboardCallRecordsContent = memo(() => {
    const { t } = useTranslation('reports')
    const clientId = useSelector(getDashboardUserId)
    const startDate = useSelector(getDashboardStartDate)
    const endDate = useSelector(getDashboardEndDate)
    const authData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)
    const userId = !isAdmin ? authData?.vpbx_user_id || authData?.id : clientId

    const [projectId, setProjectId] = useState('')
    const [showBuilder, setShowBuilder] = useState(false)

    const { data: dashboardData, isLoading, isFetching } = useGetOperatorDashboard(
        { startDate, endDate, projectId, userId },
        { skip: !startDate || !endDate }
    )

    const { data: projects } = useGetOperatorProjects()
    const activeProject = projects?.find(p => p.id === projectId)

    const onChangeProjectId = useCallback((value: string) => {
        setProjectId(value)
        setShowBuilder(false)
    }, [])

    const handleOpenBuilder = useCallback(() => { setShowBuilder(true) }, [])
    const handleCloseBuilder = useCallback(() => { setShowBuilder(false) }, [])

    if (showBuilder && activeProject) {
        return (
            <DashboardBuilder
                project={activeProject}
                dashboardData={dashboardData}
                onClose={handleCloseBuilder}
            />
        )
    }

    return (
        <DashboardLayout title={String(t('Аналитика проектов'))}>
            <OperatorDashboard
                data={dashboardData}
                isLoading={isLoading || isFetching}
                projectId={projectId}
                startDate={startDate}
                endDate={endDate}
                onChangeProjectId={onChangeProjectId}
                onOpenDashboardBuilder={handleOpenBuilder}
            />
        </DashboardLayout>
    )
})

const DashboardCallRecordsPage = memo(() => (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
        <DashboardCallRecordsContent />
    </DynamicModuleLoader>
))

export default DashboardCallRecordsPage

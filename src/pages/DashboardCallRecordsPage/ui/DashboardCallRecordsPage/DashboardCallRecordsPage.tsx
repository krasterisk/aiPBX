import { memo, useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { DashboardLayout } from '@/widgets/DashboardLayout'
import { OperatorDashboard, DashboardBuilder } from '@/features/OperatorAnalytics'
import { useGetOperatorDashboard, useGetOperatorProjects } from '@/entities/Report'
import { dashboardPageReducer, getDashboardStartDate, getDashboardEndDate, getDashboardUserId } from '@/features/Dashboard'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import { OnboardingDashboardTour } from '@/features/Onboarding'

const reducers: ReducersList = { dashboardPage: dashboardPageReducer }

const DashboardCallRecordsContent = memo(() => {
    const { t } = useTranslation('reports')
    const [searchParams, setSearchParams] = useSearchParams()
    const clientId = useSelector(getDashboardUserId)
    const startDate = useSelector(getDashboardStartDate)
    const endDate = useSelector(getDashboardEndDate)
    const authData = useSelector(getUserAuthData)
    const isAdmin = useSelector(isUserAdmin)
    const userId = !isAdmin ? authData?.vpbx_user_id || authData?.id : clientId

    const queryProjectId = searchParams.get('projectId') ?? ''
    const showOnboardingTour = searchParams.get('onboarding') === 'analytics' &&
        searchParams.get('tour') === '1'

    const [projectId, setProjectId] = useState(queryProjectId)
    const [showBuilder, setShowBuilder] = useState(false)
    const [tourActive, setTourActive] = useState(showOnboardingTour)

    useEffect(() => {
        if (queryProjectId) {
            setProjectId(queryProjectId)
        }
    }, [queryProjectId])

    useEffect(() => {
        setTourActive(showOnboardingTour)
    }, [showOnboardingTour])

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

    const handleTourFinished = useCallback(() => {
        setTourActive(false)
        const next = new URLSearchParams(searchParams)
        next.delete('onboarding')
        next.delete('tour')
        setSearchParams(next, { replace: true })
    }, [searchParams, setSearchParams])

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
        <DashboardLayout title={t('DASHBOARD_PROJECT_ANALYTICS_TITLE')}>
            <OperatorDashboard
                data={dashboardData}
                isLoading={isLoading || isFetching}
                projectId={projectId}
                startDate={startDate}
                endDate={endDate}
                userId={userId}
                onChangeProjectId={onChangeProjectId}
                onOpenDashboardBuilder={handleOpenBuilder}
            />
            <OnboardingDashboardTour active={tourActive} onFinished={handleTourFinished} />
        </DashboardLayout>
    )
})

const DashboardCallRecordsPage = memo(() => (
    <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
        <DashboardCallRecordsContent />
    </DynamicModuleLoader>
))

export default DashboardCallRecordsPage

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { operatorAnalyticsPageActions } from '../../model/slices/operatorAnalyticsPageSlice'
import {
    getOperatorAnalyticsPeriodTab,
    getOperatorAnalyticsOverviewTab,
    getOperatorAnalyticsProjectId,
    getOperatorAnalyticsPage,
    getOperatorAnalyticsSortField,
    getOperatorAnalyticsSortOrder,
    getOperatorAnalyticsSearch
} from '../../model/selectors/operatorAnalyticsPageSelectors'
import type { OverviewTab, PeriodTab, SortableField } from '../../model/types/operatorAnalyticsPageSchema'

const VALID_OVERVIEW_TABS: OverviewTab[] = ['dashboard', 'cdr', 'projects', 'tokens']
const VALID_PERIOD_TABS: PeriodTab[] = ['day', 'week', 'month', 'year', 'custom']

/**
 * Synchronizes Redux analytics state ↔ URL search params.
 * - On mount: reads URL params → dispatches syncFromUrl
 * - On Redux change: updates URL via replaceState (no pushState)
 * - Shallow compare prevents ping-pong loops
 */
export function useUrlSyncedAnalyticsState() {
    const dispatch = useAppDispatch()
    const isInitialSync = useRef(true)

    const overviewTab = useSelector(getOperatorAnalyticsOverviewTab)
    const periodTab = useSelector(getOperatorAnalyticsPeriodTab)
    const projectId = useSelector(getOperatorAnalyticsProjectId)
    const page = useSelector(getOperatorAnalyticsPage)
    const sortField = useSelector(getOperatorAnalyticsSortField)
    const sortOrder = useSelector(getOperatorAnalyticsSortOrder)
    const search = useSelector(getOperatorAnalyticsSearch)

    // URL → Redux (on mount only)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const urlState: Record<string, any> = {}

        const view = params.get('view') as OverviewTab
        if (view && VALID_OVERVIEW_TABS.includes(view)) {
            urlState.overviewTab = view
        }

        const period = params.get('period') as PeriodTab
        if (period && VALID_PERIOD_TABS.includes(period)) {
            urlState.periodTab = period
        }

        const project = params.get('project')
        if (project) urlState.projectId = project

        const pageParam = params.get('page')
        if (pageParam) urlState.page = Number(pageParam) || 1

        const searchParam = params.get('search')
        if (searchParam) urlState.search = searchParam

        const sort = params.get('sort')
        if (sort) {
            const [field, order] = sort.split(':')
            if (field) urlState.sortField = field as SortableField
            if (order === 'asc' || order === 'desc') {
                urlState.sortOrder = order.toUpperCase() as 'ASC' | 'DESC'
            }
        }

        if (Object.keys(urlState).length > 0) {
            dispatch(operatorAnalyticsPageActions.syncFromUrl(urlState))
        }

        isInitialSync.current = false
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Redux → URL (on state change)
    useEffect(() => {
        if (isInitialSync.current) return

        const params = new URLSearchParams()

        if (overviewTab && overviewTab !== 'dashboard') {
            params.set('view', overviewTab)
        }
        if (periodTab && periodTab !== 'week') {
            params.set('period', periodTab)
        }
        if (projectId) params.set('project', projectId)
        if (page > 1) params.set('page', String(page))
        if (search) params.set('search', search)
        if (sortField !== 'createdAt' || sortOrder !== 'DESC') {
            params.set('sort', `${sortField}:${sortOrder.toLowerCase()}`)
        }

        const queryString = params.toString()
        const newUrl = queryString
            ? `${window.location.pathname}?${queryString}`
            : window.location.pathname

        if (newUrl !== `${window.location.pathname}${window.location.search}`) {
            window.history.replaceState(null, '', newUrl)
        }
    }, [overviewTab, periodTab, projectId, page, search, sortField, sortOrder])
}

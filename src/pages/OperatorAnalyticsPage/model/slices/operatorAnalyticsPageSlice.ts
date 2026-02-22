import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    OperatorAnalyticsPageSchema,
    PeriodTab,
    OverviewTab,
    SortableField
} from '../types/operatorAnalyticsPageSchema'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(weekday)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', { weekStart: 1 })

const DEFAULT_PERIOD: PeriodTab = 'week'
const currentStart = dayjs().startOf(DEFAULT_PERIOD as any).format('YYYY-MM-DD')
const currentEnd = dayjs().endOf(DEFAULT_PERIOD as any).format('YYYY-MM-DD')

const initialState: OperatorAnalyticsPageSchema = {
    periodTab: DEFAULT_PERIOD,
    overviewTab: 'dashboard',
    startDate: currentStart,
    endDate: currentEnd,
    operatorName: '',
    projectId: '',
    page: 1,
    search: '',
    sortField: 'createdAt',
    sortOrder: 'DESC',
    _inited: false
}

export const operatorAnalyticsPageSlice = createSlice({
    name: 'operatorAnalyticsPage',
    initialState,
    reducers: {
        setPeriodTab: (state, action: PayloadAction<PeriodTab>) => {
            state.periodTab = action.payload
        },
        setOverviewTab: (state, action: PayloadAction<OverviewTab>) => {
            state.overviewTab = action.payload
        },
        setStartDate: (state, action: PayloadAction<string>) => {
            state.startDate = action.payload
        },
        setEndDate: (state, action: PayloadAction<string>) => {
            state.endDate = action.payload
        },
        setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
            state.startDate = action.payload.startDate
            state.endDate = action.payload.endDate
        },
        setOperatorName: (state, action: PayloadAction<string>) => {
            state.operatorName = action.payload
        },
        setProjectId: (state, action: PayloadAction<string>) => {
            state.projectId = action.payload
            state.page = 1
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
            state.page = 1
        },
        setSort: (state, action: PayloadAction<{ field: SortableField; order: 'ASC' | 'DESC' }>) => {
            state.sortField = action.payload.field
            state.sortOrder = action.payload.order
            state.page = 1
        },
        syncFromUrl: (state, action: PayloadAction<Partial<OperatorAnalyticsPageSchema>>) => {
            Object.assign(state, action.payload)
        },
        initState: (state) => {
            state._inited = true
            state.periodTab = DEFAULT_PERIOD
            state.page = 1
            if (!state.startDate) {
                state.startDate = currentStart
                state.endDate = currentEnd
            }
        }
    }
})

export const { actions: operatorAnalyticsPageActions } = operatorAnalyticsPageSlice
export const { reducer: operatorAnalyticsPageReducer } = operatorAnalyticsPageSlice

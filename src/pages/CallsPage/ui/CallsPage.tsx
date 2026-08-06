import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Page } from '@/widgets/Page'
import { classNames } from '@/shared/lib/classNames/classNames'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { reportsPageReducer, initReportsPage, useReportFilters } from '@/entities/Report'
import { consumeInsightDrilldown } from '@/features/OperatorAnalytics'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { CallsHeader, CallsList, UploadModal, useCallsExport, useBatchProgress } from '@/features/Calls'
import cls from './CallsPage.module.scss'

interface CallsPageProps {
    className?: string
}

const reducers: ReducersList = {
    reportsPage: reportsPageReducer
}

const CallsPage = ({ className }: CallsPageProps) => {
    const dispatch = useAppDispatch()
    const [uploadOpen, setUploadOpen] = useState(false)
    const batch = useBatchProgress()

    const {
        data, isLoading, isError, error,
        onRefetch, onLoadNext, hasMore,
        tab, startDate, endDate, search, source,
        clientId, assistants,
        sortField, sortOrder, isInited,
        csatFilter, tagId, tagLabel,
        onChangeTab, onChangeStartDate, onChangeEndDate,
        onChangeSearch, onChangeSource, onChangeSort,
        onChangeAssistant, onChangeUserId,
        onToggleCsatFilter, onFilterByTag, onClearTagFilter,
    } = useReportFilters()

    const drilldownAppliedRef = useRef(false)

    const { exportToExcel, exporting } = useCallsExport({
        data,
        startDate,
        endDate,
        search,
        source,
        sortField,
        sortOrder,
        csatFilter,
        tagId,
    })

    useInitialEffect(() => { dispatch(initReportsPage()) })

    useEffect(() => {
        if (!isInited || drilldownAppliedRef.current) return
        const drilldown = consumeInsightDrilldown()
        if (!drilldown) return
        drilldownAppliedRef.current = true
        if (drilldown.startDate) onChangeStartDate(drilldown.startDate)
        if (drilldown.endDate) onChangeEndDate(drilldown.endDate)
        if (drilldown.userId) onChangeUserId(drilldown.userId)
        if (drilldown.search) onChangeSearch(drilldown.search)
    }, [
        isInited,
        onChangeStartDate,
        onChangeEndDate,
        onChangeUserId,
        onChangeSearch,
    ])

    const onScrollEnd = useCallback(() => {
        if (hasMore) onLoadNext()
    }, [hasMore, onLoadNext])

    if (isError) {
        const errMsg = error && typeof error === 'object' && 'data' in error
            ? String((error.data as { message: string }).message)
            : ''
        return <ErrorGetData text={errMsg} onRefetch={onRefetch} />
    }

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            <Page
                data-testid="CallsPage"
                className={classNames(cls.CallsPage, {}, [className])}
                onScrollEnd={onScrollEnd}
                isSaveScroll
            >
                <VStack gap="24" max>
                    <CallsHeader
                        tab={tab}
                        startDate={startDate}
                        endDate={endDate}
                        isInited={isInited}
                        search={search}
                        source={source}
                        clientId={clientId}
                        assistants={assistants}
                        onChangeTab={onChangeTab}
                        onChangeStartDate={onChangeStartDate}
                        onChangeEndDate={onChangeEndDate}
                        onChangeSearch={onChangeSearch}
                        onChangeSource={onChangeSource}
                        onChangeAssistant={onChangeAssistant}
                        onChangeUserId={onChangeUserId}
                        onUpload={() => { setUploadOpen(true) }}
                        onExport={exportToExcel}
                        batchProgress={batch}
                        exporting={exporting}
                        totalCount={data?.count}
                        csatFilter={csatFilter}
                        onToggleCsatFilter={onToggleCsatFilter}
                        tagId={tagId}
                        tagLabel={tagLabel}
                        onClearTagFilter={onClearTagFilter}
                    />
                    <CallsList
                        reports={data}
                        isLoading={isLoading}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onChangeSort={onChangeSort}
                        onFilterByTag={onFilterByTag}
                        onUpload={() => { setUploadOpen(true) }}
                    />
                </VStack>

                <UploadModal
                    isOpen={uploadOpen}
                    onClose={() => { setUploadOpen(false) }}
                    onBatchStarted={batch.startPolling}
                />
            </Page>
        </DynamicModuleLoader>
    )
}

export default memo(CallsPage)

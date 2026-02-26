import { memo, useCallback, useState } from 'react'
import { Page } from '@/widgets/Page'
import { classNames } from '@/shared/lib/classNames/classNames'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { reportsPageReducer, initReportsPage, useReportFilters } from '@/entities/Report'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { CallsHeader, CallsList, UploadModal, useCallsExport } from '@/features/Calls'
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

    const {
        data, isLoading, isError, error,
        onRefetch, onLoadNext, hasMore,
        tab, startDate, endDate, search, source,
        sortField, sortOrder, isInited,
        onChangeTab, onChangeStartDate, onChangeEndDate,
        onChangeSearch, onChangeSource, onChangeSort
    } = useReportFilters()

    const { exportToExcel } = useCallsExport(data)

    useInitialEffect(() => { dispatch(initReportsPage()) })

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
                        onChangeTab={onChangeTab}
                        onChangeStartDate={onChangeStartDate}
                        onChangeEndDate={onChangeEndDate}
                        onChangeSearch={onChangeSearch}
                        onChangeSource={onChangeSource}
                        onUpload={() => setUploadOpen(true)}
                        onExport={exportToExcel}
                    />
                    <CallsList
                        reports={data}
                        isLoading={isLoading}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onChangeSort={onChangeSort}
                        onUpload={() => setUploadOpen(true)}
                    />
                </VStack>

                <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
            </Page>
        </DynamicModuleLoader>
    )
}

export default memo(CallsPage)

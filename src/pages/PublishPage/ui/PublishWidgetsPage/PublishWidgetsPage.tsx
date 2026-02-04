import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsPage.module.scss'
import React, { memo, useCallback } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { Page } from '@/widgets/Page'
import { ErrorGetData } from '@/entities/ErrorGetData'
import {
    PublishWidgetsList,

    publishWidgetsPageReducer,
    usePublishWidgetsFilters,
    initPublishWidgetsPage
} from '@/entities/PublishWidgets'

interface PublishWidgetsPageProps {
    className?: string
}

const reducers: ReducersList = {
    publishWidgetsPage: publishWidgetsPageReducer
}

const PublishWidgetsPage = memo((props: PublishWidgetsPageProps) => {
    const { className } = props
    const {
        isError,
        isLoading,
        error,
        data,
        hasMore,
        onRefetch,
        onLoadNext,
        search,
        onSearchChange
    } = usePublishWidgetsFilters()

    const dispatch = useAppDispatch()

    const onLoadNextPart = useCallback(() => {
        if (hasMore) {
            onLoadNext()
        }
    }, [hasMore, onLoadNext])

    useInitialEffect(() => {
        dispatch(initPublishWidgetsPage())
    })

    const content = (
        <Page
            data-testid={'PublishWidgetsPage'}
            onScrollEnd={onLoadNextPart}
            className={classNames(cls.PublishWidgetsPage, {}, [className])}
            isSaveScroll={true}
        >
            <PublishWidgetsList
                isWidgetsLoading={isLoading}
                widgets={data}
                isWidgetsError={isError}
            />
        </Page>
    )

    if (isError) {
        const errMsg = error && typeof error === 'object' && 'data' in error
            ? String((error.data as { message: string }).message)
            : ''

        return (
            <ErrorGetData
                text={errMsg}
                onRefetch={onRefetch}
            />
        )
    }

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            {content}
        </DynamicModuleLoader>
    )
})

export default PublishWidgetsPage

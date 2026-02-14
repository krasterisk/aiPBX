import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpServersPage.module.scss'
import React, { memo, useCallback } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { Page } from '@/widgets/Page'
import { ErrorGetData } from '@/entities/ErrorGetData'
import {
    McpServersList,
    mcpServersPageReducer,
    useMcpServersFilters,
    initMcpServersPage
} from '@/entities/Mcp'

interface McpServersPageProps {
    className?: string
}

const reducers: ReducersList = {
    mcpServersPage: mcpServersPageReducer
}

const McpServersPage = ({ className }: McpServersPageProps) => {
    const {
        view,
        isError,
        isLoading,
        error,
        data,
        hasMore,
        onRefetch,
        onLoadNext
    } = useMcpServersFilters()

    const dispatch = useAppDispatch()

    const onLoadNextPart = useCallback(() => {
        if (hasMore) {
            onLoadNext()
        }
    }, [hasMore, onLoadNext])

    useInitialEffect(() => {
        dispatch(initMcpServersPage())
    })

    const content = (
        <Page
            data-testid={'McpServersPage'}
            onScrollEnd={onLoadNextPart}
            className={classNames(cls.McpServersPage, {}, [className])}
            isSaveScroll={true}
        >
            <McpServersList
                className={className}
                isMcpServersLoading={isLoading}
                mcpServers={data}
                isMcpServersError={isError}
                onRefetch={onRefetch}
            />
        </Page>
    )

    if (isError) {
        const errMsg = error && 'data' in error
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
}

export default memo(McpServersPage)

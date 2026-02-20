import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpServersList.module.scss'
import React, { memo } from 'react'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { AllMcpServers } from '../../model/types/mcpTypes'
import { McpServersListHeader } from '../McpServersListHeader/McpServersListHeader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { ContentListItemSkeleton } from '@/entities/Content'
import { McpServerItem } from '../McpServerItem/McpServerItem'
import { McpServerTemplates } from '../McpServerTemplates/McpServerTemplates'
import { McpQuickConnect } from '../McpQuickConnect/McpQuickConnect'

interface McpServersListProps {
    className?: string
    isMcpServersLoading?: boolean
    isMcpServersError?: boolean
    mcpServers?: AllMcpServers
    onRefetch?: () => void
}

export const McpServersList = memo((props: McpServersListProps) => {
    const {
        className,
        isMcpServersError,
        isMcpServersLoading,
        mcpServers,
        onRefetch
    } = props

    const getSkeletons = () => {
        return new Array(4)
            .fill(0)
            .map((_, index) => (
                <ContentListItemSkeleton className={cls.card} key={index} view={'BIG'} />
            ))
    }

    if (isMcpServersError) {
        return <ErrorGetData onRefetch={onRefetch} />
    }

    return (
        <VStack gap="16" max className={classNames(cls.McpServersList, {}, [className])}>
            <McpServersListHeader />

            {mcpServers?.rows?.length
? (
                <>
                    <McpQuickConnect />
                    <div className={cls.listWrapper}>
                        {mcpServers.rows.map((server) => (
                            <McpServerItem
                                key={server.id}
                                server={server}
                            />
                        ))}
                    </div>
                </>
            )
: (
                !isMcpServersLoading && <McpServerTemplates />
            )}

            {isMcpServersLoading && (
                <div className={cls.listWrapper}>
                    {getSkeletons()}
                </div>
            )}
        </VStack>
    )
})

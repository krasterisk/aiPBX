import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisPage.module.scss'
import { memo } from 'react'
import { Page } from '@/widgets/Page'
import { PublishSipUrisList, publishSipUrisPageReducer, usePublishSipUrisFilters } from '@/entities/PublishSipUris'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

interface PublishSipUrisPageProps {
    className?: string
}

const reducers: ReducersList = {
    publishSipUrisPage: publishSipUrisPageReducer
}

const PublishSipUrisPage = memo((props: PublishSipUrisPageProps) => {
    const { className } = props

    const {
        isLoading,
        isError,
        data,
        onRefetch
    } = usePublishSipUrisFilters()

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            <Page className={classNames(cls.PublishSipUrisPage, {}, [className])}>
                <PublishSipUrisList
                    assistants={data}
                    isLoading={isLoading}
                    isError={isError}
                    onRefetch={onRefetch}
                />
            </Page>
        </DynamicModuleLoader>
    )
})

export default PublishSipUrisPage

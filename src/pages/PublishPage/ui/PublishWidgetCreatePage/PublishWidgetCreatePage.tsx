import { classNames } from '@/shared/lib/classNames/classNames'
import { memo } from 'react'
import { Page } from '@/widgets/Page'
import { PublishWidgetsForm, publishWidgetsFormReducer } from '@/features/PublishWidgets'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

interface PublishWidgetCreatePageProps {
    className?: string
}

const reducers: ReducersList = {
    publishWidgetsForm: publishWidgetsFormReducer
}

const PublishWidgetCreatePage = memo((props: PublishWidgetCreatePageProps) => {
    const { className } = props

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <Page className={classNames('', {}, [className])}>
                <PublishWidgetsForm />
            </Page>
        </DynamicModuleLoader>
    )
})

export default PublishWidgetCreatePage

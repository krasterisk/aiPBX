import { classNames } from '@/shared/lib/classNames/classNames'
import { memo, useEffect } from 'react'
import { Page } from '@/widgets/Page'
import { PublishWidgetsForm, publishWidgetsFormReducer, publishWidgetsFormActions } from '@/features/PublishWidgets'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useParams } from 'react-router-dom'
import { useWidgetKey } from '@/entities/WidgetKeys'
import { Loader } from '@/shared/ui/Loader'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'

interface PublishWidgetEditPageProps {
    className?: string
}

const reducers: ReducersList = {
    publishWidgetsForm: publishWidgetsFormReducer
}

const PublishWidgetEditPage = memo((props: PublishWidgetEditPageProps) => {
    const { className } = props
    const { id } = useParams<{ id: string }>()
    const dispatch = useAppDispatch()

    const { data: widget, isLoading } = useWidgetKey(Number(id), { skip: !id })

    useEffect(() => {
        if (widget) {
            dispatch(publishWidgetsFormActions.initForm(widget))
        }
    }, [widget, dispatch])

    if (isLoading) {
        return (
            <Page>
                <Loader />
            </Page>
        )
    }

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <Page className={classNames('', {}, [className])}>
                <PublishWidgetsForm isEdit widgetId={id} />
            </Page>
        </DynamicModuleLoader>
    )
})

export default PublishWidgetEditPage

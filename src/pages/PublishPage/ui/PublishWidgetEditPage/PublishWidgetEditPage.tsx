import { classNames } from '@/shared/lib/classNames/classNames'
import { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { PublishWidgetsForm, publishWidgetsFormReducer, publishWidgetsFormActions } from '@/features/PublishWidgets'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { useParams } from 'react-router-dom'
import { useWidgetKeys, WidgetKey } from '@/entities/WidgetKeys'
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
    const { t } = useTranslation('publish-widgets')
    const { id } = useParams<{ id: string }>()
    const dispatch = useAppDispatch()

    const { data: widgets = [], isLoading } = useWidgetKeys()
    const widget = widgets.find(w => String(w.id) === id)

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
                <VStack gap="24" max>
                    <Text title={`${t('Редактирование виджета')}: ${widget?.name}`} size="l" bold />
                    <PublishWidgetsForm isEdit widgetId={id} />
                </VStack>
            </Page>
        </DynamicModuleLoader>
    )
})

export default PublishWidgetEditPage

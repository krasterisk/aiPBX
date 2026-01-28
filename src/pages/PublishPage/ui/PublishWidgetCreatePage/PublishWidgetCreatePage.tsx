import { classNames } from '@/shared/lib/classNames/classNames'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
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
    const { t } = useTranslation('publish-widgets')

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <Page className={classNames('', {}, [className])}>
                <VStack gap="24" max>
                    <Text title={t('Создание виджета')} size="l" bold />
                    <PublishWidgetsForm />
                </VStack>
            </Page>
        </DynamicModuleLoader>
    )
})

export default PublishWidgetCreatePage

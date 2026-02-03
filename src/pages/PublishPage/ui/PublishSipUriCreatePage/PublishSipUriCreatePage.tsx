import { classNames } from '@/shared/lib/classNames/classNames'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { PublishSipUrisForm, publishSipUrisFormReducer } from '@/features/PublishSipUris'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

interface PublishSipUriCreatePageProps {
    className?: string
}

const reducers: ReducersList = {
    publishSipUrisForm: publishSipUrisFormReducer
}

const PublishSipUriCreatePage = memo((props: PublishSipUriCreatePageProps) => {
    const { className } = props
    const { t } = useTranslation('publish-sip')

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <Page className={classNames('', {}, [className])}>
                <VStack gap="24" max>
                    <PublishSipUrisForm />
                </VStack>
            </Page>
        </DynamicModuleLoader>
    )
})

export default PublishSipUriCreatePage

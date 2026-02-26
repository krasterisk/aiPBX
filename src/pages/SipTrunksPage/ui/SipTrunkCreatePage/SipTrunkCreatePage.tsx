import { classNames } from '@/shared/lib/classNames/classNames'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from '@/widgets/Page'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { SipTrunkForm, sipTrunkFormReducer } from '@/features/SipTrunks'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

interface SipTrunkCreatePageProps {
    className?: string
}

const reducers: ReducersList = {
    sipTrunkForm: sipTrunkFormReducer
}

const SipTrunkCreatePage = memo((props: SipTrunkCreatePageProps) => {
    const { className } = props
    const { t } = useTranslation('sip-trunks')

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <Page className={classNames('', {}, [className])}>
                <VStack gap="24" max>
                    <SipTrunkForm />
                </VStack>
            </Page>
        </DynamicModuleLoader>
    )
})

export default SipTrunkCreatePage

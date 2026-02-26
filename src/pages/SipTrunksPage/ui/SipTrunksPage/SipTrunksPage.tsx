import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SipTrunksPage.module.scss'
import { memo } from 'react'
import { Page } from '@/widgets/Page'
import { SipTrunksList, sipTrunksPageReducer, useSipTrunksFilters } from '@/entities/SipTrunks'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

interface SipTrunksPageProps {
    className?: string
}

const reducers: ReducersList = {
    sipTrunksPage: sipTrunksPageReducer
}

const SipTrunksPage = memo((props: SipTrunksPageProps) => {
    const { className } = props

    const {
        isLoading,
        isError,
        data,
        onRefetch
    } = useSipTrunksFilters()

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            <Page className={classNames(cls.SipTrunksPage, {}, [className])}>
                <SipTrunksList
                    trunks={data}
                    isLoading={isLoading}
                    isError={isError}
                    onRefetch={onRefetch}
                />
            </Page>
        </DynamicModuleLoader>
    )
})

export default SipTrunksPage

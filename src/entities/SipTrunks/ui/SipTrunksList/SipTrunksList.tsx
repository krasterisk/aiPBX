import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SipTrunksList.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { SipTrunksItem } from '../SipTrunksItem/SipTrunksItem'
import { SipTrunk } from '../../api/sipTrunksApi'
import { SipTrunksListHeader } from '../SipTrunksListHeader/SipTrunksListHeader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { ContentListItemSkeleton } from '@/entities/Content'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { Icon } from '@/shared/ui/redesigned/Icon'

interface SipTrunksListProps {
    className?: string
    trunks: SipTrunk[]
    isLoading?: boolean
    isError?: boolean
    onRefetch?: () => void
}

export const SipTrunksList = memo((props: SipTrunksListProps) => {
    const { className, trunks, isLoading, isError, onRefetch } = props
    const { t } = useTranslation('sip-trunks')

    const getSkeletons = () => {
        return new Array(4)
            .fill(0)
            .map((_, index) => (
                <ContentListItemSkeleton className={cls.card} key={index} view={'BIG'} />
            ))
    }

    if (isError) {
        return <ErrorGetData onRefetch={onRefetch} />
    }

    return (
        <VStack gap={'16'} max className={classNames(cls.SipTrunksList, {}, [className])}>
            <SipTrunksListHeader />

            {trunks.length
                ? (
                    <div className={cls.listWrapper}>
                        {trunks.map((trunk) => (
                            <SipTrunksItem
                                key={trunk.id}
                                trunk={trunk}
                            />
                        ))}
                    </div>
                )
                : (
                    <VStack justify={'center'} align={'center'} max className={cls.emptyState} gap={'16'}>
                        <Icon Svg={SearchIcon} width={48} height={48} />
                        <Text align={'center'} text={t('Данные не найдены')} size={'l'} bold />
                        <Text align={'center'} text={t('У вас пока нет настроенных SIP транков')} />
                    </VStack>
                )}

            {isLoading && (
                <div className={cls.listWrapper}>
                    {getSkeletons()}
                </div>
            )}
        </VStack>
    )
})

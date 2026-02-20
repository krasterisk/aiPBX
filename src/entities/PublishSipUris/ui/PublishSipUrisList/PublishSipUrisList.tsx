import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisList.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { PublishSipUrisItem } from '../PublishSipUrisItem/PublishSipUrisItem'
import { Assistant } from '@/entities/Assistants'
import { usePbxServersCloud } from '@/entities/PbxServers'
import { PublishSipUrisListHeader } from '../PublishSipUrisListHeader/PublishSipUrisListHeader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { ContentListItemSkeleton } from '@/entities/Content'
import SearchIcon from '@/shared/assets/icons/search.svg'
import { Icon } from '@/shared/ui/redesigned/Icon'

interface PublishSipUrisListProps {
    className?: string
    assistants: Assistant[]
    isLoading?: boolean
    isError?: boolean
    onRefetch?: () => void
}

export const PublishSipUrisList = memo((props: PublishSipUrisListProps) => {
    const { className, assistants, isLoading, isError, onRefetch } = props
    const { t } = useTranslation('publish-sip')
    const { data: pbxServers } = usePbxServersCloud(null)

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
        <VStack gap={'16'} max className={classNames(cls.PublishSipUrisList, {}, [className])}>
            <PublishSipUrisListHeader />

            {assistants.length
? (
                <div className={cls.listWrapper}>
                    {assistants.map((assistant) => (
                        <PublishSipUrisItem
                            key={assistant.id}
                            assistant={assistant}
                            pbxServers={pbxServers}
                        />
                    ))}
                </div>
            )
: (
                <VStack justify={'center'} align={'center'} max className={cls.emptyState} gap={'16'}>
                    <Icon Svg={SearchIcon} width={48} height={48} />
                    <Text align={'center'} text={t('Данные не найдены')} size={'l'} bold />
                    <Text align={'center'} text={t('У вас пока нет активных SIP URIs')} />
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

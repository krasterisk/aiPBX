import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsList.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { ContentListItemSkeleton } from '@/entities/Content'
import { PublishWidgetsItem } from '../PublishWidgetsItem/PublishWidgetsItem'
import { PublishWidgetsListProps } from '../../model/types/publishWidgets'
import { WidgetKey } from '@/entities/WidgetKeys'
import { PublishWidgetsListHeader } from '../PublishWidgetsListHeader/PublishWidgetsListHeader'
import { Icon } from '@/shared/ui/redesigned/Icon'
import SearchIcon from '@/shared/assets/icons/search.svg'

export const PublishWidgetsList = memo((props: PublishWidgetsListProps) => {
    const {
        className,
        isWidgetsLoading,
        isWidgetsError,
        widgets
    } = props
    const { t } = useTranslation('publish-widgets')

    const getSkeletons = () => {
        return new Array(4)
            .fill(0)
            .map((_, index) => (
                <ContentListItemSkeleton className={cls.card} key={index} view={'BIG'} />
            ))
    }

    if (isWidgetsError) {
        return <ErrorGetData />
    }

    const renderContent = (widget: WidgetKey) => {
        return (
            <PublishWidgetsItem
                key={widget.id}
                widget={widget}
                className={cls.widgetItem}
            />
        )
    }

    return (
        <VStack gap={'16'} max className={classNames(cls.PublishWidgetsList, {}, [className])}>
            <PublishWidgetsListHeader />

            {widgets?.rows.length
? (
                <div className={cls.listWrapper}>
                    {widgets.rows.map(renderContent)}
                </div>
            )
: (
                <VStack justify={'center'} align={'center'} max className={cls.emptyState} gap={'16'}>
                    <Icon Svg={SearchIcon} width={48} height={48} />
                    <Text align={'center'} text={t('Данные не найдены')} size={'l'} bold />
                    <Text align={'center'} text={t('Попробуйте изменить параметры поиска или создайте новый виджет')} />
                </VStack>
            )}
            {isWidgetsLoading && (
                <div className={cls.listWrapper}>
                    {getSkeletons()}
                </div>
            )}
        </VStack>
    )
})

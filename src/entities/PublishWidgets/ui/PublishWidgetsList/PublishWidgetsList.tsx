import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsList.module.scss'
import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Button } from '@/shared/ui/redesigned/Button'
import { Loader } from '@/shared/ui/Loader'
import { ErrorGetData } from '@/entities/ErrorGetData'
import { ContentListItemSkeleton } from '@/entities/Content'
import { PublishWidgetsItem } from '../PublishWidgetsItem/PublishWidgetsItem'
import { PublishWidgetsListProps } from '../../model/types/publishWidgets'
import { WidgetKey, useDeleteWidgetKey } from '@/entities/WidgetKeys'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { PublishWidgetsListHeader } from '../PublishWidgetsListHeader/PublishWidgetsListHeader'

export const PublishWidgetsList = memo((props: PublishWidgetsListProps) => {
    const {
        className,
        isWidgetsLoading,
        isWidgetsError,
        widgets
    } = props
    const { t } = useTranslation('publish-widgets')

    const [checkedBox, setCheckedBox] = useState<string[]>([])
    const [indeterminateBox, setIndeterminateBox] = useState<boolean>(false)
    const [deleteWidget, { isLoading: isDeleting, isError: isDeleteError }] = useDeleteWidgetKey()

    const handleCheckChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        setCheckedBox((prev) => {
            const currentIndex = prev.indexOf(value)
            const newChecked = [...prev]
            if (currentIndex === -1) {
                newChecked.push(value)
            } else {
                newChecked.splice(currentIndex, 1)
            }
            if (widgets?.count) {
                setIndeterminateBox(newChecked.length > 0 && newChecked.length < widgets.count)
            }
            return newChecked
        })
    }, [widgets?.count])

    const handleCheckAll = useCallback(() => {
        if (indeterminateBox && widgets?.count && checkedBox.length > 0) {
            setCheckedBox(widgets.rows.map(widget => String(widget.id)))
            setIndeterminateBox(false)
        } else if (!indeterminateBox && widgets?.count && checkedBox.length === 0) {
            setCheckedBox(widgets.rows.map(widget => String(widget.id)))
            setIndeterminateBox(false)
        } else if (!indeterminateBox && checkedBox.length > 0) {
            setCheckedBox([])
        }
    }, [widgets?.count, widgets?.rows, checkedBox.length, indeterminateBox])

    const handleDeleteAll = useCallback(async () => {
        if (!window.confirm(t('Вы уверены, что хотите удалить выбранные виджеты?') ?? '')) return

        try {
            await Promise.all(checkedBox.map(id => deleteWidget(Number(id)).unwrap()))
            toast.success(t('Виджеты успешно удалены'))
            setCheckedBox([])
            setIndeterminateBox(false)
        } catch (e) {
            toast.error(getErrorMessage(e))
        }
    }, [checkedBox, deleteWidget, t])

    const getSkeletons = () => {
        return new Array(4)
            .fill(0)
            .map((_, index) => (
                <ContentListItemSkeleton className={cls.card} key={index} view={'BIG'} />
            ))
    }

    if (isWidgetsError || isDeleteError) {
        return <ErrorGetData />
    }

    if (isDeleting) {
        return (
            <VStack gap={'16'} align={'center'} className={cls.loader}>
                <Loader />
            </VStack>
        )
    }

    const checkedButtons = (
        <HStack
            gap={'16'}
            wrap={'wrap'}
            className={classNames('', {
                [cls.uncheckButtons]: checkedBox.length === 0,
                [cls.checkButton]: checkedBox.length > 0
            }, [])}
        >
            <Button variant={'clear'} onClick={handleDeleteAll}>
                <Text text={t('Удалить выбранные')} variant={'error'} />
            </Button>
        </HStack>
    )

    const renderContent = (widget: WidgetKey) => {
        return (
            <PublishWidgetsItem
                key={widget.id}
                widget={widget}
                checkedItems={checkedBox}
                onChangeChecked={handleCheckChange}
                className={cls.widgetItem}
            />
        )
    }

    return (
        <VStack gap={'16'} max className={classNames(cls.PublishWidgetsList, {}, [className])}>
            <PublishWidgetsListHeader />
            <Card max className={cls.controlsCard}>
                <HStack wrap={'nowrap'} justify={'end'} gap={'24'}>
                    <Check
                        className={classNames(cls.checkbox, {
                            [cls.uncheck]: checkedBox.length === 0,
                            [cls.check]: checkedBox.length > 0
                        }, [])}
                        indeterminate={indeterminateBox}
                        checked={widgets?.count ? checkedBox.length === widgets.count : false}
                        onChange={handleCheckAll}
                    />
                    {checkedButtons}
                    {checkedBox.length > 0
                        ? <Text text={t('Выбрано') + ': ' + String(checkedBox.length) + t(' из ') + String(widgets?.count || 0)} />
                        : <Text text={t('Всего') + ': ' + String(widgets?.count || 0)} />
                    }
                </HStack>
            </Card>

            {widgets?.rows.length
                ? <HStack wrap={'wrap'} gap={'16'} align={'start'} max>
                    {widgets.rows.map(renderContent)}
                </HStack>
                : <HStack justify={'center'} max className={cls.emptyState}>
                    <Text align={'center'} text={t('Данные не найдены')} />
                </HStack>
            }
            {isWidgetsLoading && getSkeletons()}
        </VStack>
    )
})

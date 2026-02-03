import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisList.module.scss'
import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Loader } from '@/shared/ui/Loader'
import { PublishSipUrisItem } from '../PublishSipUrisItem/PublishSipUrisItem'
import { Assistant } from '@/entities/Assistants'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { useDeleteSipUri, usePbxServersCloud } from '@/entities/PbxServers'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Button } from '@/shared/ui/redesigned/Button'
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
    const [deleteSip, { isLoading: isDeleting }] = useDeleteSipUri()
    const { data: pbxServers } = usePbxServersCloud(null)

    const [checkedBox, setCheckedBox] = useState<string[]>([])
    const [indeterminateBox, setIndeterminateBox] = useState<boolean>(false)

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
            if (assistants.length) {
                setIndeterminateBox(newChecked.length > 0 && newChecked.length < assistants.length)
            }
            return newChecked
        })
    }, [assistants.length])

    const handleCheckAll = useCallback(() => {
        if (indeterminateBox && assistants.length && checkedBox.length > 0) {
            setCheckedBox(assistants.map(assistant => String(assistant.id)))
            setIndeterminateBox(false)
        } else if (!indeterminateBox && assistants.length && checkedBox.length === 0) {
            setCheckedBox(assistants.map(assistant => String(assistant.id)))
            setIndeterminateBox(false)
        } else if (!indeterminateBox && checkedBox.length > 0) {
            setCheckedBox([])
        }
    }, [assistants, checkedBox.length, indeterminateBox])

    const handleDeleteAll = useCallback(async () => {
        if (!window.confirm(t('Вы уверены, что хотите удалить выбранные SIP URIs?') ?? '')) return

        try {
            await Promise.all(checkedBox.map(id => deleteSip({ assistantId: id }).unwrap()))
            toast.success(t('Выбранные SIP URIs успешно удалены'))
            setCheckedBox([])
            setIndeterminateBox(false)
        } catch (e) {
            toast.error(getErrorMessage(e))
        }
    }, [checkedBox, deleteSip, t])

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

    return (
        <VStack gap={'16'} max className={classNames(cls.PublishSipUrisList, {}, [className])}>
            <PublishSipUrisListHeader />

            <Card max className={cls.controlsCard} padding={'0'}>
                <HStack wrap={'nowrap'} justify={'between'} align={'center'} max className={cls.controls}>
                    <HStack gap={'16'}>
                        <Check
                            className={classNames(cls.checkbox, {
                                [cls.uncheck]: checkedBox.length === 0,
                                [cls.check]: checkedBox.length > 0
                            }, [])}
                            indeterminate={indeterminateBox}
                            checked={assistants.length ? checkedBox.length === assistants.length : false}
                            onChange={handleCheckAll}
                        />
                        {checkedBox.length > 0 ? (
                            <HStack gap={'16'}>
                                <Text
                                    text={t('Выбрано') + ': ' + String(checkedBox.length) + t(' из ') + String(assistants.length)}
                                    bold
                                />
                                {checkedButtons}
                            </HStack>
                        ) : (
                            <Text text={t('Всего') + ': ' + String(assistants.length)} variant={'accent'} />
                        )}
                    </HStack>
                </HStack>
            </Card>

            {assistants.length ? (
                <div className={cls.listWrapper}>
                    {assistants.map((assistant) => (
                        <PublishSipUrisItem
                            key={assistant.id}
                            assistant={assistant}
                            checkedItems={checkedBox}
                            onChangeChecked={handleCheckChange}
                            pbxServers={pbxServers}
                        />
                    ))}
                </div>
            ) : (
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

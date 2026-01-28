import { useTranslation } from 'react-i18next'
import React, { memo, useCallback } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import dayjs from 'dayjs'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { ClientOptions, ClientSelect, isUserAdmin } from '@/entities/User'
import cls from './PeriodExtendedFilter.module.scss'
import { useSelector } from 'react-redux'
import SearchIcon from '@mui/icons-material/Search'
import { AssistantOptions, AssistantSelect } from '@/entities/Assistants'
import { DateSelector } from '@/shared/ui/mui/DateSelector'

interface PeriodExtendedFilterProps {
    className?: string
    show: boolean
    onClose?: () => void
    startDate?: string
    endDate?: string
    userId?: string
    assistantId?: string[]
    onChangeStartDate?: (value: string) => void
    onChangeEndDate?: (value: string) => void
    onChangeAssistant: (event: any, assistant: AssistantOptions[]) => void
    onChangeUserId: (event: any, user: ClientOptions) => void

}

export const PeriodExtendedFilters = memo((props: PeriodExtendedFilterProps) => {
    const {
        className,
        show,
        endDate,
        startDate,
        userId,
        assistantId,
        onChangeStartDate,
        onClose,
        onChangeEndDate,
        onChangeAssistant,
        onChangeUserId
    } = props

    const { t } = useTranslation('assistants')
    const isAdmin = useSelector(isUserAdmin)

    const handleOnClose = useCallback(() => {
        onClose?.()
    }, [onClose])

    return (
        <Modal isOpen={show} onClose={onClose} lazy>
            <VStack gap={'24'} max className={className}>
                <HStack gap={'16'} max justify={'center'}>
                    <Text title={t('Фильтры')} bold />
                </HStack>
                <DateSelector
                    label={t('Дата с')}
                    onChange={(newValue: any) => {
                        const formattedDate = newValue && dayjs(newValue).isValid() ? dayjs(newValue).format('YYYY-MM-DD') : ''
                        onChangeStartDate?.(formattedDate)
                    }}
                    data-testid={'CaskDashboardFilterCard.fromDate'}
                    value={startDate ? dayjs(startDate) : null}
                />

                <DateSelector
                    label={t('Дата по')}
                    onChange={(newValue: any) => {
                        const formattedDate = newValue && dayjs(newValue).isValid() ? dayjs(newValue).format('YYYY-MM-DD') : ''
                        onChangeEndDate?.(formattedDate)
                    }}
                    data-testid={'CaskDashboardFilterCard.issueDate'}
                    value={endDate ? dayjs(endDate) : null}
                />
                {isAdmin
                    ? <ClientSelect
                        label={t('Клиент') || ''}
                        className={cls.clientSelect}
                        clientId={userId}
                        onChangeClient={onChangeUserId}
                    />
                    : ''
                }
                <AssistantSelect
                    multiple={true}
                    label={t('Ассистент') || ''}
                    className={cls.clientSelect}
                    onChangeAssistant={onChangeAssistant}
                />
                <HStack gap={'16'} justify={'end'} max wrap={'wrap'}>
                    <Button onClick={handleOnClose}
                        variant={'outline'} color={'success'}>
                        <SearchIcon className={cls.icon} fontSize={'small'} />
                        {t('Показать')}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    )
})

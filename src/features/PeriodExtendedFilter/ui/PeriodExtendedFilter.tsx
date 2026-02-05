import { useTranslation } from 'react-i18next'
import React, { memo, useCallback } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import dayjs from 'dayjs'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import cls from './PeriodExtendedFilter.module.scss'
import { useSelector } from 'react-redux'
import { Filter, Search } from 'lucide-react'
import { AssistantOptions, AssistantSelect } from '@/entities/Assistants'
import { DateSelector } from '@/shared/ui/mui/DateSelector'
import { classNames } from '@/shared/lib/classNames/classNames'

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
    onChangeUserId: (clientId: string) => void
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

    const { t } = useTranslation('reports')
    const isAdmin = useSelector(isUserAdmin)

    const handleOnClose = useCallback(() => {
        onClose?.()
    }, [onClose])

    return (
        <Modal isOpen={show} onClose={onClose} lazy>
            <VStack
                gap="24"
                max
                className={classNames(cls.filterContainer, {}, [className])}
            >
                <VStack max gap="8" align="center" className={cls.title}>
                    <HStack gap="8" align="center">
                        <Filter className={cls.icon} size={20} />
                        <Text title={t('Расширенные фильтры')} bold size="l" />
                    </HStack>
                    <Text text={t('Выберите параметры для фильтрации отчетов')} size="s" />
                </VStack>

                <VStack gap="16" max>
                    <HStack gap="16" max>
                        <DateSelector
                            label={t('Дата с')}
                            className={cls.fullWidth}
                            onChange={(newValue: any) => {
                                const formattedDate = newValue && dayjs(newValue).isValid() ? dayjs(newValue).format('YYYY-MM-DD') : ''
                                onChangeStartDate?.(formattedDate)
                            }}
                            data-testid="CaskDashboardFilterCard.fromDate"
                            value={startDate ? dayjs(startDate) : null}
                        />

                        <DateSelector
                            label={t('Дата по')}
                            className={cls.fullWidth}
                            onChange={(newValue: any) => {
                                const formattedDate = newValue && dayjs(newValue).isValid() ? dayjs(newValue).format('YYYY-MM-DD') : ''
                                onChangeEndDate?.(formattedDate)
                            }}
                            data-testid="CaskDashboardFilterCard.issueDate"
                            value={endDate ? dayjs(endDate) : null}
                        />
                    </HStack>

                    {isAdmin && (
                        <ClientSelect
                            label={t('Выбор клиента') || ''}
                            className={cls.clientSelect}
                            clientId={userId}
                            onChangeClient={onChangeUserId}
                            fullWidth
                        />
                    )}

                    <AssistantSelect
                        multiple
                        label={t('Выбор ассистента') || ''}
                        className={cls.clientSelect}
                        onChangeAssistant={onChangeAssistant}
                        fullWidth
                    />
                </VStack>

                <HStack gap="16" justify="end" max className={cls.footer}>
                    <Button
                        onClick={handleOnClose}
                        variant="outline"
                        addonLeft={<Search size={18} />}
                        fullWidth
                    >
                        {t('Показать результаты')}
                    </Button>
                </HStack>
            </VStack>
        </Modal>
    )
})

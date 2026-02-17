import { useTranslation } from 'react-i18next'
import React, { memo, useCallback, useMemo } from 'react'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import dayjs from 'dayjs'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { ClientSelect, isUserAdmin } from '@/entities/User'
import cls from './PeriodExtendedFilter.module.scss'
import { useSelector } from 'react-redux'
import { Filter, X } from 'lucide-react'
import { AssistantOptions, AssistantSelect } from '@/entities/Assistants'
import { DateSelector } from '@/shared/ui/mui/DateSelector'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { CdrSource } from '@/entities/Report/model/types/report'

interface SourceOption {
    label: string
    value: CdrSource | ''
}

interface PeriodExtendedFilterProps {
    className?: string
    show: boolean
    onClose?: () => void
    startDate?: string
    endDate?: string
    userId?: string
    assistantId?: string[]
    assistants?: AssistantOptions[]
    source?: CdrSource
    onChangeStartDate?: (value: string) => void
    onChangeEndDate?: (value: string) => void
    onChangeAssistant: (event: any, assistant: AssistantOptions[]) => void
    onChangeUserId: (clientId: string) => void
    onChangeSource?: (value: CdrSource | undefined) => void
}

export const PeriodExtendedFilters = memo((props: PeriodExtendedFilterProps) => {
    const {
        className,
        show,
        endDate,
        startDate,
        userId,
        assistants,
        source,
        onChangeStartDate,
        onClose,
        onChangeEndDate,
        onChangeAssistant,
        onChangeUserId,
        onChangeSource
    } = props

    const { t } = useTranslation('reports')
    const isAdmin = useSelector(isUserAdmin)

    const handleOnClose = useCallback(() => {
        onClose?.()
    }, [onClose])

    const sourceOptions: SourceOption[] = useMemo(() => [
        { label: t('Все'), value: '' },
        { label: t('Звонок'), value: 'call' },
        { label: t('Виджет'), value: 'widget' },
        { label: t('Playground'), value: 'playground' },
    ], [t])

    const selectedSource = useMemo(() => {
        return sourceOptions.find((opt) => opt.value === (source || '')) || sourceOptions[0]
    }, [source, sourceOptions])

    const handleSourceChange = useCallback((_: any, option: SourceOption | null) => {
        const val = option?.value || ''
        onChangeSource?.(val === '' ? undefined : val as CdrSource)
    }, [onChangeSource])

    return (
        <Modal isOpen={show} onClose={onClose} lazy>
            <div className={classNames(cls.filterContainer, {}, [className])}>
                {/* Close button — absolute top-right */}
                <button
                    type="button"
                    className={cls.closeBtn}
                    onClick={handleOnClose}
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <HStack gap="8" align="center" className={cls.header}>
                    <div className={cls.iconWrapper}>
                        <Filter size={16} />
                    </div>
                    <Text title={t('Расширенные фильтры')} bold size="l" />
                </HStack>

                <div className={cls.divider} />

                {/* Filter fields */}
                <VStack gap="16" max className={cls.fieldsSection}>
                    <HStack gap="16" max>
                        <DateSelector
                            label={t('Дата с') ?? ''}
                            className={cls.fullWidth}
                            onChange={(newValue: any) => {
                                const formattedDate = newValue && dayjs(newValue).isValid() ? dayjs(newValue).format('YYYY-MM-DD') : ''
                                onChangeStartDate?.(formattedDate)
                            }}
                            data-testid="CaskDashboardFilterCard.fromDate"
                            value={startDate ? dayjs(startDate) : null}
                        />

                        <DateSelector
                            label={t('Дата по') ?? ''}
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
                            className={cls.fullWidth}
                            clientId={userId}
                            onChangeClient={onChangeUserId}
                            fullWidth
                        />
                    )}

                    <AssistantSelect
                        multiple
                        value={assistants}
                        userId={userId}
                        label={t('Выбор ассистента') || ''}
                        className={cls.fullWidth}
                        onChangeAssistant={onChangeAssistant}
                        fullWidth
                    />

                    {onChangeSource && (
                        <Combobox
                            options={sourceOptions}
                            value={selectedSource}
                            onChange={handleSourceChange}
                            getOptionLabel={(option: SourceOption) => option.label}
                            isOptionEqualToValue={(option: SourceOption, value: SourceOption) => option.value === value.value}
                            label={t('Источник') ?? ''}
                            disableClearable
                            className={cls.fullWidth}
                        />
                    )}
                </VStack>
            </div>
        </Modal>
    )
})

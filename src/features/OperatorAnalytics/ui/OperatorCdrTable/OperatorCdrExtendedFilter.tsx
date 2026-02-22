import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Divider } from '@/shared/ui/Divider'
import { DateSelector } from '@/shared/ui/mui/DateSelector'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { ProjectSelect } from '../ProjectSelect/ProjectSelect'
import dayjs from 'dayjs'
import { X } from 'lucide-react'
import cls from './OperatorCdrExtendedFilter.module.scss'

interface OperatorCdrExtendedFilterProps {
    show: boolean
    onClose?: () => void
    startDate?: string
    endDate?: string
    projectId?: string
    operatorName?: string
    onChangeStartDate?: (value: string) => void
    onChangeEndDate?: (value: string) => void
    onChangeProjectId: (value: string) => void
    onChangeOperatorName: (value: string) => void
}

export const OperatorCdrExtendedFilter = memo((props: OperatorCdrExtendedFilterProps) => {
    const {
        show, onClose,
        startDate, endDate, projectId, operatorName,
        onChangeStartDate, onChangeEndDate,
        onChangeProjectId, onChangeOperatorName
    } = props

    const { t } = useTranslation('reports')

    const handleClose = useCallback(() => onClose?.(), [onClose])

    return (
        <Modal isOpen={show} onClose={handleClose} lazy>
            <VStack gap={'16'} max>
                <HStack gap={'8'} max justify={'between'} align={'center'}>
                    <Text title={String(t('Расширенные фильтры'))} bold size={'m'} />
                    <Button variant={'clear'} onClick={handleClose} aria-label={'Close'} className={cls.closeBtn}>
                        <X size={18} />
                    </Button>
                </HStack>

                <Divider />

                <HStack gap={'16'} max className={cls.row}>
                    <DateSelector
                        label={String(t('Дата с')) ?? ''}
                        className={cls.fullWidth}
                        onChange={(newValue: any) => {
                            const formatted = newValue && dayjs(newValue).isValid() ? dayjs(newValue).format('YYYY-MM-DD') : ''
                            onChangeStartDate?.(formatted)
                        }}
                        value={startDate ? dayjs(startDate) : null}
                    />
                    <DateSelector
                        label={String(t('Дата по')) ?? ''}
                        className={cls.fullWidth}
                        onChange={(newValue: any) => {
                            const formatted = newValue && dayjs(newValue).isValid() ? dayjs(newValue).format('YYYY-MM-DD') : ''
                            onChangeEndDate?.(formatted)
                        }}
                        value={endDate ? dayjs(endDate) : null}
                    />
                </HStack>

                <ProjectSelect
                    label={String(t('Выбрать проект'))}
                    value={projectId}
                    onChange={onChangeProjectId}
                    className={cls.fullWidth}
                />

                <Textarea
                    label={String(t('Оператор'))}
                    value={operatorName ?? ''}
                    onChange={e => onChangeOperatorName(e.target.value)}
                    fullWidth
                    size={'small'}
                    className={cls.fullWidth}
                />
            </VStack>
        </Modal>
    )
})

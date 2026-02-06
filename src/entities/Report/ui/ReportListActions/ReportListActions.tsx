import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportListActions.module.scss'
import { memo } from 'react'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Check } from '@/shared/ui/mui/Check'
import { Text } from '@/shared/ui/redesigned/Text'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Button } from '@/shared/ui/redesigned/Button'
import { Phone, DollarSign, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AllReports } from '../../model/types/report'

interface ReportListActionsProps {
    className?: string
    reports?: AllReports
    checkedBox: string[]
    indeterminateBox: boolean
    onCheckAll: () => void
    onExportToExcel: () => void
}

export const ReportListActions = memo((props: ReportListActionsProps) => {
    const {
        className,
        reports,
        checkedBox,
        indeterminateBox,
        onCheckAll,
        onExportToExcel
    } = props

    const { t } = useTranslation('reports')

    return (
        <Card padding="16" max border="partial" className={classNames(cls.actionsCard, {}, [className])}>
            <HStack max justify="between" align="center" wrap="wrap" gap="16">
                <HStack gap="16" align="center">
                    <Check
                        className={cls.checkAll}
                        indeterminate={indeterminateBox}
                        checked={!!reports?.rows.length && checkedBox.length === reports?.rows.length}
                        onChange={onCheckAll}
                    />
                    {checkedBox.length > 0 && (
                        <Text
                            text={`${t('Выбрано')}: ${checkedBox.length} ${t('из')} ${reports?.rows.length || 0}`}
                            bold
                            variant="accent"
                        />
                    )}
                </HStack>

                <HStack gap="16" align="center">
                    <HStack gap="16" align="center" className={cls.summaryInfo}>
                        <HStack gap="8" align="center">
                            <Icon Svg={Phone} width={18} height={18} className={cls.summaryIcon} />
                            <Text text={String(reports?.count || 0)} bold />
                        </HStack>
                        <div className={cls.divider} />
                        <HStack gap="8" align="center">
                            <Icon Svg={DollarSign} width={18} height={18} className={cls.summaryIcon} />
                            <Text text={`${reports?.totalCost || 0}`} bold />
                        </HStack>
                    </HStack>

                    <Button
                        variant="clear"
                        color="success"
                        onClick={onExportToExcel}
                        disabled={!reports?.rows.length}
                        addonLeft={<Download size={18} />}
                    >
                        {t('Выгрузить в Excel')}
                    </Button>
                </HStack>
            </HStack>
        </Card>
    )
})

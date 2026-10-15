import { memo } from 'react'
import { CircleHelp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { Tooltip } from '@/shared/ui/redesign-v3/Tooltip'
import cls from './DashboardHint.module.scss'

interface DashboardHintProps {
    hint: string
    label?: string
}

export const DashboardHint = memo(({ hint, label }: DashboardHintProps) => {
    const { t } = useTranslation('reports')
    return (
        <Tooltip title={hint} placement="top">
            <Button variant="clear" className={cls.hint} aria-label={label ?? String(t('Подсказка'))} addonLeft={<CircleHelp size={16} aria-hidden />} />
        </Tooltip>
    )
})

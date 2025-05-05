import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportHistory.module.scss'
import { memo } from 'react'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Report } from '../../model/types/report'
import { useReportDialog } from '../../hooks/useReportDialog'

interface ReportHistoryProps {
  className?: string
  report: Report
}

export const ReportHistory = memo((props: ReportHistoryProps) => {
  const {
    className,
    report
  } = props

  const dialogMessages: Report[] = useReportDialog(report.event)

  return (
        <HStack className={classNames(cls.ReportHistory, {}, [className])}>
          {dialogMessages.map((msg, idx) => (
          <Text text={msg}/>
          ))}
        </HStack>
  )
})

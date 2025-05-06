import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ReportHistory.module.scss'
import { memo } from 'react'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Report } from '../../model/types/report'

interface ReportHistoryProps {
  className?: string
  report: Report
}

export const ReportHistory = memo((props: ReportHistoryProps) => {
  const {
    className,
    report
  } = props

  // const dialogMessages: Report[] = useReportDialog(report.tokens)

  return (
        <HStack className={classNames(cls.ReportHistory, {}, [className])}>
          {/* {dialogMessages.map((msg, idx) => ( */}
          {/* // <Text text={msg}/> */}
          {/* ))} */}
        </HStack>
  )
})

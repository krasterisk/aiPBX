import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { isUserAdmin } from '@/entities/User'
import { ReportExpandedPanel, useGetReportDialogs, useCreateCallAnalytics, useRegenerateOperatorAnalytics, isOperatorAnalyticsSource, type Report } from '@/entities/Report'
import { MediaPlayer } from '@/shared/ui/MediaPlayer'
import { journalDuration } from '../../lib/journalModel'
import cls from './CallsJournal.module.scss'

export function JournalDetail({ report }: { report: Report }) {
    const { t } = useTranslation('calls-journal')
    const admin = useSelector(isUserAdmin)
    const operator = isOperatorAnalyticsSource(report.source)
    const { currentData: dialogs, isFetching, isError } = useGetReportDialogs(report.channelId, { skip: Boolean(report.transcription) })
    const [create, createState] = useCreateCallAnalytics()
    const [regenerate, regenerateState] = useRegenerateOperatorAnalytics()
    const [failed, setFailed] = useState(false)
    const run = async () => {
        setFailed(false)
        try {
            if (operator) await regenerate(report.channelId).unwrap()
            else await create(report.channelId).unwrap()
        } catch { setFailed(true) }
    }
    return <div className={cls.detail}>
        <header className={cls.detailHeader}>
            <small>{new Date(report.createdAt).toLocaleString()} · {journalDuration(report.duration)}</small>
            <h2>{report.callerId || t('noPhone')}</h2>
            <p>{report.assistantName || t('noOperator')}{report.operatorExtension ? ` · ${t('extension')} ${report.operatorExtension}` : ''}</p>
        </header>
        {report.recordUrl && <div className={cls.recording}><MediaPlayer src={report.recordUrl} /></div>}
        {failed && <p role="alert" className={cls.error}>{t('analysisError')}</p>}
        <ReportExpandedPanel report={report} dialogs={dialogs} isDialogLoading={isFetching} isDialogError={isError}
            onGetAnalytics={!operator ? () => { void run() } : undefined}
            onRegenerateAnalytics={admin && operator ? () => { void run() } : undefined}
            isAnalyticsLoading={createState.isLoading || regenerateState.isLoading} />
    </div>
}

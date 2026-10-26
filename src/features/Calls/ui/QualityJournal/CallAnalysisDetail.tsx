import { useTranslation } from 'react-i18next'
import { useGetQualityDetailQuery, type OperatorProject } from '@/entities/Report'
import { JournalDetail } from './JournalDetail'

/** Channel-based adapter for opening the journal detail from other pages. */
export function CallAnalysisDetail({ channelId, project, onDeleted }: {
    channelId: string
    project?: OperatorProject
    onDeleted?: () => void
}) {
    const { t } = useTranslation('quality-journal')
    const detail = useGetQualityDetailQuery({ channelId })
    if (!detail.currentData) {
        return <div role={detail.isError ? 'alert' : 'status'}>
            <p>{t(detail.isError ? 'qualityLoadError' : 'loading')}</p>
            {detail.isError && <button type="button" onClick={() => { void detail.refetch() }}>{t('retry')}</button>}
        </div>
    }
    return <JournalDetail key={channelId} report={detail.currentData.record} project={project} onDeleted={onDeleted} />
}

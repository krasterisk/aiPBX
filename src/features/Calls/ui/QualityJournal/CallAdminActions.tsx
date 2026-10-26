import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Copy, Download, RefreshCw, Trash2 } from 'lucide-react'
import { isUserAdmin } from '@/entities/User'
import { useDeleteReport, useRegenerateCallFreeMutation, type Report } from '@/entities/Report'
import cls from './CallsJournal.module.scss'
export function CallAdminActions({ report, operator, disabled, onDeleted, onChanged, onCopy, onExport, onPreview }: {
    report: Report
     operator: boolean
     disabled?: boolean
     onDeleted?: () => void
     onChanged: () => void
     onCopy: () => void
     onExport: () => void
     onPreview?: () => void
}) {
    const admin = useSelector(isUserAdmin)
    const { t } = useTranslation('quality-journal')
    const [regenerate, regeneration] = useRegenerateCallFreeMutation()
    const [remove, deletion] = useDeleteReport()
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [message, setMessage] = useState('')
    if (!admin) return null
    const busy = disabled || regeneration.isLoading || deletion.isLoading
    return <section className={cls.detailSection}>
        <p className={cls.note}>{t('regenerateFreeHint')}</p>
        <div className={cls.adminActions}>
            {onPreview && <button type="button" className={cls.button} disabled={busy} onClick={onPreview}>{t('previewAnalyze')}</button>}
            <button type="button" className={cls.button} disabled={busy} onClick={() => { setMessage(''); void regenerate({ channelId: report.channelId, operator }).unwrap().then(() => { setMessage(String(t('regenerated'))); onChanged() }).catch(() => { setMessage(String(t('analysisError'))) }) }}><RefreshCw size={14} aria-hidden />{t(regeneration.isLoading ? 'loading' : 'regenerateFree')}</button>
            <button type="button" className={cls.button} onClick={onCopy}><Copy size={14} aria-hidden />{t('copyId')}</button>
            <button type="button" className={cls.button} onClick={onExport}><Download size={14} aria-hidden />{t('exportDetails')}</button>
            <button type="button" className={`${cls.button} ${cls.danger}`} disabled={busy} onClick={() => { setConfirmDelete(true) }}><Trash2 size={14} aria-hidden />{t('deleteCall')}</button>
        </div>
        {confirmDelete && <div role="alert" className={cls.deleteConfirmation}><p>{t('deleteConfirm')}</p><div className={cls.actions}>
            <button type="button" className={`${cls.button} ${cls.danger}`} disabled={busy} onClick={() => { void remove(report.id).unwrap().then(() => { onDeleted?.() }).catch(() => { setMessage(String(t('deleteError'))) }) }}>{t('confirmDelete')}</button>
            <button type="button" className={cls.button} disabled={busy} onClick={() => { setConfirmDelete(false) }}>{t('cancel')}</button>
        </div></div>}
        {message && <p role="status">{message}</p>}
    </section>
}

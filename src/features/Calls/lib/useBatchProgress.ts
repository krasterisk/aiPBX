import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useLazyGetBatchStatus, reportApi, BatchItemStatus } from '@/entities/Report'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'

export interface BatchProgressState {
    batchId: string | null
    progress: number
    completed: number
    failed: number
    total: number
    isActive: boolean
    items: Array<{ id: string, filename: string, status: BatchItemStatus }>
}

const POLL_INTERVAL = 3000

export function useBatchProgress() {
    const { t } = useTranslation('reports')
    const dispatch = useAppDispatch()
    const [fetchBatchStatus] = useLazyGetBatchStatus()
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const [state, setState] = useState<BatchProgressState>({
        batchId: null,
        progress: 0,
        completed: 0,
        failed: 0,
        total: 0,
        isActive: false,
        items: []
    })

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [])

    const dismiss = useCallback(() => {
        stopPolling()
        setState(prev => ({ ...prev, isActive: false, batchId: null }))
    }, [stopPolling])

    const poll = useCallback(async (batchId: string) => {
        try {
            const status = await fetchBatchStatus(batchId).unwrap()

            setState({
                batchId,
                progress: status.progress,
                completed: status.completed,
                failed: status.failed,
                total: status.total,
                isActive: true,
                items: status.items
            })

            if (status.finishedAt) {
                stopPolling()

                const msg = t('Обработка завершена: {{completed}} из {{total}} файлов', {
                    completed: status.completed,
                    total: status.total
                })

                if (status.failed > 0) {
                    toast.warning(msg)
                } else {
                    toast.success(msg)
                }

                // Invalidate caches so the table refreshes
                dispatch(reportApi.util.invalidateTags(['OperatorAnalytics', 'Reports']))
            }
        } catch (err) {
            console.error('Batch polling error:', err)
        }
    }, [fetchBatchStatus, stopPolling, t, dispatch])

    const startPolling = useCallback((batchId: string) => {
        stopPolling()

        setState({
            batchId,
            progress: 0,
            completed: 0,
            failed: 0,
            total: 0,
            isActive: true,
            items: []
        })

        // Immediate first poll
        poll(batchId)

        intervalRef.current = setInterval(() => {
            poll(batchId)
        }, POLL_INTERVAL)
    }, [stopPolling, poll])

    // Cleanup on unmount
    useEffect(() => {
        return () => { stopPolling() }
    }, [stopPolling])

    return {
        ...state,
        startPolling,
        dismiss
    }
}

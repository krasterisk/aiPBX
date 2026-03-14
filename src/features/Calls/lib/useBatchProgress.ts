import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
    useLazyGetBatchStatus,
    useLazyGetActiveBatches,
    reportApi,
    BatchItemStatus,
    BatchStatusResponse
} from '@/entities/Report'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'

export interface SingleBatchState {
    batchId: string
    progress: number
    completed: number
    failed: number
    total: number
    items: Array<{ id: string, filename: string, status: BatchItemStatus }>
    finished: boolean
}

export interface MultiBatchState {
    batches: SingleBatchState[]
    isActive: boolean
    /** Aggregated across all active batches */
    progress: number
    completed: number
    failed: number
    total: number
}

const POLL_INTERVAL = 3000

export interface UseBatchProgressReturn extends MultiBatchState {
    startPolling: (batchId: string) => void
    dismiss: () => void
}

export function useBatchProgress(): UseBatchProgressReturn {
    const { t } = useTranslation('reports')
    const dispatch = useAppDispatch()
    const [fetchBatchStatus] = useLazyGetBatchStatus()
    const [fetchActiveBatches] = useLazyGetActiveBatches()
    const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map())
    const mountedRef = useRef(true)

    const [batches, setBatches] = useState<Map<string, SingleBatchState>>(new Map())

    // ─── derived aggregated state ─────────────────────────────────────
    const batchArray = Array.from(batches.values())
    const activeBatches = batchArray.filter(b => !b.finished)
    const isActive = activeBatches.length > 0

    const total = batchArray.reduce((s, b) => s + b.total, 0)
    const completed = batchArray.reduce((s, b) => s + b.completed, 0)
    const failed = batchArray.reduce((s, b) => s + b.failed, 0)
    const progress = total > 0 ? Math.round(((completed + failed) / total) * 100) : 0

    // ─── stop polling for one batch ───────────────────────────────────
    const stopOne = useCallback((batchId: string) => {
        const timer = intervalsRef.current.get(batchId)
        if (timer) {
            clearInterval(timer)
            intervalsRef.current.delete(batchId)
        }
    }, [])

    // ─── stop all polling ─────────────────────────────────────────────
    const stopAll = useCallback(() => {
        intervalsRef.current.forEach(timer => { clearInterval(timer) })
        intervalsRef.current.clear()
    }, [])

    // ─── dismiss (hide all) ───────────────────────────────────────────
    const dismiss = useCallback(() => {
        stopAll()
        setBatches(new Map())
    }, [stopAll])

    // ─── poll one batch ───────────────────────────────────────────────
    const pollOne = useCallback(async (batchId: string) => {
        try {
            const status: BatchStatusResponse = await fetchBatchStatus(batchId).unwrap()
            if (!mountedRef.current) return

            const finished = status.finishedAt !== null

            setBatches(prev => {
                const next = new Map(prev)
                next.set(batchId, {
                    batchId,
                    progress: status.progress,
                    completed: status.completed,
                    failed: status.failed,
                    total: status.total,
                    items: status.items,
                    finished
                })
                return next
            })

            if (finished) {
                stopOne(batchId)

                const msg = t('Обработка завершена: {{completed}} из {{total}} файлов', {
                    completed: status.completed,
                    total: status.total
                })

                if (status.failed > 0) {
                    toast.warning(msg)
                } else {
                    toast.success(msg)
                }

                dispatch(reportApi.util.invalidateTags(['OperatorAnalytics', 'Reports']))
            }
        } catch (err) {
            console.error('Batch polling error:', err)
        }
    }, [fetchBatchStatus, stopOne, t, dispatch])

    // ─── start polling for one batch ──────────────────────────────────
    const startPollingOne = useCallback((batchId: string, initial?: SingleBatchState) => {
        // Don't start if already polling this batch
        if (intervalsRef.current.has(batchId)) return

        setBatches(prev => {
            const next = new Map(prev)
            if (!next.has(batchId)) {
                next.set(batchId, initial ?? {
                    batchId,
                    progress: 0,
                    completed: 0,
                    failed: 0,
                    total: 0,
                    items: [],
                    finished: false
                })
            }
            return next
        })

        // Immediate first poll
        pollOne(batchId)

        const timer = setInterval(() => { pollOne(batchId) }, POLL_INTERVAL)
        intervalsRef.current.set(batchId, timer)
    }, [pollOne])

    // ─── public: start polling (called from upload) ───────────────────
    const startPolling = useCallback((batchId: string) => {
        startPollingOne(batchId)
    }, [startPollingOne])

    // ─── on mount: restore unfinished batches ─────────────────────────
    useEffect(() => {
        mountedRef.current = true

        const restore = async () => {
            try {
                const allBatches = await fetchActiveBatches().unwrap()
                if (!mountedRef.current) return

                for (const b of allBatches) {
                    if (!b.finishedAt) {
                        startPollingOne(b.batchId, {
                            batchId: b.batchId,
                            progress: b.progress,
                            completed: b.completed,
                            failed: b.failed,
                            total: b.total,
                            items: b.items,
                            finished: false
                        })
                    }
                }
            } catch (err) {
                console.error('Failed to restore active batches:', err)
            }
        }

        restore()

        return () => {
            mountedRef.current = false
            stopAll()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        batches: batchArray,
        isActive,
        progress,
        completed,
        failed,
        total,
        startPolling,
        dismiss
    }
}

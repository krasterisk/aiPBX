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

const POLL_INTERVAL = 5000

export interface UseBatchProgressReturn extends MultiBatchState {
    startPolling: (batchId: string) => void
    dismiss: () => void
}

export function useBatchProgress(): UseBatchProgressReturn {
    const { t } = useTranslation('reports')
    const dispatch = useAppDispatch()
    const [fetchBatchStatus] = useLazyGetBatchStatus()
    const [fetchActiveBatches] = useLazyGetActiveBatches()
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const mountedRef = useRef(true)
    const batchIdsRef = useRef<Set<string>>(new Set())

    const [batches, setBatches] = useState<Map<string, SingleBatchState>>(new Map())

    // ─── derived aggregated state ─────────────────────────────────────
    const batchArray = Array.from(batches.values())
    const activeBatches = batchArray.filter(b => !b.finished)
    const isActive = activeBatches.length > 0

    const total = batchArray.reduce((s, b) => s + b.total, 0)
    const completed = batchArray.reduce((s, b) => s + b.completed, 0)
    const failed = batchArray.reduce((s, b) => s + b.failed, 0)
    const progress = total > 0 ? Math.round(((completed + failed) / total) * 100) : 0

    // ─── stop polling ─────────────────────────────────────────────────
    const stopAll = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [])

    // ─── dismiss (hide all) ───────────────────────────────────────────
    const dismiss = useCallback(() => {
        stopAll()
        batchIdsRef.current.clear()
        setBatches(new Map())
    }, [stopAll])

    // ─── poll one batch ───────────────────────────────────────────────
    const pollOneBatch = useCallback(async (batchId: string) => {
        try {
            const status: BatchStatusResponse = await fetchBatchStatus(batchId).unwrap()
            if (!mountedRef.current) return

            const finished = Boolean(status.finishedAt)

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
                batchIdsRef.current.delete(batchId)

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
            // Silently skip 429/network errors, will retry on next tick
        }
    }, [fetchBatchStatus, t, dispatch])

    // ─── round-robin poll cycle ────────────────────────────────────────
    // Instead of one setInterval per batch, use a single timer that
    // sequentially polls each active batch with a gap between requests.
    const pollCycleRef = useRef(0)

    const runPollTick = useCallback(() => {
        const ids = Array.from(batchIdsRef.current)
        if (ids.length === 0) return

        // Round-robin: poll one batch per tick
        const idx = pollCycleRef.current % ids.length
        pollCycleRef.current++
        pollOneBatch(ids[idx])
    }, [pollOneBatch])

    // ─── ensure timer is running ──────────────────────────────────────
    const ensureTimer = useCallback(() => {
        if (timerRef.current) return
        // Immediate first poll
        runPollTick()
        timerRef.current = setInterval(runPollTick, POLL_INTERVAL)
    }, [runPollTick])

    // ─── public: start polling (called from upload) ───────────────────
    const startPolling = useCallback((batchId: string) => {
        if (batchIdsRef.current.has(batchId)) return

        batchIdsRef.current.add(batchId)

        setBatches(prev => {
            const next = new Map(prev)
            if (!next.has(batchId)) {
                next.set(batchId, {
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

        ensureTimer()
    }, [ensureTimer])

    // ─── auto-stop when all finished ──────────────────────────────────
    useEffect(() => {
        if (batchIdsRef.current.size === 0 && timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    })

    // ─── on mount: restore unfinished batches ─────────────────────────
    useEffect(() => {
        mountedRef.current = true

        const restore = async () => {
            try {
                const allBatches = await fetchActiveBatches().unwrap()
                if (!mountedRef.current) return

                for (const b of allBatches) {
                    if (!b.finishedAt) {
                        batchIdsRef.current.add(b.batchId)

                        setBatches(prev => {
                            const next = new Map(prev)
                            next.set(b.batchId, {
                                batchId: b.batchId,
                                progress: b.progress,
                                completed: b.completed,
                                failed: b.failed,
                                total: b.total,
                                items: b.items,
                                finished: false
                            })
                            return next
                        })
                    }
                }

                if (batchIdsRef.current.size > 0) {
                    ensureTimer()
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

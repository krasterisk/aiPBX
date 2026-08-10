export type PlaygroundMode = 'call' | 'setup' | 'debug'

export type PlaygroundSessionStatus = 'idle' | 'connecting' | 'connected' | 'error'

/** D-02: selecting an assistant transitions UI to Call. */
export function modeAfterAssistantSelect (): PlaygroundMode {
    return 'call'
}

/** D-03: Setup is blocked while connecting or connected. */
export function canOpenSetup (status: PlaygroundSessionStatus): boolean {
    return status !== 'connecting' && status !== 'connected'
}

/**
 * Resolve a requested mode change. Opening setup while the session is live is a no-op (D-03).
 * Debug may open during a call (events sheet over Call).
 */
export function resolveModeTransition (
    current: PlaygroundMode,
    next: PlaygroundMode,
    status: PlaygroundSessionStatus
): PlaygroundMode {
    if (next === 'setup' && !canOpenSetup(status)) {
        return current
    }
    return next
}

/** Status label key for Call chrome (short product copy). */
export function statusLabelKey (status: PlaygroundSessionStatus): string {
    switch (status) {
        case 'connecting':
            return 'Подключение…'
        case 'connected':
            return 'Подключено'
        case 'error':
            return 'Ошибка'
        case 'idle':
        default:
            return 'Отключено'
    }
}

export function formatCallTimer (totalSeconds: number): string {
    const safe = Math.max(0, Math.floor(totalSeconds))
    const m = Math.floor(safe / 60)
    const s = safe % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

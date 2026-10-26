/** Elapsed duration: MM:SS below an hour, HH:MM:SS otherwise; missing is not zero. */
export function formatDuration(seconds?: number | null): string {
    if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return '—'
    const total = Math.floor(seconds)
    const pad = (n: number) => String(n).padStart(2, '0')
    return total >= 3600 ? `${pad(Math.floor(total / 3600))}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}` : `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}

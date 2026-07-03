import { lazy } from 'react'

export const HelpdeskDetailPageAsync = lazy(async () =>
    await import('./HelpdeskDetailPage').then((m) => ({ default: m.HelpdeskDetailPage })),
)

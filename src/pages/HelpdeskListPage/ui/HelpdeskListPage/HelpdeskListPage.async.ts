import { lazy } from 'react'

export const HelpdeskListPageAsync = lazy(async () =>
    await import('./HelpdeskListPage').then((m) => ({ default: m.HelpdeskListPage })),
)

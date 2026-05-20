import { lazy } from 'react'

export const OurOrganizationsPageAsync = lazy(async () =>
    await import('./OurOrganizationsPage').then((m) => ({ default: m.OurOrganizationsPage })),
)

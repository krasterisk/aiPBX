import { lazy } from 'react'

export const UsersPageAsync = lazy(async () => await import('./UsersPage'))

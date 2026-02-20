import { lazy } from 'react'

export const PlaygroundPageAsync = lazy(async () => await import('./Playground'))

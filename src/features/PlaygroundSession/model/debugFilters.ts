import { EventCategory } from './types/playgroundEvent'

/** Default Debug event filters (D-11): everything except raw audio. */
export const DEFAULT_DEBUG_FILTERS: ReadonlyArray<EventCategory> = [
    'transcript',
    'function',
    'response',
    'session',
    'error',
    'vad',
]

export function createDefaultDebugFilters (): Set<EventCategory> {
    return new Set(DEFAULT_DEBUG_FILTERS)
}

export function defaultFiltersExcludeAudio (): boolean {
    return !DEFAULT_DEBUG_FILTERS.includes('audio')
}

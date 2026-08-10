export type SetupSectionKey = 'prompt' | 'parameters' | 'vad' | 'tools'

/** Exclusive accordion: Prompt open by default (D-31). Tools last (D-08). */
export const DEFAULT_SETUP_SECTION: SetupSectionKey = 'prompt'

export const SETUP_SECTIONS: readonly SetupSectionKey[] = [
    'prompt',
    'parameters',
    'vad',
    'tools',
] as const

export function resolveExclusiveExpand (
    _current: SetupSectionKey | false,
    panel: SetupSectionKey,
    isExpanded: boolean,
): SetupSectionKey | false {
    return isExpanded ? panel : false
}

export type SetupSectionKey = 'prompt' | 'tools' | 'parameters' | 'vad'

/** Exclusive accordion: Prompt open by default (D-31). Tools second after Prompt (UAT). */
export const DEFAULT_SETUP_SECTION: SetupSectionKey = 'prompt'

export const SETUP_SECTIONS: readonly SetupSectionKey[] = [
    'prompt',
    'tools',
    'parameters',
    'vad',
] as const

export function resolveExclusiveExpand (
    _current: SetupSectionKey | false,
    panel: SetupSectionKey,
    isExpanded: boolean,
): SetupSectionKey | false {
    return isExpanded ? panel : false
}

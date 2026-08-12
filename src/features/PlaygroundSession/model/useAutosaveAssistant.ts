import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import {
    Assistant,
    assistantFormActions,
    getAssistantFormData,
    useUpdateAssistant,
} from '@/entities/Assistants'
import { StateSchema } from '@/app/providers/StoreProvider'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'

/** Minimum fields required before PATCH (mirrors Assistants validateAssistant). */
export function validateAssistantForAutosave (data: Assistant | null | undefined): boolean {
    if (!data?.id) return false
    return !!(data.name && data.model && data.voice && data.instruction)
}

/** Skip no-op PATCH when form matches initialData snapshot (D-05). */
export function isAssistantFormClean (
    data: Assistant | null | undefined,
    initialData: Assistant | null | undefined,
): boolean {
    if (!data || !initialData) return false
    return JSON.stringify(data) === JSON.stringify(initialData)
}

export type AutosaveAttempt =
    | { ok: true, skipped: true }
    | { ok: true, skipped: false }
    | { ok: false, reason: 'validation' | 'api' }

/**
 * Pure autosave gate used by useAutosaveAssistant and unit tests (PG-UX-02).
 * Caller supplies updateFn that PATCHes only the selected assistant payload.
 */
export async function runAutosaveAssistant (args: {
    data: Assistant | null | undefined
    initialData: Assistant | null | undefined
    updateFn: (assistant: Assistant) => Promise<unknown>
}): Promise<AutosaveAttempt> {
    const { data, initialData, updateFn } = args

    // No selected assistant / empty form — nothing to PATCH; allow Setup to close.
    if (!data?.id) {
        return { ok: true, skipped: true }
    }

    if (!validateAssistantForAutosave(data)) {
        return { ok: false, reason: 'validation' }
    }

    if (isAssistantFormClean(data, initialData)) {
        return { ok: true, skipped: true }
    }

    try {
        await updateFn(data)
        return { ok: true, skipped: false }
    } catch {
        return { ok: false, reason: 'api' }
    }
}

const getAssistantFormInitialData = (state: StateSchema) =>
    state.assistantForm?.initialData

/**
 * Dirty-aware updateAssistant. Returns false on validation/API failure (D-05, D-06).
 * Only PATCHes getAssistantFormData for the selected assistant id (T-11-04).
 */
export function useAutosaveAssistant () {
    const dispatch = useAppDispatch()
    const data = useSelector(getAssistantFormData)
    const initialData = useSelector(getAssistantFormInitialData)
    const [updateAssistant, { isLoading }] = useUpdateAssistant()

    const autosave = useCallback(async (): Promise<boolean> => {
        const result = await runAutosaveAssistant({
            data,
            initialData,
            updateFn: async (assistant) => {
                // Threat T-11-04: patch body always includes form id from selected assistant
                await updateAssistant(assistant).unwrap()
                dispatch(assistantFormActions.initEdit(assistant))
            },
        })
        return result.ok
    }, [data, initialData, updateAssistant, dispatch])

    return { autosave, isSaving: isLoading }
}

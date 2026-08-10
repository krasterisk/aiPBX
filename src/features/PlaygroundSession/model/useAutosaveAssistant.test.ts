import {
    isAssistantFormClean,
    runAutosaveAssistant,
    validateAssistantForAutosave,
} from './useAutosaveAssistant'

describe('useAutosaveAssistant (PG-UX-02)', () => {
    const base = {
        id: 'a1',
        name: 'Bot',
        model: 'gpt-4o-realtime-preview',
        voice: 'alloy',
        instruction: 'Hello',
    }

    it('skips PATCH when form is clean vs initialData', async () => {
        const updateFn = jest.fn()
        const result = await runAutosaveAssistant({
            data: { ...base },
            initialData: { ...base },
            updateFn,
        })
        expect(result).toEqual({ ok: true, skipped: true })
        expect(updateFn).not.toHaveBeenCalled()
        expect(isAssistantFormClean(base, base)).toBe(true)
    })

    it('saves when dirty and returns success', async () => {
        const updateFn = jest.fn().mockResolvedValue({ ...base, instruction: 'Updated' })
        const result = await runAutosaveAssistant({
            data: { ...base, instruction: 'Updated' },
            initialData: { ...base },
            updateFn,
        })
        expect(result).toEqual({ ok: true, skipped: false })
        expect(updateFn).toHaveBeenCalledWith({ ...base, instruction: 'Updated' })
    })

    it('fails on validation and blocks Start (D-06)', async () => {
        const updateFn = jest.fn()
        const result = await runAutosaveAssistant({
            data: { ...base, instruction: '' },
            initialData: { ...base },
            updateFn,
        })
        expect(result).toEqual({ ok: false, reason: 'validation' })
        expect(updateFn).not.toHaveBeenCalled()
        expect(validateAssistantForAutosave({ ...base, instruction: '' })).toBe(false)
    })

    it('fails on API error and blocks Start (D-06)', async () => {
        const updateFn = jest.fn().mockRejectedValue(new Error('network'))
        const result = await runAutosaveAssistant({
            data: { ...base, name: 'Changed' },
            initialData: { ...base },
            updateFn,
        })
        expect(result).toEqual({ ok: false, reason: 'api' })
    })

    it('requires selected assistant id (T-11-04)', () => {
        expect(validateAssistantForAutosave({ ...base, id: undefined })).toBe(false)
    })
})

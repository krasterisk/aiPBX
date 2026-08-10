import {
    isMicChecklistOk,
    resolveMicChecklistItem,
    shouldDisableStartForMic,
} from './useMicPermission'

describe('useMicPermission helpers', () => {
    it('marks checklist OK when permission is granted (D-25)', () => {
        expect(resolveMicChecklistItem('granted')).toEqual({
            status: 'ok',
            labelKey: 'Микрофон готов',
        })
        expect(isMicChecklistOk('granted')).toBe(true)
    })

    it('marks checklist denied with short warning key (D-25, D-26)', () => {
        expect(resolveMicChecklistItem('denied')).toEqual({
            status: 'denied',
            labelKey: 'Нет доступа к микрофону',
            tooltipKey: 'Откройте настройки сайта в браузере → Разрешения → Микрофон → Разрешить, затем нажмите «Повторить проверку».',
            showRetry: true,
        })
        expect(isMicChecklistOk('denied')).toBe(false)
    })

    it('disables Start until mic is OK (D-25)', () => {
        expect(shouldDisableStartForMic('denied')).toBe(true)
        expect(shouldDisableStartForMic('prompt')).toBe(true)
        expect(shouldDisableStartForMic('unknown')).toBe(true)
        expect(shouldDisableStartForMic('unavailable')).toBe(true)
        expect(shouldDisableStartForMic('granted')).toBe(false)
    })

    it('treats prompt as pending until probe completes', () => {
        expect(resolveMicChecklistItem('prompt')).toEqual({
            status: 'pending',
            labelKey: 'Микрофон',
            showRetry: true,
        })
    })
})

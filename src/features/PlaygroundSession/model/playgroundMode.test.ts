import {
    canOpenSetup,
    formatCallTimer,
    modeAfterAssistantSelect,
    resolveModeTransition,
    statusLabelKey,
} from './playgroundMode'

describe('playgroundMode', () => {
    it('transitions to call after assistant select (D-02)', () => {
        expect(modeAfterAssistantSelect()).toBe('call')
    })

    it('blocks Setup while connecting or connected (D-03)', () => {
        expect(canOpenSetup('idle')).toBe(true)
        expect(canOpenSetup('error')).toBe(true)
        expect(canOpenSetup('connecting')).toBe(false)
        expect(canOpenSetup('connected')).toBe(false)
    })

    it('keeps current mode when openSetup is requested while connected', () => {
        expect(resolveModeTransition('call', 'setup', 'connected')).toBe('call')
        expect(resolveModeTransition('call', 'setup', 'connecting')).toBe('call')
        expect(resolveModeTransition('call', 'setup', 'idle')).toBe('setup')
    })

    it('allows debug while connected (events sheet over Call)', () => {
        expect(resolveModeTransition('call', 'debug', 'connected')).toBe('debug')
    })

    it('maps status labels for Call chrome', () => {
        expect(statusLabelKey('idle')).toBe('Отключено')
        expect(statusLabelKey('connecting')).toBe('Подключение…')
        expect(statusLabelKey('connected')).toBe('Подключено')
        expect(statusLabelKey('error')).toBe('Ошибка')
    })

    it('formats MM:SS timer', () => {
        expect(formatCallTimer(0)).toBe('00:00')
        expect(formatCallTimer(65)).toBe('01:05')
        expect(formatCallTimer(3723)).toBe('62:03')
    })
})

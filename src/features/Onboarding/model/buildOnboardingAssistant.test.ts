import { buildOnboardingAssistant } from './buildOnboardingAssistant'

describe('buildOnboardingAssistant', () => {
    it('does not send empty userId from initAssistant', () => {
        const payload = buildOnboardingAssistant({
            name: 'Pizza bot',
            instruction: 'Take orders',
        })

        expect(payload.userId).toBeUndefined()
        expect(payload.user).toBeUndefined()
        expect(payload.id).toBeUndefined()
        expect(payload.name).toBe('Pizza bot')
        expect(payload.instruction).toBe('Take orders')
        expect(payload.tools).toEqual([])
    })

    it('sets userId when the current user is known', () => {
        const payload = buildOnboardingAssistant({
            name: 'Clinic bot',
            instruction: 'Book visits',
            userId: '42',
        })

        expect(payload.userId).toBe('42')
    })

    it('treats blank userId as missing', () => {
        const payload = buildOnboardingAssistant({
            name: 'Bot',
            instruction: 'Hi',
            userId: '   ',
        })

        expect(payload.userId).toBeUndefined()
    })
})

import { getVoicesForRealtimeModel } from './realtimeVoices'

describe('getVoicesForRealtimeModel', () => {
    it('returns OpenAI voices for gpt models', () => {
        expect(getVoicesForRealtimeModel('gpt-realtime-mini')).toContain('alloy')
        expect(getVoicesForRealtimeModel('gpt-realtime-mini')).not.toContain('alena')
    })

    it('returns Yandex voices when the model name starts with yandex', () => {
        expect(getVoicesForRealtimeModel('yandex-realtime')).toContain('alena')
        expect(getVoicesForRealtimeModel('yandex-realtime')).not.toContain('alloy')
    })

    it('matches Yandex by name case-insensitively', () => {
        expect(getVoicesForRealtimeModel('Yandex SpeechSense')).toContain('alena')
    })

    it('uses catalog realtimeVendor when the name has no yandex prefix', () => {
        expect(getVoicesForRealtimeModel('speechsense', 'yandex')).toContain('alena')
        expect(getVoicesForRealtimeModel('speechsense', 'yandex')).not.toContain('alloy')
    })

    it('lets catalog vendor win over a conflicting name prefix', () => {
        expect(getVoicesForRealtimeModel('yandex-custom', 'qwen')).toContain('Cherry')
        expect(getVoicesForRealtimeModel('yandex-custom', 'qwen')).not.toContain('alena')
    })

    it('returns Qwen voices for qwen models', () => {
        expect(getVoicesForRealtimeModel('qwen-omni-realtime')).toContain('Cherry')
    })

    it('falls back to OpenAI when vendor is unknown', () => {
        expect(getVoicesForRealtimeModel('custom-model')).toContain('alloy')
    })
})

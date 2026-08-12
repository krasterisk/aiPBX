import { shouldSkipPlaygroundRawEvent } from './playgroundEventFilter'

describe('shouldSkipPlaygroundRawEvent', () => {
    it('skips raw PCM audio deltas (delivered via playground.audio_out)', () => {
        expect(shouldSkipPlaygroundRawEvent({ type: 'response.audio.delta' })).toBe(true)
        expect(shouldSkipPlaygroundRawEvent({ type: 'response.output_audio.delta' })).toBe(true)
    })

    it('keeps transcript and session events for the processor / Events panel', () => {
        expect(shouldSkipPlaygroundRawEvent({ type: 'response.output_audio_transcript.delta' })).toBe(false)
        expect(shouldSkipPlaygroundRawEvent({ type: 'response.done' })).toBe(false)
        expect(shouldSkipPlaygroundRawEvent({ type: 'error' })).toBe(false)
        expect(shouldSkipPlaygroundRawEvent({})).toBe(false)
        expect(shouldSkipPlaygroundRawEvent(null)).toBe(false)
    })
})

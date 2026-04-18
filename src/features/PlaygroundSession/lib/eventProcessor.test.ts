import { createInitialProcessorState, processEvent } from './eventProcessor'
import { PlaygroundEvent } from '../model/types/playgroundEvent'

function createEvent(props: Partial<PlaygroundEvent>): PlaygroundEvent {
    return {
        _raw: {},
        ...props
    } as PlaygroundEvent;
}

describe('eventProcessor', () => {
    it('should initialize with correct default state', () => {
        const state = createInitialProcessorState()
        expect(state.transcript).toEqual([])
        expect(state.vadState).toBe('idle')
    })

    it('should create a user transcript item on conversation.item.input_audio_transcription.completed', () => {
        let state = createInitialProcessorState()
        state = processEvent(state, createEvent({
            type: 'conversation.item.input_audio_transcription.completed',
            timestamp: 1000,
            item_id: 'item-1',
            transcript: 'Hello world',
        }))

        expect(state.transcript).toHaveLength(1)
        expect(state.transcript[0].id).toBe('item-1')
        expect(state.transcript[0].role).toBe('user')
        expect(state.transcript[0].text).toBe('Hello world')
        expect(state.transcript[0].isStreaming).toBe(false)
    })

    it('should create an assistant item on response.output_item.added and not duplicate it', () => {
        let state = createInitialProcessorState()
        const event1 = createEvent({
            type: 'response.output_item.added',
            timestamp: 1000,
            item: { id: 'item-2', type: 'message' } as any,
        })

        state = processEvent(state, event1)
        expect(state.transcript).toHaveLength(1)
        expect(state.transcript[0].id).toBe('item-2')
        expect(state.transcript[0].role).toBe('assistant')

        // Fire again with same ID
        state = processEvent(state, event1)
        expect(state.transcript).toHaveLength(1) // Should not duplicate
    })

    it('should append text correctly on response.audio_transcript.delta', () => {
        let state = createInitialProcessorState()
        
        state = processEvent(state, createEvent({
            type: 'response.output_item.added',
            timestamp: 1000,
            item: { id: 'item-3', type: 'message' } as any,
        }))

        state = processEvent(state, createEvent({
            type: 'response.audio_transcript.delta',
            timestamp: 1001,
            item_id: 'item-3',
            delta: 'Hello ',
        }))

        expect(state.transcript[0].text).toBe('Hello ')
        expect(state.transcript[0].isStreaming).toBe(true)

        state = processEvent(state, createEvent({
            type: 'response.audio_transcript.delta',
            timestamp: 1002,
            item_id: 'item-3',
            delta: 'there',
        }))

        expect(state.transcript[0].text).toBe('Hello there')
        expect(state.transcript[0].isStreaming).toBe(true)
    })

    it('should forcefully clear isStreaming flag on response.done', () => {
        let state = createInitialProcessorState()
        
        state = processEvent(state, createEvent({
            type: 'response.output_item.added',
            timestamp: 1000,
            item: { id: 'item-4', type: 'message' } as any,
        }))
        
        expect(state.transcript[0].isStreaming).toBe(true)

        state = processEvent(state, createEvent({
            type: 'response.done',
            timestamp: 1005,
        }))

        expect(state.transcript[0].isStreaming).toBe(false)
        expect(state.vadState).toBe('idle')
    })

    it('should handle response.content_part.done fallback text update', () => {
        let state = createInitialProcessorState()
        state = processEvent(state, createEvent({
            type: 'response.output_item.added',
            timestamp: 1000,
            item: { id: 'item-5', type: 'message' } as any,
        }))

        state = processEvent(state, createEvent({
            type: 'response.content_part.done' as any,
            timestamp: 1001,
            item_id: 'item-5',
            _raw: {
                part: { transcript: 'Full text via fallback' },
            },
        }))

        expect(state.transcript[0].text).toBe('Full text via fallback')
    })

    it('should correctly process function call arguments delta and completion', () => {
        let state = createInitialProcessorState()
        
        state = processEvent(state, createEvent({
            type: 'response.output_item.added',
            timestamp: 1000,
            item: { id: 'func-1', type: 'function_call', name: 'get_weather', call_id: 'call_123' } as any,
        }))

        expect(state.transcript[0].role).toBe('function')
        expect(state.transcript[0].functionName).toBe('get_weather')

        state = processEvent(state, createEvent({
            type: 'response.function_call_arguments.delta',
            timestamp: 1001,
            item_id: 'func-1',
            delta: '{"loc"',
        }))

        state = processEvent(state, createEvent({
            type: 'response.function_call_arguments.delta',
            timestamp: 1002,
            item_id: 'func-1',
            delta: ':"Paris"}',
        }))

        expect(state.transcript[0].functionArgs).toBe('{"loc":"Paris"}')
        expect(state.transcript[0].isStreaming).toBe(true)

        state = processEvent(state, createEvent({
            type: 'response.function_call_arguments.done',
            timestamp: 1003,
            item_id: 'func-1',
            name: 'get_weather',
        }))

        expect(state.transcript[0].isStreaming).toBe(false)
        expect(state.metrics.functionCallCount).toBe(1)
    })
})

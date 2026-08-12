/** Raw PCM audio deltas are delivered via playground.audio_out; skip them in the event log. */
export function shouldSkipPlaygroundRawEvent (event: { type?: string } | null | undefined): boolean {
    const type = event?.type
    return type === 'response.audio.delta' || type === 'response.output_audio.delta'
}

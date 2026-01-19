export const AUDIO_WORKLET_CODE = `
class AudioInputProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048; // ~256ms at 8kHz, or adjust for lower latency (e.g. 512 for 64ms)
    // 8000Hz * 0.040s (40ms) = 320 samples.
    // Let's settle on a chunk size that represents roughly 40-50ms.
    // 512 samples @ 8000Hz = 64ms.
    this.bufferSize = 512; 
    this.buffer = new Int16Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    
    const inputChannel = input[0];
    
    // The AudioContext is expected to be running at 8000Hz (or browser handles resampling).
    // We just convert Float32 to Int16.

    for (let i = 0; i < inputChannel.length; i++) {
        // Convert Float32 to Int16
        const s = Math.max(-1, Math.min(1, inputChannel[i]));
        const val = s < 0 ? s * 0x8000 : s * 0x7FFF;
        
        this.buffer[this.bufferIndex++] = val;

        if (this.bufferIndex >= this.bufferSize) {
            this.port.postMessage(this.buffer.slice());
            this.bufferIndex = 0;
        }
    }

    return true;
  }
}

registerProcessor('audio-input-processor', AudioInputProcessor);
`;

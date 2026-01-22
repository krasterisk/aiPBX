export const AUDIO_WORKLET_CODE = `
class AudioInputProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    
    // Get processor options for resampling
    const processorOptions = options.processorOptions || {};
    this.targetSampleRate = processorOptions.targetSampleRate || 24000;  // OpenAI expects 24kHz
    this.sourceSampleRate = processorOptions.sourceSampleRate || 48000;  // Native device rate
    
    // Calculate resampling ratio
    this.resampleRatio = this.sourceSampleRate / this.targetSampleRate;
    
    console.log(\`[AudioWorklet] Resampling: \${this.sourceSampleRate}Hz -> \${this.targetSampleRate}Hz (ratio: \${this.resampleRatio})\`);
    
    // Buffer for output (target rate)
    // 512 samples @ 24kHz ≈ 21ms chunks
    this.bufferSize = 512;
    this.buffer = new Int16Array(this.bufferSize);
    this.bufferIndex = 0;
    
    // For resampling: track position in source stream
    this.sourcePosition = 0.0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    
    const inputChannel = input[0];
    
    // If no resampling needed (rare case where rates match)
    if (Math.abs(this.resampleRatio - 1.0) < 0.01) {
      // Direct conversion Float32 -> Int16
      for (let i = 0; i < inputChannel.length; i++) {
        const s = Math.max(-1, Math.min(1, inputChannel[i]));
        const val = s < 0 ? s * 0x8000 : s * 0x7FFF;
        
        this.buffer[this.bufferIndex++] = val;

        if (this.bufferIndex >= this.bufferSize) {
          this.port.postMessage({ buffer: this.buffer.slice() });
          this.bufferIndex = 0;
        }
      }
    } else {
      // Resample using linear interpolation
      while (this.sourcePosition < inputChannel.length) {
        const sourceIndex = Math.floor(this.sourcePosition);
        const sourceFraction = this.sourcePosition - sourceIndex;
        
        // Linear interpolation between samples
        let sample;
        if (sourceIndex + 1 < inputChannel.length) {
          sample = inputChannel[sourceIndex] * (1 - sourceFraction) + 
                   inputChannel[sourceIndex + 1] * sourceFraction;
        } else {
          sample = inputChannel[sourceIndex];
        }
        
        // Clamp and convert to Int16
        const s = Math.max(-1, Math.min(1, sample));
        const val = s < 0 ? s * 0x8000 : s * 0x7FFF;
        
        this.buffer[this.bufferIndex++] = val;

        if (this.bufferIndex >= this.bufferSize) {
          this.port.postMessage({ buffer: this.buffer.slice() });
          this.bufferIndex = 0;
        }
        
        // Advance by resampling ratio
        this.sourcePosition += this.resampleRatio;
      }
      
      // Reset position for next processing block
      this.sourcePosition -= inputChannel.length;
    }

    return true;
  }
}

registerProcessor('audio-input-processor', AudioInputProcessor);
`;

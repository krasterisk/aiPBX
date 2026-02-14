import { Assistant } from '../types/assistants'

export const initAssistant: Assistant = {
  id: '',
  model: 'gpt-realtime-mini',
  voice: 'alloy',
  name: '',
  instruction: '',
  temperature: '0.8',
  input_audio_format: 'g711_alaw',
  output_audio_format: 'g711_alaw',
  input_audio_transcription_model: 'whisper-1',
  input_audio_transcription_language: 'ru',
  turn_detection_type: 'server_vad',
  turn_detection_threshold: '0.5',
  turn_detection_prefix_padding_ms: '500',
  turn_detection_silence_duration_ms: '1000',
  max_response_output_tokens: 'inf',
  idle_timeout_ms: '10000',
  tools: [],
  analytic: true,
  allowHangup: false,
  allowTransfer: false,
  comment: '',
  userId: '',
  user: {
    id: '',
    username: ''
  }
}

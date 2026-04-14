export interface ProviderOption {
  value: string
  label: string
}

export interface LlmProviderOption extends ProviderOption {
  models: ProviderOption[]
  freeText?: boolean
}

export interface TtsProviderOption extends ProviderOption {
  voices: ProviderOption[]
  supportsCustomUpload?: boolean
}

export const STT_PROVIDERS: ProviderOption[] = [
  { value: 'whisper-local', label: 'Whisper (Local GPU)' },
  { value: 'vosk', label: 'Vosk (Local CPU)' },
  { value: 'whisper-api', label: 'OpenAI Whisper API' },
  { value: 'yandex-stt', label: 'Yandex SpeechKit STT' },
]

export const LLM_PROVIDERS: LlmProviderOption[] = [
  {
    value: 'openai',
    label: 'OpenAI',
    models: [
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
      { value: 'gpt-4.1', label: 'GPT-4.1' },
    ],
  },
  {
    value: 'yandex',
    label: 'YandexGPT',
    models: [
      { value: 'yandexgpt-lite', label: 'YandexGPT Lite' },
      { value: 'yandexgpt', label: 'YandexGPT' },
    ],
  },
  {
    value: 'ollama',
    label: 'Ollama (Local)',
    models: [],
    freeText: true,
  },
  {
    value: 'gemma4-audio',
    label: 'Gemma 4 (Audio Native)',
    models: [
      { value: 'gemma4:e4b', label: 'Gemma 4 (e4b)' }
    ],
    freeText: true,
  },
]

export const TTS_PROVIDERS: TtsProviderOption[] = [
  {
    value: 'silero',
    label: 'Silero (Local)',
    voices: [
      { value: 'baya', label: 'Baya · ♀' },
      { value: 'kseniya', label: 'Kseniya · ♀' },
      { value: 'xenia', label: 'Xenia · ♀' },
      { value: 'aidar', label: 'Aidar · ♂' },
      { value: 'eugene', label: 'Eugene · ♂' },
      { value: 'random', label: 'Random' },
      { value: 'en_0', label: 'EN — Female 1' },
      { value: 'en_21', label: 'EN — Female 2' },
      { value: 'en_45', label: 'EN — Female 3' },
      { value: 'en_18', label: 'EN — Male 1' },
      { value: 'en_56', label: 'EN — Male 2' },
      { value: 'en_99', label: 'EN — Male 3' },
    ],
  },
  {
    value: 'openai-tts',
    label: 'OpenAI TTS',
    voices: [
      { value: 'alloy', label: 'Alloy' },
      { value: 'ash', label: 'Ash' },
      { value: 'coral', label: 'Coral' },
      { value: 'echo', label: 'Echo' },
      { value: 'fable', label: 'Fable' },
      { value: 'nova', label: 'Nova' },
      { value: 'onyx', label: 'Onyx' },
      { value: 'sage', label: 'Sage' },
      { value: 'shimmer', label: 'Shimmer' },
    ],
  },
  {
    value: 'yandex-tts',
    label: 'Yandex SpeechKit',
    voices: [
      { value: 'alena', label: 'Alena' },
      { value: 'filipp', label: 'Filipp' },
      { value: 'ermil', label: 'Ermil' },
      { value: 'jane', label: 'Jane' },
      { value: 'madirus', label: 'Madirus' },
      { value: 'omazh', label: 'Omazh' },
      { value: 'zahar', label: 'Zahar' },
    ],
  },
  {
    value: 'omnivoice',
    label: 'OmniVoice (Zero-shot, GPU)',
    voices: [
      { value: 'default', label: 'По умолчанию (Базовый русский голос)' }
    ],
    supportsCustomUpload: true,
  },
]

export const NON_REALTIME_DEFAULTS = {
  sttProvider: 'whisper-local',
  llmProvider: 'gemma4-audio',
  llmModel: 'gemma4:e4b',
  ttsProvider: 'omnivoice',
  ttsVoice: 'default',
}

export const getLlmModels = (provider: string): ProviderOption[] => {
  const found = LLM_PROVIDERS.find(p => p.value === provider)
  return found?.models ?? []
}

export const isLlmFreeText = (provider: string): boolean => {
  const found = LLM_PROVIDERS.find(p => p.value === provider)
  return found?.freeText ?? false
}

export const getTtsVoices = (provider: string): ProviderOption[] => {
  const found = TTS_PROVIDERS.find(p => p.value === provider)
  return found?.voices ?? []
}

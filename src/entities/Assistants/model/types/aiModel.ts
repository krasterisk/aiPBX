export interface AiModel {
  id: string
  name: string
  publish?: boolean
  publishName?: string
  comment?: string
  realtimeVendor?: 'openai' | 'yandex' | 'qwen' | null
  wireModelId?: string | null
}

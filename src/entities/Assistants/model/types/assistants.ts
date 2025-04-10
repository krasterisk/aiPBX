import { User } from '../../../User'
import { HTMLAttributeAnchorTarget } from 'react'
import { ContentView } from '@/entities/Content'

export interface AllAssistants {
  count: number
  rows: Assistant[]
}

export interface Assistant {
  id?: string
  name?: string
  instruction?: string
  voice?: string
  input_audio_format?: string
  output_audio_format?: string
  input_audio_transcription_model?: string
  input_audio_transcription_language?: string
  turn_detection_type?: string
  turn_detection_threshold?: string
  turn_detection_prefix_padding_ms?: string
  turn_detection_silence_duration_ms?: string
  semantic_eagerness?: string
  temperature?: string
  tools?: string
  user?: User
  userId?: string
  comment?: string
}

export interface AssistantsListProps {
  className?: string
  target?: HTMLAttributeAnchorTarget
  isAssistantsLoading?: boolean
  isAssistantsError?: boolean
  view?: ContentView
  assistants?: AllAssistants
  onDelete?: (id: string) => void
}

export interface ChartData {
  label?: string[]
  resCount?: number[]
  issueCount?: number[]
}

import { User } from '../../../User'
import { HTMLAttributeAnchorTarget } from 'react'
import { ContentView } from '@/entities/Content'
import { Tool } from '@/entities/Tools'

export interface AllAssistants {
  count: number
  rows: Assistant[]
}

export interface AssistantOptions {
  id: string
  name: string
}

export interface AssistantSipAccount {
  id: string
  sipUri: string
  ipAddress: string
  pbxId: string
}

export interface Assistant {
  id?: string
  name?: string
  uniqueId?: string
  greeting?: string
  model?: string
  instruction?: string
  voice?: string
  input_audio_format?: string
  output_audio_format?: string
  input_audio_noise_reduction?: string
  input_audio_transcription_model?: string
  input_audio_transcription_language?: string
  output_audio_transcription_model?: string
  turn_detection_type?: string
  turn_detection_threshold?: string
  turn_detection_prefix_padding_ms?: string
  turn_detection_silence_duration_ms?: string
  idle_timeout_ms?: string
  semantic_eagerness?: string
  temperature?: string
  max_response_output_tokens?: string
  tools?: Tool[]
  user?: User
  userId?: string
  sipAccount?: AssistantSipAccount
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

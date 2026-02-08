import { User } from '../../../User'
import { HTMLAttributeAnchorTarget } from 'react'
import { Tool } from '@/entities/Tools'

export interface AllAssistants {
  count: number
  rows: Assistant[]
}

export interface AssistantOptions {
  id: string
  name: string
  uniqueId?: string
  userId?: string
}

export interface AssistantSipAccount {
  id: string
  sipUri: string
  ipAddress: string
  pbxId: string
  records?: boolean
  tls?: boolean
  active?: boolean
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
  analytic?: boolean
}

export interface AssistantsListProps {
  className?: string
  target?: HTMLAttributeAnchorTarget
  isAssistantsLoading?: boolean
  isAssistantsError?: boolean
  assistants?: AllAssistants
  onDelete?: (id: string) => void
}

export interface ChartData {
  label?: string[]
  resCount?: number[]
  issueCount?: number[]
}

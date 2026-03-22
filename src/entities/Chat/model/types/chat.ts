import { Tool } from '@/entities/Tools'

export interface Chat {
  id: number
  name: string
  instruction: string | null
  model: string
  temperature: string
  userId: number
  tools: Tool[]
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  toolCalls?: ChatToolCall[]
}

export interface ChatToolCall {
  name: string
  status: 'calling' | 'done'
  result?: string
}

export interface SendMessageRequest {
  message: string
  history: ChatMessage[]
}

export interface CreateChatDto {
  name: string
  instruction?: string
  model?: string
  temperature?: string
  toolIds?: string[]
}

export interface UpdateChatDto {
  name?: string
  instruction?: string
  model?: string
  temperature?: string
  toolIds?: string[]
}

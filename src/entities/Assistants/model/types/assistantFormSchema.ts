import { Assistant } from './assistants'

export interface AssistantFormSchema {
  data: Assistant | null
  initialData?: Assistant
  mode: 'create' | 'edit'
  isLoading: boolean
  error?: string
}

import { KnowledgeBase } from './knowledgeBase'

export interface KnowledgeBasesPageSchema {
  _inited: boolean
  search: string
  isFormOpen: boolean
  editingKb: KnowledgeBase | null
}

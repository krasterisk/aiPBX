export interface KnowledgeBase {
  id: number
  name: string
  description: string | null
  documentsCount: number
  chunksCount: number
  status: string
  userId: number
  createdAt: string
  updatedAt: string
}

export interface KnowledgeDocument {
  id: number
  knowledgeBaseId: number
  fileName: string
  fileType: string
  fileSize: number | null
  sourceUrl: string | null
  chunksCount: number
  status: string
  errorMessage: string | null
  userId: number
  createdAt: string
}

export interface SearchResult {
  content: string
  similarity: number
  metadata: Record<string, any>
  documentId: number
}

import { rtkApi } from '@/shared/api/rtkApi'
import { KnowledgeBase, KnowledgeDocument, SearchResult } from '../model/types/knowledgeBase'

export const knowledgeBaseApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getKnowledgeBases: build.query<KnowledgeBase[], void>({
      query: () => '/knowledge-bases',
      providesTags: (result) =>
        result?.length
          ? [
            ...result.map(({ id }) => ({ type: 'KnowledgeBases' as const, id })),
            { type: 'KnowledgeBases', id: 'LIST' }
          ]
          : [{ type: 'KnowledgeBases', id: 'LIST' }]
    }),
    createKnowledgeBase: build.mutation<KnowledgeBase, { name: string, description?: string }>({
      query: (body) => ({
        url: '/knowledge-bases',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'KnowledgeBases', id: 'LIST' }]
    }),
    updateKnowledgeBase: build.mutation<KnowledgeBase, { id: number, name?: string, description?: string }>({
      query: ({ id, ...body }) => ({
        url: `/knowledge-bases/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: [{ type: 'KnowledgeBases', id: 'LIST' }]
    }),
    deleteKnowledgeBase: build.mutation<void, number>({
      query: (id) => ({
        url: `/knowledge-bases/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'KnowledgeBases', id: 'LIST' }]
    }),
    getDocuments: build.query<KnowledgeDocument[], number>({
      query: (kbId) => `/knowledge-bases/${kbId}/documents`,
      providesTags: (result) =>
        result?.length
          ? [
            ...result.map(({ id }) => ({ type: 'KnowledgeDocuments' as const, id })),
            { type: 'KnowledgeDocuments', id: 'LIST' }
          ]
          : [{ type: 'KnowledgeDocuments', id: 'LIST' }]
    }),
    uploadDocument: build.mutation<KnowledgeDocument, { kbId: number, file: File }>({
      query: ({ kbId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: `/knowledge-bases/${kbId}/upload`,
          method: 'POST',
          body: formData
        }
      },
      invalidatesTags: [
        { type: 'KnowledgeDocuments', id: 'LIST' },
        { type: 'KnowledgeBases', id: 'LIST' }
      ]
    }),
    addUrl: build.mutation<KnowledgeDocument, { kbId: number, url: string }>({
      query: ({ kbId, url }) => ({
        url: `/knowledge-bases/${kbId}/url`,
        method: 'POST',
        body: { url }
      }),
      invalidatesTags: [
        { type: 'KnowledgeDocuments', id: 'LIST' },
        { type: 'KnowledgeBases', id: 'LIST' }
      ]
    }),
    deleteDocument: build.mutation<void, { kbId: number, docId: number }>({
      query: ({ kbId, docId }) => ({
        url: `/knowledge-bases/${kbId}/documents/${docId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [
        { type: 'KnowledgeDocuments', id: 'LIST' },
        { type: 'KnowledgeBases', id: 'LIST' }
      ]
    }),
    searchKnowledgeBase: build.query<SearchResult[], { kbId: number, query: string, limit?: number }>({
      query: ({ kbId, query, limit }) =>
        `/knowledge-bases/${kbId}/search?q=${encodeURIComponent(query)}&limit=${limit || 5}`
    })
  })
})

export const useKnowledgeBases = knowledgeBaseApi.useGetKnowledgeBasesQuery
export const useCreateKnowledgeBase = knowledgeBaseApi.useCreateKnowledgeBaseMutation
export const useUpdateKnowledgeBase = knowledgeBaseApi.useUpdateKnowledgeBaseMutation
export const useDeleteKnowledgeBase = knowledgeBaseApi.useDeleteKnowledgeBaseMutation
export const useDocuments = knowledgeBaseApi.useGetDocumentsQuery
export const useUploadDocument = knowledgeBaseApi.useUploadDocumentMutation
export const useAddUrl = knowledgeBaseApi.useAddUrlMutation
export const useDeleteDocument = knowledgeBaseApi.useDeleteDocumentMutation
export const useLazySearchKnowledgeBase = knowledgeBaseApi.useLazySearchKnowledgeBaseQuery

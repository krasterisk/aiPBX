import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'

// Define a services using a base URL and expected endpoints
export const rtkApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery(
    {
      baseUrl: __API__,
      prepareHeaders: headers => {
        const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY)
        if (token) {
          headers.set('Authorization', 'Bearer ' + token)
        }
        return headers
      }
    }),
  tagTypes: [
    'Users',
    'Assistants',
    'AiModels',
    'Tools',
    'Reports',
    'PbxServers',
    'Organization',
    'WidgetKeys',
    'Prices',
    'AIAnalytics',
    'McpServers',
    'McpTools',
    'ComposioConnections',
    'ComposioActions',
    'OperatorAnalytics',
    'OperatorProjects',
    'OperatorApiTokens'
  ],
  endpoints: (builder) => ({})
})

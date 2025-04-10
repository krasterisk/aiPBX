export { AssistantsList } from './ui/AssistantsList/AssistantsList'
export { useAssistantFilters } from './lib/hooks/useAssistantFilters'

export { ModelSelect } from './ui/ModelSelect/ModelSelect'
export { VoiceSelect } from './ui/VoiceSelect/VoiceSelect'

export {
  assistantsPageActions,
  assistantsPageReducer
} from './model/slices/assistantsPageSlice'

export {
  getAssistantsPageNum,
  getAssistantsHasMore,
  getAssistantsInited,
  getAssistantsPageLimit,
  getAssistantsPageSearch,
  getAssistantsPageView,
  getAssistantsUserId,
  getAssistantsUser
} from './model/selectors/assistantsPageSelectors'

export { initAssistantsPage } from './model/service/initAssistantsPage/initAssistantsPage'

export type { AssistantsPageSchema } from './model/types/assistantsPageSchema'
export type { Assistant, AllAssistants, AssistantsListProps } from './model/types/assistants'

export {
  assistantsApi,
  useDeleteAssistant,
  useAssistantsAll,
  useAssistants,
  useAssistant,
  useSetAssistants,
  useUpdateAssistant
} from './api/assistantsApi'

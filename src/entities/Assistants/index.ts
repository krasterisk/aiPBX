export { AssistantsList } from './ui/AssistantsList/AssistantsList'
export { useAssistantFilters } from './lib/hooks/useAssistantFilters'
export { ModelSelect } from './ui/ModelSelect/ModelSelect'
export { VoiceSelect } from './ui/VoiceSelect/VoiceSelect'
export { AssistantSelect } from './ui/AssistantSelect/AssistantSelect'

export {
  assistantsPageActions,
  assistantsPageReducer
} from './model/slices/assistantsPageSlice'

export {
  assistantFormActions,
  assistantFormReducer
} from './model/slices/assistantFormSlice'

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

export {
  getAssistantFormData,
  getAssistantFormMode
} from './model/selectors/assistantFormSelectors'

export { initAssistantsPage } from './model/service/initAssistantsPage/initAssistantsPage'

export type { AssistantsPageSchema } from './model/types/assistantsPageSchema'
export type { AssistantFormSchema } from './model/types/assistantFormSchema'
export type { Assistant, AllAssistants, AssistantsListProps, AssistantOptions } from './model/types/assistants'
export { initAssistant } from './model/const/initAssistant'

export {
  assistantsApi,
  useDeleteAssistant,
  useAssistantsAll,
  useAssistants,
  useAssistant,
  useSetAssistants,
  useUpdateAssistant
} from './api/assistantsApi'

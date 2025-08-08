export { AssistantsList } from './ui/AssistantsList/AssistantsList'
export { AssistantOptionsMain } from './ui/AssistantOptionsMain/AssistantOptionsMain'
export { AssistantOptionsPrompts } from './ui/AssistantOptionsPrompts/AssistantOptionsPrompts'
export { AssistantOptionsModel } from './ui/AssistantOptionsModel/AssistantOptionsModel'
export { useAssistantFilters } from './lib/hooks/useAssistantFilters'

export { ModelSelect } from './ui/ModelSelect/ModelSelect'
export { VoiceSelect } from './ui/VoiceSelect/VoiceSelect'
export { AssistantSelect } from './ui/AssistantSelect/AssistantSelect'

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
  getAssistantsUser,
  getAssistantsCreateFormFields,
  getAssistantsEditFormFields,
  initAssistant
} from './model/selectors/assistantsPageSelectors'

export { initAssistantsPage } from './model/service/initAssistantsPage/initAssistantsPage'

export type { AssistantsPageSchema } from './model/types/assistantsPageSchema'
export type { Assistant, AllAssistants, AssistantsListProps, AssistantOptions } from './model/types/assistants'

export {
  assistantsApi,
  useDeleteAssistant,
  useAssistantsAll,
  useAssistants,
  useAssistant,
  useSetAssistants,
  useUpdateAssistant
} from './api/assistantsApi'

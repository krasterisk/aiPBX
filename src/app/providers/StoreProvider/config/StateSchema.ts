import { UserSchema, UsersPageSchema } from '@/entities/User'
import { AnyAction, CombinedState, EnhancedStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit'
import { AxiosInstance } from 'axios'
import { ScrollSaveSchema } from '@/features/ScrollSave'
import { rtkApi } from '@/shared/api/rtkApi'
import { AssistantFormSchema, AssistantsPageSchema } from '@/entities/Assistants'
import { ToolsPageSchema } from '@/entities/Tools'
import { ReportsPageSchema } from '@/entities/Report'
import { DashboardPageSchema } from '@/widgets/Dashboard'
import { LoginSchema, SignupSchema } from '@/features/Auth'
import { PbxServersPageSchema } from '@/entities/PbxServers'
import { PlaygroundAssistantFormSchema } from '@/pages/Playground'
import { PublishSipUrisFormSchema, PublishSipUrisPageSchema } from '@/features/PublishSipUris'
import { PublishWidgetsFormSchema } from '@/features/PublishWidgets'
import { PublishWidgetsPageSchema } from '@/entities/PublishWidgets'

export interface StateSchema {
  user: UserSchema
  saveScroll: ScrollSaveSchema
  playgroundAssistantForm: PlaygroundAssistantFormSchema
  [rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>

  // Async reducers
  loginForm?: LoginSchema
  signupForm?: SignupSchema
  usersPage?: UsersPageSchema
  assistantsPage?: AssistantsPageSchema
  assistantForm?: AssistantFormSchema
  toolsPage?: ToolsPageSchema
  reportsPage?: ReportsPageSchema
  dashboardPage?: DashboardPageSchema
  pbxServersPage?: PbxServersPageSchema
  publishSipUrisForm?: PublishSipUrisFormSchema
  publishSipUrisPage?: PublishSipUrisPageSchema
  publishWidgetsForm?: PublishWidgetsFormSchema
  publishWidgetsPage?: PublishWidgetsPageSchema
}

export type StateSchemaKey = keyof StateSchema

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>
  reduce: (state: StateSchema, action: AnyAction) => CombinedState<StateSchema>
  add: (key: StateSchemaKey, reducer: Reducer) => void
  remove: (key: StateSchemaKey, reducer: (state: any, action: AnyAction) => any) => void
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager
}

export interface ThunkExtraArg {
  api: AxiosInstance
}

export interface ThunkConfig<T> {
  rejectValue: T
  extra: ThunkExtraArg
  state: StateSchema
}

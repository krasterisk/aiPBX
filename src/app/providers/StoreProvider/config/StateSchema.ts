import { UserSchema, UsersPageSchema } from '@/entities/User'
import { LoginSchema } from '@/features/AuthByUsername'
import { AnyAction, CombinedState, EnhancedStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit'
import { AxiosInstance } from 'axios'
import { ScrollSaveSchema } from '@/features/ScrollSave'
import { rtkApi } from '@/shared/api/rtkApi'
import { AssistantsPageSchema } from '@/entities/Assistants'
import { ToolsPageSchema } from '@/entities/Tools'
import { ReportsPageSchema } from '@/entities/Report'
import { DashboardPageSchema } from '@/widgets/Dashboard'

export interface StateSchema {
  user: UserSchema
  saveScroll: ScrollSaveSchema
  [rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>

  // Async reducers
  loginForm?: LoginSchema
  usersPage?: UsersPageSchema
  assistantsPage?: AssistantsPageSchema
  toolsPage?: ToolsPageSchema
  reportsPage?: ReportsPageSchema
  dashboardPage?: DashboardPageSchema

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

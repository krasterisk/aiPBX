import { CounterSchema } from '@/entities/Counter'
import { UserSchema } from '@/entities/User'
import { LoginSchema } from '@/features/AuthByUsername'
import { AnyAction, CombinedState, EnhancedStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit'
import { ProfileSchema } from '@/features/EditableProfileCard'
import { AxiosInstance } from 'axios'
import { ManualDetailsSchema } from '@/entities/Manual'
import { AddCommentFormSchema } from '@/features/AddCommentForm'
import { ManualsPageSchema } from '@/pages/ManualsPage'
import { ScrollSaveSchema } from '@/features/ScrollSave'
import { ManualDetailsPageSchema } from '@/pages/ManualDetailsPage'
import { rtkApi } from '@/shared/api/rtkApi'
import { ContextsPageSchema, EndpointsPageSchema, EndpointGroupsPageSchema, ProvisioningPageSchema } from '@/pages/pbx'

export interface StateSchema {
  counter: CounterSchema
  user: UserSchema
  saveScroll: ScrollSaveSchema
  [rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>

  // Async reducers
  loginForm?: LoginSchema
  profileForm: ProfileSchema
  manualDetails?: ManualDetailsSchema
  addCommentForm?: AddCommentFormSchema
  manualsPage?: ManualsPageSchema
  manualDetailsPage?: ManualDetailsPageSchema
  endpointsPage?: EndpointsPageSchema
  contextsPage?: ContextsPageSchema
  endpointGroupsPage?: EndpointGroupsPageSchema
  provisioningPage?: ProvisioningPageSchema
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

import { CombinedState, configureStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit'
import { StateSchema, ThunkExtraArg } from './StateSchema'
import { userReducer } from '@/entities/User'
import { createReducerManager } from './reducerManager'
import { $api } from '@/shared/api/api'
import { scrollSaveReducer } from '@/features/ScrollSave'
import { rtkApi } from '@/shared/api/rtkApi'
import { setupListeners } from '@reduxjs/toolkit/query'

export function createReduxStore (
  initialState?: StateSchema,
  asyncReducers?: ReducersMapObject<StateSchema>
) {
  const rootReducers: ReducersMapObject<StateSchema> = {
    ...asyncReducers,
    user: userReducer,
    saveScroll: scrollSaveReducer,
    [rtkApi.reducerPath]: rtkApi.reducer
  }

  const reducerManager = createReducerManager(rootReducers)

  const extraArg: ThunkExtraArg = {
    api: $api
  }

  const store = configureStore({
    reducer: reducerManager.reduce as Reducer<CombinedState<StateSchema>>,
    devTools: __IS_DEV__,
    preloadedState: initialState,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      thunk: {
        extraArgument: extraArg
      }
    }).concat(rtkApi.middleware)
  })

  // enable listener behavior for the store
  setupListeners(store.dispatch)

  // @ts-expect-error
  store.reducerManager = reducerManager

  return store
}

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch']

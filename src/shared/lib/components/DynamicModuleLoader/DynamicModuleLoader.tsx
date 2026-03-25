import { ReactNode, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { ReduxStoreWithManager, StateSchema, StateSchemaKey } from '@/app/providers/StoreProvider'
import { Reducer } from '@reduxjs/toolkit'

export type ReducersList = {
  [name in StateSchemaKey]?: Reducer<NonNullable<StateSchema[name]>>
}

interface DynamicModuleLoaderProps {
  reducers: ReducersList
  removeAfterUnmount?: boolean
  children: ReactNode
}

export const DynamicModuleLoader = (props: DynamicModuleLoaderProps) => {
  const {
    children,
    reducers,
    removeAfterUnmount = true
  } = props
  const store = useStore() as ReduxStoreWithManager
  const dispatch = useDispatch()

  // Register reducers SYNCHRONOUSLY so they exist before children render/fire effects.
  // This prevents a race condition where child useEffects (e.g. initForm) dispatch
  // actions before the reducer is added to the store.
  // reducerManager.add() is idempotent — it no-ops if the reducer already exists.
  const mountedReducers = store.reducerManager.getReducerMap()
  Object.entries(reducers).forEach(([name, reducer]) => {
    const mounted = mountedReducers[name as StateSchemaKey]
    if (!mounted) {
      store.reducerManager.add(name as StateSchemaKey, reducer)
      dispatch({ type: `@INIT ${name} reducer` })
    }
  })

  useEffect(() => {
    return () => {
      if (removeAfterUnmount) {
        Object.entries(reducers).forEach(([name, reducer]) => {
          store.reducerManager.remove(name as StateSchemaKey, reducer)
          dispatch({ type: `@DESTROY ${name} reducer` })
        })
      }
    }
  }, [dispatch, reducers, removeAfterUnmount, store.reducerManager])

  return (
        <>
            {children}
        </>
  )
}

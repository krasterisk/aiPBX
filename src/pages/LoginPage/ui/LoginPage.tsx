import React, { memo } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { Login } from '@/features/Login'
import { loginReducer } from '@/features/AuthByUsername'

const initialReducers: ReducersList = {
  loginForm: loginReducer
}

export const LoginPage = memo(() => {
  return (
      <DynamicModuleLoader reducers={initialReducers} removeAfterUnmount>
         <Login />
      </DynamicModuleLoader>
  )
})

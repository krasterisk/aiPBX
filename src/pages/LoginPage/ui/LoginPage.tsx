import React, { memo } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { Login, loginReducer } from '@/features/Auth'

const initialReducers: ReducersList = {
  loginForm: loginReducer
}

const LoginPage = memo(() => {
  return (
    <DynamicModuleLoader reducers={initialReducers} removeAfterUnmount>
      <Login />
    </DynamicModuleLoader>
  )
})

export default LoginPage

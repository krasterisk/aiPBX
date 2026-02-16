import React, { memo } from 'react'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'
import { Signup, signupReducer } from '@/features/Auth'

const initialReducers: ReducersList = {
  signupForm: signupReducer
}

const SignupPage = memo(() => {
  return (
    <DynamicModuleLoader reducers={initialReducers} removeAfterUnmount>
      <Signup />
    </DynamicModuleLoader>
  )
})

export default SignupPage

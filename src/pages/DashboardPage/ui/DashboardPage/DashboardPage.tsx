import { memo } from 'react'
import { Dashboard, dashboardPageReducer, initDashboardPage } from '@/widgets/Dashboard'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader'

const reducers: ReducersList = {
  dashboardPage: dashboardPageReducer
}

const DashboardPage = memo(() => {
  const dispatch = useAppDispatch()

  useInitialEffect(() => {
    dispatch(initDashboardPage())
  })

  return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={true}>
            <Dashboard />
        </DynamicModuleLoader>
  )
})

export default DashboardPage

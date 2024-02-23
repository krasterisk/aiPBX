import React, { Suspense, useEffect } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Navbar } from '@/widgets/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAuthData, getUserMounted, userActions } from '@/entities/User'
import { AppRouter } from './providers/router'
import { setFeatureFlags } from '@/shared/lib/features'
import { MainLayout } from '@/shared/layouts/MainLayout'
import { PageLoader } from '@/widgets/PageLoader'
import { getTokenAllData } from '@/app/providers/getTokenData/getTokenData'
import { useAppToolbar } from './lib/useAppToolbar'
import { Menubar } from '@/widgets/Menubar'

const App = (): any => {
  const dispatch = useDispatch()
  const mounted = useSelector(getUserMounted)
  const userData = useSelector(getUserAuthData)
  const authData = getTokenAllData(userData?.token)
  const redesigned = authData?.designed
  const toolbar = useAppToolbar()

  useEffect(() => {
    dispatch(userActions.initToken())
  }, [dispatch])

  setFeatureFlags({ isAppRedesigned: redesigned })

  if (!mounted) {
    return <PageLoader/>
  }

  return (
        <div id='app' className={classNames('app_redesigned', {}, [])}>
                          <Suspense>
                              <MainLayout
                                  header={<Navbar/>}
                                  content={<AppRouter/>}
                                  sidebar={<Menubar/>}
                                  toolbar={toolbar}
                              />
                          </Suspense>
                      </div>
  )
}

export default App

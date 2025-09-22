import React, { Suspense, useEffect } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Navbar } from '@/widgets/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAuthData, getUserMounted, useGetMe, userActions } from '@/entities/User'
import { AppRouter } from './providers/router'
import { setFeatureFlags } from '@/shared/lib/features'
import { MainLayout } from '@/shared/layouts/MainLayout'
import { PageLoader } from '@/widgets/PageLoader'
import { Menubar } from '@/widgets/Menubar'

const App = (): any => {
  const dispatch = useDispatch()
  const mounted = useSelector(getUserMounted)
  const userData = useSelector(getUserAuthData)
  const redesigned = userData?.designed
  // const toolbar = useAppToolbar()

  const { data: user } = useGetMe(null)

  useEffect(() => {
    dispatch(userActions.initAuth(user))
  }, [dispatch, user])

  setFeatureFlags({ isAppRedesigned: redesigned })

  if (!mounted) {
    return <PageLoader/>
  }

  return (
        <Suspense fallback={<PageLoader />}>
            {userData
              ? (
                <div id='app' className={classNames('app_redesigned', {}, [])}>
                    <MainLayout
                        header={<Navbar />}
                        content={<AppRouter />}
                        sidebar={<Menubar />}
                    />
                </div>
                )
              : (
                <AppRouter />
                )}
        </Suspense>
  )
}

export default App

import React, { Suspense } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Navbar } from '@/widgets/Navbar'
import { useSelector } from 'react-redux'
import { getUserAuthData, useGetMe } from '@/entities/User'
import { AppRouter } from './providers/router'
import { MainLayout } from '@/shared/layouts/MainLayout'
import { PageLoader } from '@/widgets/PageLoader'
import { Menubar } from '@/widgets/Menubar'

const App = (): any => {
  const userData = useSelector(getUserAuthData)
  // const toolbar = useAppToolbar()
  const { data: user, isLoading } = useGetMe(null)
  // setFeatureFlags({ isAppRedesigned: redesigned })

  if (isLoading) {
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

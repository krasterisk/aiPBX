import React, { Suspense } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Navbar } from '@/widgets/Navbar'
import { useSelector } from 'react-redux'
import { getUserAuthData, useGetMe } from '@/entities/User'
import { AppRouter } from './providers/router'
import { MainLayout } from '@/shared/layouts/MainLayout'
import { PageLoader } from '@/widgets/PageLoader'
import { Menubar } from '@/widgets/Menubar'
import { ToastContainer } from 'react-toastify'
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme'
import { Theme } from '@/shared/const/theme'

const App = (): any => {
  const userData = useSelector(getUserAuthData)
  // const toolbar = useAppToolbar()
  const { isLoading } = useGetMe(null)
  // setFeatureFlags({ isAppRedesigned: redesigned })

  const { theme } = useTheme()

  const mapThemeToToast = () => {
    switch (theme) {
      case Theme.DARK:
        return 'dark'
      case Theme.LIGHT:
        return 'light'
      case Theme.PURPLE:
        return 'colored' // или "light", если хочешь белый фон
      default:
        return 'light'
    }
  }

  if (isLoading) {
    return <PageLoader/>
  }

  return (
        <Suspense fallback={<PageLoader/>}>
            {userData
              ? (
                    <div id='app' className={classNames('app_redesigned', {}, [])}>

                        <MainLayout
                            header={<Navbar/>}
                            content={<AppRouter/>}
                            sidebar={<Menubar/>}
                        />
                    </div>
                )
              : (
                    <AppRouter/>
                )}
            <ToastContainer
                position="top-right"
                autoClose={3000} // 3 сек
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={mapThemeToToast()} // варианты: light, dark, colored
            />
        </Suspense>
  )
}

export default App

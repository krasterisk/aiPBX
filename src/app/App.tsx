import React, { Suspense, useEffect } from 'react'
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
import { useLocation } from 'react-router-dom'
import { getRouteDocs } from '@/shared/const/router'

import { OnboardingWizard } from '@/features/Onboarding'

const App = (): any => {
  const userData = useSelector(getUserAuthData)
  // const toolbar = useAppToolbar()
  const { isLoading } = useGetMe(null)
  // setFeatureFlags({ isAppRedesigned: redesigned })

  const { theme } = useTheme()
  const { pathname } = useLocation()
  const isDocsPage = pathname.startsWith(getRouteDocs())

  useEffect(() => {
    const ga4Id = typeof __GA4_MEASUREMENT_ID__ !== 'undefined' ? __GA4_MEASUREMENT_ID__ : ''
    if (!ga4Id || !window.gtag) {
      return
    }
    const siteUrl = typeof __SITE_URL__ !== 'undefined' ? __SITE_URL__ : ''
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_location: `${siteUrl}${pathname}`,
      page_title: document.title
    })
  }, [pathname])

  const mapThemeToToast = () => {
    switch (theme) {
      case Theme.DARK:
        return 'dark'
      case Theme.LIGHT:
        return 'light'
      default:
        return 'light'
    }
  }

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <div id='app' className={classNames('app_redesigned', {}, [])}>
        {(userData && !isDocsPage)
          ? (
            <>
              <MainLayout
                header={<Navbar />}
                content={<AppRouter />}
                sidebar={<Menubar />}
              />
              <OnboardingWizard />
            </>
          )
          : (
            <AppRouter />
          )}
      </div>
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

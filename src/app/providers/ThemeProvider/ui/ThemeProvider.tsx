import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from '../../../../shared/lib/context/ThemeContext'
import { Theme } from '@/shared/const/theme'
import { LOCAL_STORAGE_THEME_KEY } from '@/shared/const/localstorage'

const defaultTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme || Theme.LIGHT

export interface ThemeProviderProps {
  children: ReactNode
  initialTheme?: Theme
}

const ThemeProvider = (props: ThemeProviderProps) => {
  const {
    initialTheme,
    children
  } = props

  const [theme, setTheme] = useState<Theme>(initialTheme || defaultTheme)
  const [isThemeInited, setThemeInited] = useState(false)

  useEffect(() => {
    if (!isThemeInited && defaultTheme) {
      setTheme(defaultTheme)
      setThemeInited(true)
    }
  }, [isThemeInited])

  useEffect(() => {
    document.body.className = theme
  }, [theme])

  const defaultProps = useMemo(() => ({
    theme,
    setTheme
  }), [theme])

  document.body.className = theme

  return (
        <ThemeContext.Provider value={defaultProps}>
            {children}
        </ThemeContext.Provider>
  )
}

export default ThemeProvider

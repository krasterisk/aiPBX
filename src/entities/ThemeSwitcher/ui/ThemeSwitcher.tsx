import React, { memo } from 'react'
import { useTheme } from '@/shared/lib/hooks/useTheme/useTheme'
import { Theme } from '@/shared/const/theme'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { IconButton } from '@mui/material'

interface ThemeSwitcherProps {
  className?: string

}

export const ThemeSwitcher = memo(({ className }: ThemeSwitcherProps) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <IconButton onClick={toggleTheme} color="inherit" className={className}>
      {theme === Theme.DARK ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  )
})

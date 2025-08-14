import { useTranslation } from 'react-i18next'
import React, { memo } from 'react'
import { Button } from '@/shared/ui/redesigned/Button'

interface LangSwitcherProps {
  className?: string
  short?: boolean
}

export const LangSwitcher = memo(({ className, short }: LangSwitcherProps) => {
  const { t, i18n } = useTranslation()

  const toggle = () => {
    i18n.changeLanguage(i18n.language === 'ru' ? 'en' : 'ru')
  }

  return (
        <Button
            className={className}
            variant="clear"
            onClick={toggle}
        >
            {t(short ? 'Яз' : 'Язык')}
        </Button>
  )
})

import { useTranslation } from 'react-i18next'
import React, { memo, useCallback } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Button } from '@/shared/ui/redesigned/Button'
import { Dropdown } from '@/shared/ui/redesigned/Popups'
import { Icon } from '@/shared/ui/redesigned/Icon'
import RuIcon from '@/shared/assets/icons/RU.svg'
import USIcon from '@/shared/assets/icons/US.svg'
import DEIcon from '@/shared/assets/icons/DE.svg'
import CNIcon from '@/shared/assets/icons/CN.svg'
import { HStack } from '@/shared/ui/redesigned/Stack'

interface LangSwitcherProps {
  className?: string
  short?: boolean
}

export const LangSwitcher = memo(({ className, short }: LangSwitcherProps) => {
  const { t, i18n } = useTranslation()

  const onChange = useCallback((lang: string) => {
    i18n.changeLanguage(lang)
  }, [i18n])

  const items = [
    {
      content: (
        <HStack gap="8">
          <Icon Svg={RuIcon} width={20} height={20} />
          <span>Русский</span>
        </HStack>
      ),
      onClick: () => onChange('ru')
    },
    {
      content: (
        <HStack gap="8">
          <Icon Svg={USIcon} width={20} height={20} />
          <span>English</span>
        </HStack>
      ),
      onClick: () => onChange('en')
    },
    {
      content: (
        <HStack gap="8">
          <Icon Svg={DEIcon} width={20} height={20} />
          <span>Deutsch</span>
        </HStack>
      ),
      onClick: () => onChange('de')
    },
    {
      content: (
        <HStack gap="8">
          <Icon Svg={CNIcon} width={20} height={20} />
          <span>中文</span>
        </HStack>
      ),
      onClick: () => onChange('zh')
    }
  ]

  const currentLanguage = i18n.language?.split('-')[0] || 'en'

  const langConfig: Record<string, { icon: React.VFC<React.SVGProps<SVGSVGElement>>, label: string }> = {
    ru: { icon: RuIcon, label: 'Русский' },
    en: { icon: USIcon, label: 'English' },
    de: { icon: DEIcon, label: 'Deutsch' },
    zh: { icon: CNIcon, label: '中文' },
  }
  const currentConfig = langConfig[currentLanguage] || langConfig['en']

  return (
    <Dropdown
      direction="bottom-right"
      className={classNames('', {}, [className])}
      items={items}
      trigger={
        short
          ? (
            <Icon Svg={currentConfig.icon} width={24} height={24} />
          )
          : (
            <HStack gap="8">
              <Icon Svg={currentConfig.icon} width={20} height={20} />
              <span>{currentConfig.label}</span>
            </HStack>
          )
      }
    />
  )
})

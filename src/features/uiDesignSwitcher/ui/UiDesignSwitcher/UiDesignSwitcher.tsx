import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { ListBox } from '@/shared/ui/redesigned/Popups'
import { getFeatureFlag, updateFeatureFlag } from '@/shared/lib/features'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import { getTokenAllData } from '@/app/providers/getTokenData/getTokenData'
import { getUserAuthData } from '@/entities/User'

interface UiDesignSwitcherProps {
  className?: string
}

export const UiDesignSwitcher = memo((props: UiDesignSwitcherProps) => {
  const { className } = props
  const { t } = useTranslation()
  const isAppRedesigned = getFeatureFlag('isAppRedesigned')
  const dispatch = useAppDispatch()
  const userData = useSelector(getUserAuthData)
  const authData = getTokenAllData(userData?.token)

  const items = [
    {
      content: t('Новый'),
      value: 'new'
    },
    {
      content: t('Старый'),
      value: 'old'
    }
  ]

  const onChange = (value: string) => {
    if (authData) {
      dispatch(updateFeatureFlag({
        id: authData.id || '',
        designed: value === 'new'
      }))
    }
  }

  return (
        <ListBox
            label={t('Интерфейс') || ''}
            items={items}
            onChange={onChange}
            value={isAppRedesigned ? ['new'] : ['old']}
            className={className}
        />
  )
})

import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import { memo, useCallback, useMemo } from 'react'
import { TabItem } from '@/shared/ui/deprecated/Tabs'
import { ManualHashtagsTypes } from '@/entities/Manual'
import { Tabs } from '@/shared/ui/redesigned/Tabs'

interface ManualTypeTabsProps {
  className?: string
  value: ManualHashtagsTypes
  onChangeHashtag: (hashtag: ManualHashtagsTypes) => void
}

export const ManualTypeTabs = memo((props: ManualTypeTabsProps) => {
  const {
    className,
    value,
    onChangeHashtag
  } = props

  const { t } = useTranslation('manuals')

  const onTabClick = useCallback((tab: TabItem) => {
    onChangeHashtag(tab.value as ManualHashtagsTypes)
  }, [onChangeHashtag])

  const typeTabs = useMemo<TabItem[]>(() => [
    {
      value: ManualHashtagsTypes.ALL,
      content: t('Все')
    },
    {
      value: ManualHashtagsTypes.IT,
      content: t('Айти')
    },
    {
      value: ManualHashtagsTypes.PBX,
      content: t('АТС')
    },
    {
      value: ManualHashtagsTypes.INBOUND_CALL_CENTER,
      content: t('Входящий колл-центр')
    },
    {
      value: ManualHashtagsTypes.OUTBOUND_CALL_CENTER,
      content: t('Исодящий колл-центр')
    },
    {
      value: ManualHashtagsTypes.IP_PHONES,
      content: t('Аппараты')
    }
  ], [t])

  return (
      <Tabs
                      direction={'column'}
                      data-testid={'ManualHashtags'}
                      className={classNames('', {}, [className])}
                      tabs={typeTabs}
                      onTabClick={onTabClick}
                      value={value}
                  />
  )
})

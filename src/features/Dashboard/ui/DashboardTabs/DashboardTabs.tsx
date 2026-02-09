import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { DashboardTab } from '@/widgets/Dashboard/model/types/dashboardPageSchema'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './DashboardTabs.module.scss'

interface DashboardTabsProps {
    className?: string
    activeTab: DashboardTab
    onTabChange: (tab: DashboardTab) => void
}

export const DashboardTabs = memo((props: DashboardTabsProps) => {
    const { className, activeTab, onTabChange } = props
    const { t } = useTranslation('reports')

    const tabs: Array<{ value: DashboardTab; label: string }> = [
        { value: 'overview', label: t('Overview') },
        { value: 'ai-analytics', label: t('AI Analytics') },
        { value: 'call-records', label: t('Call Records') }
    ]

    return (
        <div className={classNames(cls.DashboardTabs, {}, [className])}>
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    className={classNames(
                        cls.tab,
                        { [cls.active]: activeTab === tab.value },
                        []
                    )}
                    onClick={() => onTabChange(tab.value)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
})

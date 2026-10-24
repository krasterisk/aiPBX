import type { ReactNode } from 'react'
import cls from './FiltersGroup.module.scss'

export function DashboardPeriodHeader({ title, children }: { title?: ReactNode, children: ReactNode }) {
    return <div className={cls.previewHeader}>{title}{children}</div>
}

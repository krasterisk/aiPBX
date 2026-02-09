import { memo } from 'react'
import { CircularProgress } from '@mui/material'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ProgressRing.module.scss'

interface ProgressRingProps {
    className?: string
    value: number // 0-100
    label: string
    size?: number // default 100
    thickness?: number // default 4
    color?: string
    showPercentage?: boolean // default true
}

export const ProgressRing = memo((props: ProgressRingProps) => {
    const {
        className,
        value,
        label,
        size = 100,
        thickness = 4,
        color,
        showPercentage = true
    } = props

    return (
        <div className={classNames(cls.ProgressRing, {}, [className])}>
            <div className={cls.container} style={{ width: size, height: size }}>
                <CircularProgress
                    variant="determinate"
                    value={value}
                    size={size}
                    thickness={thickness}
                    sx={{
                        color: color || 'var(--accent-redesigned)',
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round'
                        }
                    }}
                />
                <div className={cls.label}>
                    <span className={cls.value}>
                        {showPercentage ? `${Math.round(value)}%` : Math.round(value)}
                    </span>
                    {label && <span className={cls.text}>{label}</span>}
                </div>
            </div>
        </div>
    )
})

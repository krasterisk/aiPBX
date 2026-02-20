import { memo } from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import RemoveIcon from '@mui/icons-material/Remove'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './TrendIndicator.module.scss'

interface TrendIndicatorProps {
    className?: string
    value: number // percentage change (can be negative)
    direction?: 'up' | 'down' | 'neutral'
    size?: 'sm' | 'md' | 'lg'
}

export const TrendIndicator = memo((props: TrendIndicatorProps) => {
    const {
        className,
        value,
        direction,
        size = 'md'
    } = props

    // Auto-detect direction if not provided
    const autoDirection = direction || (value > 0 ? 'up' : value < 0 ? 'down' : 'neutral')

    const iconSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium'

    const renderIcon = () => {
        switch (autoDirection) {
            case 'up':
                return <TrendingUpIcon fontSize={iconSize} />
            case 'down':
                return <TrendingDownIcon fontSize={iconSize} />
            default:
                return <RemoveIcon fontSize={iconSize} />
        }
    }

    return (
        <div
            className={classNames(
                cls.TrendIndicator,
                {
                    [cls.positive]: autoDirection === 'up',
                    [cls.negative]: autoDirection === 'down',
                    [cls.neutral]: autoDirection === 'neutral'
                },
                [className, cls[size]]
            )}
        >
            {renderIcon()}
            {/* eslint-disable-next-line i18next/no-literal-string */}
            <span className={cls.value}>
                {value > 0 && '+'}{value.toFixed(1)}%
            </span>
        </div>
    )
})

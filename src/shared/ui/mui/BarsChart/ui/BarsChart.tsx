import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './BarsChart.module.scss'
import { memo } from 'react'
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart'

interface BarsChartsProps extends BarChartProps {
  className?: string
}

export const BarsChart = memo((props: BarsChartsProps) => {
  const {
    className,
    ...otherProps

  } = props

  const lcStyles = {
    '& .MuiChartsAxis-root .MuiChartsAxis-tickLabel': {
      fill: 'var(--text-redesigned)'
    },
    '& .MuiChartsAxis-root .MuiChartsAxis-line': {
      stroke: 'var(--text-redesigned)' // Изменение цвета линий оси
    }
  }

  return (
        <BarChart
            sx={{
              '--ChartsLegend-label-color': 'var(--text-redesigned)',
              ...lcStyles
            }}

            className={classNames(cls.BarsChart, {}, [className])}
            {...otherProps}
        />
  )
})

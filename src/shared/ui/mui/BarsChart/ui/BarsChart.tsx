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

  const chartStyles = {
    '& .MuiChartsAxis-line': { stroke: 'var(--text-redesigned) !important', strokeOpacity: '0.4 !important', strokeWidth: '1.5 !important' },
    '& .MuiChartsAxis-tick': { stroke: 'var(--text-redesigned) !important', strokeOpacity: '0.4 !important', strokeWidth: '1.5 !important' },
    '& .MuiChartsGrid-line': { stroke: 'var(--text-redesigned) !important', strokeOpacity: '0.1 !important', strokeDasharray: '4 4' },
    '& .MuiChartsAxis-tickLabel': { fill: 'var(--text-redesigned) !important' },
    '& .MuiChartsAxis-tickLabel tspan': { fill: 'var(--text-redesigned) !important' },
    '& .MuiChartsAxis-label': { fill: 'var(--text-redesigned) !important' },
    '& .MuiChartsLegend-label': { color: 'var(--text-redesigned) !important', fill: 'var(--text-redesigned) !important' },
    '& .MuiChartsLabel-root': { color: 'var(--text-redesigned) !important' },
    '& .MuiChartsLegend-root text': { fill: 'var(--text-redesigned) !important' },
    '& text': { fill: 'var(--text-redesigned) !important' },
  }

  return (
    <BarChart
      sx={{
        width: '100%',
        '--ChartsLegend-itemColor': 'var(--text-redesigned)',
        '--ChartsLegend-label-color': 'var(--text-redesigned)',
        '--ChartsLegend-root-color': 'var(--text-redesigned)',
        ...chartStyles
      }}
      className={classNames(cls.BarsChart, {}, [className])}
      {...otherProps}
    />
  )
})

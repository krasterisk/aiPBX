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
    // Стили для осей
    '& .MuiChartsAxis-root .MuiChartsAxis-tickLabel': {
      fill: 'var(--text-redesigned)'
    },
    '& .MuiChartsAxis-root .MuiChartsAxis-line': {
      stroke: 'var(--text-redesigned)'
    },

    // Стили для заголовков легенды (именно тот элемент, который вы указали)
    '& .MuiChartsLabel-root.MuiChartsLegend-label': {
      fill: 'var(--text-redesigned) !important',
      color: 'var(--text-redesigned) !important',
      fontWeight: 500 // при необходимости
    },

    // Альтернативные селекторы для надежности
    '& .MuiChartsLegend-root .MuiChartsLabel-root': {
      fill: 'var(--text-redesigned)',
      color: 'var(--text-redesigned)'
    },

    // Стиль для контейнера легенды
    '& .MuiChartsLegend-root': {
      '& text': {
        fill: 'var(--text-redesigned)'
      }
    }
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

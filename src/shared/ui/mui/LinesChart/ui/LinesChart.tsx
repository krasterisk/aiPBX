import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './LinesChart.module.scss'
import { memo } from 'react'
import { LineChartProps } from '@mui/x-charts'
import { LineChart } from '@mui/x-charts/LineChart'

interface LinesChartProps extends LineChartProps {
  className?: string
}

export const LinesChart = memo((props: LinesChartProps) => {
  const {
    className,
    ...otherProps

  } = props

  const lcStyles = {
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
    <LineChart
      sx={{
        width: '100%',
        '--ChartsLegend-itemColor': 'var(--text-redesigned)',
        '--ChartsLegend-label-color': 'var(--text-redesigned)',
        '--ChartsLegend-root-color': 'var(--text-redesigned)',
        ...lcStyles
      }}
      className={classNames(cls.LinesChart, {}, [className])}
      {...otherProps}
    />
  )
})

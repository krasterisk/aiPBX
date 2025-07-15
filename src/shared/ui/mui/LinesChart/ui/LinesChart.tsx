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
      stroke: 'var(--text-redesigned)' // Изменение цвета линий оси
    }
  }

  return (
      <LineChart
          sx={{
            '--ChartsLegend-label-color': 'var(--text-redesigned)',
            ...lcStyles
          }}
          className={classNames(cls.LinesChart, {}, [className])}
          {...otherProps}
      />
  )
})

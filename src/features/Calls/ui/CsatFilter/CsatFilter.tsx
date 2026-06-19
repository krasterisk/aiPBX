import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import {
  CSAT_SCORE_VALUES,
  CsatFilterValue,
} from '@/entities/Report'
import cls from './CsatFilter.module.scss'

interface CsatFilterProps {
  className?: string
  value: string[]
  onToggle: (value: CsatFilterValue) => void
}

export const CsatFilter = memo((props: CsatFilterProps) => {
  const { className, value, onToggle } = props
  const { t } = useTranslation('reports')

  const isSelected = useCallback((score: CsatFilterValue) => {
    return value.includes(score)
  }, [value])

  return (
    <HStack
      gap="8"
      align="center"
      wrap="wrap"
      className={classNames(cls.CsatFilter, {}, [className])}
      id="csat-filter"
      role="group"
      aria-label={String(t('Фильтр по оценке'))}
    >
      <Text
        text={String(t('Фильтр по оценке'))}
        size="s"
        className={cls.label}
      />

      {CSAT_SCORE_VALUES.map((score) => {
        const selected = isSelected(score)
        return (
          <button
            key={score}
            type="button"
            className={selected ? cls.chipActive : cls.chip}
            aria-pressed={selected}
            onClick={() => { onToggle(score) }}
            id={`csat-filter-score-${score}`}
          >
            <Star
              size={16}
              className={selected ? cls.chipStar : cls.chipStarMuted}
              fill={selected ? 'currentColor' : 'none'}
            />
            <span>{score}</span>
          </button>
        )
      })}
    </HStack>
  )
})

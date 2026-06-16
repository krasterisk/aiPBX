import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Star, MinusCircle } from 'lucide-react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import {
  CSAT_SCORE_VALUES,
  CsatFilterValue,
  isCsatFilterActive,
} from '@/entities/Report'
import cls from './CsatFilter.module.scss'

interface CsatFilterProps {
  className?: string
  value: string[]
  onToggle: (value: CsatFilterValue) => void
  onClear: () => void
}

export const CsatFilter = memo((props: CsatFilterProps) => {
  const { className, value, onToggle, onClear } = props
  const { t } = useTranslation('reports')

  const isActive = isCsatFilterActive(value)

  const isSelected = useCallback((score: CsatFilterValue) => {
    return value.includes(score)
  }, [value])

  return (
    <VStack
      gap="0"
      max
      className={classNames(cls.CsatFilter, {}, [className])}
      id="csat-filter"
    >
      <HStack max justify="between" align="center" className={cls.header}>
        <Text
          text={String(t('Фильтр по оценке'))}
          size="s"
          bold
        />
        {isActive && (
          <Text
            text={String(t('Выбрано оценок', { count: value.length }))}
            size="xs"
          />
        )}
      </HStack>

      <div className={cls.chipRow} role="group" aria-label={String(t('Фильтр по оценке'))}>
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
                size={14}
                className={selected ? cls.chipStar : cls.chipStarMuted}
                fill={selected ? 'currentColor' : 'none'}
              />
              <span>{score}</span>
            </button>
          )
        })}

        <button
          type="button"
          className={isSelected('none') ? cls.chipActive : cls.chip}
          aria-pressed={isSelected('none')}
          onClick={() => { onToggle('none') }}
          id="csat-filter-none"
        >
          <MinusCircle size={14} />
          <span>{String(t('Без оценки'))}</span>
        </button>

        {isActive && (
          <Button
            variant="clear"
            size="s"
            className={cls.clearBtn}
            onClick={onClear}
            id="csat-filter-clear"
          >
            {String(t('Сбросить'))}
          </Button>
        )}
      </div>
    </VStack>
  )
})

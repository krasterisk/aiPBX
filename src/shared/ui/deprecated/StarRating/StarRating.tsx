import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './StarRating.module.scss'
import { memo, useState } from 'react'
import { Icon as IconDeprecated } from '../Icon/Icon'
import StarIcon from '@/shared/assets/icons/star.svg'
import { toggleFeatures, ToggleFeatures } from '@/shared/lib/features'
import { Icon } from '../../redesigned/Icon'

interface StarRatingProps {
  onSelect?: (starsCount: number) => void
  size?: number
  selectedStars?: number
}

const stars = [1, 2, 3, 4, 5]

/**
 * @deprecated
 */

export const StarRating = memo((props: StarRatingProps) => {
  const {
    selectedStars = 0,
    size = 30,
    onSelect
  } = props

  const [currentStarCount, setCurrentStarCount] = useState(selectedStars)
  const [isSelected, setIsSelected] = useState(Boolean(selectedStars))

  const onHover = (starsCount: number) => () => {
    if (!isSelected) {
      setCurrentStarCount(starsCount)
    }
  }

  const onLeave = () => {
    if (!isSelected) {
      setCurrentStarCount(0)
    }
  }

  const onClick = (starsCount: number) => () => {
    if (!isSelected) {
      onSelect?.(starsCount)
      setCurrentStarCount(starsCount)
      setIsSelected(true)
    }
  }

  return (
        <div className={classNames(toggleFeatures({
          name: 'isAppRedesigned',
          on: () => cls.StarRatingRedesigned,
          off: () => cls.StarRating
        }))}
        >
            {stars.map((starNumber) => {
              const commonProps = {
                className: classNames(
                  cls.StarIcon,
                  { [cls.selected]: isSelected },
                  [currentStarCount >= starNumber ? cls.hovered : cls.normal]),
                Svg: StarIcon,
                key: starNumber,
                width: size,
                height: size,
                onMouseEnter: onHover(starNumber),
                onMouseLeave: onLeave,
                onClick: onClick(starNumber),
                'data-testid': `StarRating.${starNumber}`,
                'data-selected': currentStarCount >= starNumber

              }

              return (
                  <ToggleFeatures
                      key={starNumber}
                      feature={'isAppRedesigned'}
                      on={
                        <Icon clickable={!isSelected} {...commonProps} />
                      }
                      off={
                        <IconDeprecated {...commonProps} />
                      }
                      />
              )
            }
            )
            }
        </div>
  )
})

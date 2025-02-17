import { memo } from 'react'
import { Icon } from '@/shared/ui/redesigned/Icon'
import CircleIcon from '@/shared/assets/icons/circle-up.svg'

interface ScrollToTopButtonProps {
  className?: string

}

export const ScrollToTopButton = memo((props: ScrollToTopButtonProps) => {
  const {
    className
  } = props

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
        <Icon
        Svg={CircleIcon}
        width={32}
        clickable
        height={32}
        onClick={onClick}
        className={className}
        />
  )
})

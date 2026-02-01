import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Text.module.scss'
import { memo } from 'react'

export type TextVariant = 'primary' | 'error' | 'accent' | 'success' | 'warning'

interface TextProps {
  className?: string
  title?: string | undefined | null
  text?: string | undefined | null
  variant?: TextVariant
  align?: TextAlign
  size?: TextSize
  'data-testid'?: string
  bold?: boolean
}

export type TextAlign = 'right' | 'left' | 'center'

export type TextSize = 'xs' | 's' | 'm' | 'l' | 'xl'

type HeaderTagType = 'h1' | 'h2' | 'h3' | 'h4'

const mapSizeToClass: Record<TextSize, string> = {
  xs: cls.size_xs,
  s: cls.size_s,
  m: cls.size_m,
  l: cls.size_l,
  xl: cls.size_xl
}

const mapSizeToHeaderTag: Record<TextSize, HeaderTagType> = {
  xs: 'h4',
  s: 'h4',
  m: 'h3',
  l: 'h2',
  xl: 'h1'
}

export const Text = memo((props: TextProps) => {
  const {
    className,
    text,
    title,
    variant = 'primary',
    align = 'left',
    size = 'm',
    'data-testid': dataTestId = 'Text',
    bold
  } = props

  const HeaderTag = mapSizeToHeaderTag[size]
  const sizeClass = mapSizeToClass[size]

  const additionalClasses = [className, cls[variant], cls[align], sizeClass]

  return (
    <div className={classNames(cls.Text, { [cls.bold]: bold }, additionalClasses)}>
      {title && <HeaderTag
        className={cls.title}
        data-testid={`${dataTestId}.header`}
      >
        {title}
      </HeaderTag>}
      {text && (
        <p
          className={cls.text}
          data-testid={`${dataTestId}.Paragraph`}
        >
          {text}
        </p>
      )}

    </div>
  )
})

import React, { memo } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Icon.module.scss'

type SvgProps = Omit<React.SVGProps<SVGSVGElement>, 'onClick'>

interface IconBaseProps extends SvgProps {
  className?: string
  Svg: React.ElementType
}

interface NonClickableIconProps extends IconBaseProps {
  clickable?: false
}

interface ClickableBaseProps extends IconBaseProps {
  clickable: true
  onClick: () => void
}

type IconProps = NonClickableIconProps | ClickableBaseProps

export const Icon = memo((props: IconProps) => {
  const {
    className,
    Svg,
    width = 32,
    height = 32,
    clickable,
    onClick,
    ...otherProps
  } = props as IconProps & { onClick?: () => void }

  const { 'data-testid': dataTestId, ...svgProps } = otherProps as typeof otherProps & {
    'data-testid'?: string
  }

  const icon = (
    <Svg
      className={classNames(cls.Icon, {}, [className])}
      width={width}
      height={height}
      {...svgProps}
      onClick={undefined}
    />
  )

  if (clickable) {
    return (
      <button
        type="button"
        className={cls.button}
        onClick={onClick}
        style={{ height, width }}
        data-testid={dataTestId}
      >
        {icon}
      </button>
    )
  }

  return icon
})

import { ButtonHTMLAttributes, forwardRef, memo, ReactNode } from 'react'
import { classNames, Mods } from '@/shared/lib/classNames/classNames'
import cls from './Button.module.scss'

export type ButtonVariant = 'primary' | 'outline' | 'clear' | 'accent'
export type ButtonSize = 'm' | 'l' | 'xl'
export type ButtonColor = 'normal' | 'success' | 'error' | 'accent'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string
    /**
     * Button variant for visual style
     */
    variant?: ButtonVariant
    /**
     * Button size
     */
    size?: ButtonSize
    /**
     * Button color theme
     */
    color?: ButtonColor
    /**
     * Flag to make button square (for icons)
     */
    square?: boolean
    /**
     * Flag to make button take full width
     */
    fullWidth?: boolean
    /**
     * Disabled state
     */
    disabled?: boolean
    /**
     * Element to display on the left
     */
    addonLeft?: ReactNode
    /**
     * Element to display on the right
     */
    addonRight?: ReactNode
    children?: ReactNode
}

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        className,
        children,
        variant = 'primary',
        square,
        disabled,
        fullWidth,
        size = 'm',
        addonLeft,
        addonRight,
        color = 'normal',
        ...otherProps
    } = props

    const mods: Mods = {
        [cls.square]: square,
        [cls.disabled]: disabled,
        [cls.fullWidth]: fullWidth,
        [cls.withAddon]: Boolean(addonLeft) || Boolean(addonRight)
    }

    return (
        <button
            type="button"
            className={classNames(cls.Button, mods, [
                className,
                cls[variant],
                cls[size],
                cls[color]
            ])}
            disabled={disabled}
            ref={ref}
            {...otherProps}
        >
            {addonLeft && <div className={cls.addonLeft}>{addonLeft}</div>}
            {children}
            {addonRight && <div className={cls.addonRight}>{addonRight}</div>}
        </button>
    )
}))

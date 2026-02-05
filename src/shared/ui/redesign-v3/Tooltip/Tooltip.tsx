import React, { memo, ReactNode, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Tooltip.module.scss'

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
    children: ReactNode
    title: string | ReactNode
    placement?: TooltipPlacement
    className?: string
    disabled?: boolean
}

interface Position {
    top: number
    left: number
}

export const Tooltip = memo((props: TooltipProps) => {
    const {
        children,
        title,
        placement = 'top',
        className,
        disabled = false
    } = props

    const [isVisible, setIsVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [position, setPosition] = useState<Position>({ top: 0, left: 0 })
    const timeoutRef = useRef<NodeJS.Timeout>()
    const wrapperRef = useRef<HTMLDivElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Определяем мобильное устройство
        const checkMobile = () => {
            setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        // Закрытие при клике вне элемента (для мобильных)
        if (!isMobile || !isVisible) return

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node) &&
                tooltipRef.current &&
                !tooltipRef.current.contains(event.target as Node)
            ) {
                setIsVisible(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [isMobile, isVisible])

    // Вычисляем позицию tooltip
    const calculatePosition = (): Position => {
        if (!wrapperRef.current) return { top: 0, left: 0 }

        const rect = wrapperRef.current.getBoundingClientRect()
        const scrollY = window.pageYOffset || document.documentElement.scrollTop
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft

        const offset = 12 // Отступ от элемента
        let top = 0
        let left = 0

        // Определяем позицию в зависимости от placement
        // На мобильных left/right заменяем на top
        const actualPlacement = isMobile && (placement === 'left' || placement === 'right')
            ? 'top'
            : placement

        switch (actualPlacement) {
            case 'top':
                top = rect.top + scrollY - offset
                left = rect.left + scrollX + rect.width / 2
                break
            case 'bottom':
                top = rect.bottom + scrollY + offset
                left = rect.left + scrollX + rect.width / 2
                break
            case 'left':
                top = rect.top + scrollY + rect.height / 2
                left = rect.left + scrollX - offset
                break
            case 'right':
                top = rect.top + scrollY + rect.height / 2
                left = rect.right + scrollX + offset
                break
        }

        return { top, left }
    }

    useEffect(() => {
        if (isVisible) {
            setPosition(calculatePosition())
        }
    }, [isVisible, placement, isMobile])

    useEffect(() => {
        // Обновляем позицию при скролле
        if (!isVisible) return

        const updatePosition = () => {
            setPosition(calculatePosition())
        }

        window.addEventListener('scroll', updatePosition, true)
        window.addEventListener('resize', updatePosition)

        return () => {
            window.removeEventListener('scroll', updatePosition, true)
            window.removeEventListener('resize', updatePosition)
        }
    }, [isVisible, placement, isMobile])

    const showTooltip = () => {
        if (disabled) return
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true)
        }, isMobile ? 0 : 300)
    }

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        if (!isMobile) {
            setIsVisible(false)
        }
    }

    const toggleTooltip = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isMobile) return
        e.preventDefault()
        e.stopPropagation()
        setIsVisible(!isVisible)
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    if (!title) return <>{children}</>

    const actualPlacement = isMobile && (placement === 'left' || placement === 'right')
        ? 'top'
        : placement

    const tooltipContent = isVisible && createPortal(
        <div
            ref={tooltipRef}
            className={classNames(cls.tooltipPortal, {}, [cls[actualPlacement]])}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`
            }}
        >
            <div className={cls.tooltipInner}>
                {title}
            </div>
            <div className={cls.tooltipArrow} />
        </div>,
        document.body
    )

    return (
        <>
            <div
                ref={wrapperRef}
                className={classNames(cls.Tooltip, {}, [className])}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onClick={toggleTooltip}
                onTouchStart={toggleTooltip}
            >
                {children}
            </div>
            {tooltipContent}
        </>
    )
})

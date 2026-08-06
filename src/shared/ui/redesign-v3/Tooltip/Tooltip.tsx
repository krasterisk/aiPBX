import React, { memo, ReactNode, useState, useRef, useEffect, useCallback } from 'react'
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
    placement: TooltipPlacement
}

const VIEWPORT_PAD = 12
const OFFSET = 10
const MAX_TOOLTIP_WIDTH = 280

export const Tooltip = memo((props: TooltipProps) => {
    const {
        children,
        title,
        placement = 'top',
        className,
        disabled = false,
    } = props

    const [isVisible, setIsVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [position, setPosition] = useState<Position>({ top: 0, left: 0, placement: 'top' })
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
    const wrapperRef = useRef<HTMLDivElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => { window.removeEventListener('resize', checkMobile) }
    }, [])

    useEffect(() => {
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

    const resolvePlacement = useCallback((): TooltipPlacement => {
        if (isMobile && (placement === 'left' || placement === 'right')) {
            return 'top'
        }
        return placement
    }, [isMobile, placement])

    const calculatePosition = useCallback((): Position => {
        if (!wrapperRef.current) {
            return { top: 0, left: 0, placement: resolvePlacement() }
        }

        const trigger = wrapperRef.current.getBoundingClientRect()
        const tip = tooltipRef.current?.getBoundingClientRect()
        const tipWidth = tip?.width || Math.min(MAX_TOOLTIP_WIDTH, window.innerWidth - VIEWPORT_PAD * 2)
        const tipHeight = tip?.height || 48

        let nextPlacement = resolvePlacement()

        const space = {
            top: trigger.top,
            bottom: window.innerHeight - trigger.bottom,
            left: trigger.left,
            right: window.innerWidth - trigger.right,
        }

        // Flip when preferred side does not fit.
        if (nextPlacement === 'top' && space.top < tipHeight + OFFSET && space.bottom > space.top) {
            nextPlacement = 'bottom'
        } else if (nextPlacement === 'bottom' && space.bottom < tipHeight + OFFSET && space.top > space.bottom) {
            nextPlacement = 'top'
        } else if (nextPlacement === 'left' && space.left < tipWidth + OFFSET && space.right > space.left) {
            nextPlacement = 'right'
        } else if (nextPlacement === 'right' && space.right < tipWidth + OFFSET && space.left > space.right) {
            nextPlacement = 'left'
        }

        let top = 0
        let left = 0

        switch (nextPlacement) {
            case 'top':
                top = trigger.top - tipHeight - OFFSET
                left = trigger.left + trigger.width / 2 - tipWidth / 2
                break
            case 'bottom':
                top = trigger.bottom + OFFSET
                left = trigger.left + trigger.width / 2 - tipWidth / 2
                break
            case 'left':
                top = trigger.top + trigger.height / 2 - tipHeight / 2
                left = trigger.left - tipWidth - OFFSET
                break
            case 'right':
                top = trigger.top + trigger.height / 2 - tipHeight / 2
                left = trigger.right + OFFSET
                break
        }

        const maxLeft = window.innerWidth - tipWidth - VIEWPORT_PAD
        const maxTop = window.innerHeight - tipHeight - VIEWPORT_PAD
        left = Math.min(Math.max(VIEWPORT_PAD, left), Math.max(VIEWPORT_PAD, maxLeft))
        top = Math.min(Math.max(VIEWPORT_PAD, top), Math.max(VIEWPORT_PAD, maxTop))

        return { top, left, placement: nextPlacement }
    }, [resolvePlacement])

    useEffect(() => {
        if (!isVisible) return
        // First paint may use estimated size; remeasure after portal mounts.
        const frame = requestAnimationFrame(() => {
            setPosition(calculatePosition())
        })
        return () => { cancelAnimationFrame(frame) }
    }, [isVisible, calculatePosition, title])

    useEffect(() => {
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
    }, [isVisible, calculatePosition])

    const showTooltip = () => {
        if (disabled) return
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true)
        }, isMobile ? 0 : 200)
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
        setIsVisible(prev => !prev)
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    if (!title) return <>{children}</>

    const tooltipContent = isVisible && createPortal(
        <div
            ref={tooltipRef}
            className={classNames(cls.tooltipPortal, {}, [cls[position.placement]])}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
            role="tooltip"
        >
            <div className={cls.tooltipInner}>
                {title}
            </div>
            <div className={cls.tooltipArrow} />
        </div>,
        document.body,
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

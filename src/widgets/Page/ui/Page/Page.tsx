import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Page.module.scss'
import { MutableRefObject, ReactNode, UIEvent, useRef } from 'react'
import { useInfiniteScroll } from '@/shared/lib/hooks/useInfiniteScroll/useInfiniteScroll'
import { useDispatch, useSelector } from 'react-redux'
import { getScrollByPath, scrollSaveActions } from '@/features/ScrollSave'
import { useLocation } from 'react-router-dom'
import { StateSchema } from '@/app/providers/StoreProvider'
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect'
import { useThrottle } from '@/shared/lib/hooks/useThrottle/useThrottle'
import { TestsProps } from '@/shared/types/tests'

interface PageProps extends TestsProps {
    className?: string
    children: ReactNode
    onScrollEnd?: () => void
    isSaveScroll?: boolean
}

export const Page = (props: PageProps) => {
    const {
        className,
        children,
        onScrollEnd,
        isSaveScroll = false
    } = props

    const wrapperRef = useRef() as MutableRefObject<HTMLDivElement>
    const triggerRef = useRef() as MutableRefObject<HTMLDivElement>
    const dispatch = useDispatch()
    const { pathname } = useLocation()
    const scrollPosition = useSelector(
        (state: StateSchema) => getScrollByPath(state, pathname)
    )

    useInfiniteScroll({
        triggerRef,
        wrapperRef,
        callback: onScrollEnd
    })

    useInitialEffect(() => {
        if (isSaveScroll) {
            wrapperRef.current.scrollTop = scrollPosition
        }
    })
    const onScroll = useThrottle((e: UIEvent<HTMLDivElement>) => {
        if (isSaveScroll) {
            dispatch(scrollSaveActions.setScrollPosition({
                position: e.currentTarget.scrollTop,
                path: pathname
            }))
        }
    }, 500)

    return (
        <main
            className={classNames(cls.Page, {}, [className])}
            ref={wrapperRef}
            onScroll={onScroll}
            data-testid={props['data-testid'] ?? 'Page'}
        >
            {children}
            {onScrollEnd ? <div className={cls.trigger} ref={triggerRef} /> : null}
        </main>
    )
}

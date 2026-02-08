import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Page.module.scss'
import { MutableRefObject, ReactNode, UIEvent, useRef, useEffect } from 'react'
import { useInfiniteScroll } from '@/shared/lib/hooks/useInfiniteScroll/useInfiniteScroll'
import { useDispatch, useSelector } from 'react-redux'
import { getScrollByPath, getScrollRestorationEnabled, scrollSaveActions } from '@/features/ScrollSave'
import { useLocation } from 'react-router-dom'
import { StateSchema } from '@/app/providers/StoreProvider'
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
  const triggerRefEnd = useRef() as MutableRefObject<HTMLDivElement>
  const triggerRefStart = useRef() as MutableRefObject<HTMLDivElement>
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const isRestorationEnabled = useSelector(getScrollRestorationEnabled)

  const scrollPosition = useSelector(
    (state: StateSchema) => getScrollByPath(state, pathname)
  )

  // const throttleScrollEnd = useThrottle(() => {
  //   onScrollEnd?.()
  // }, 500)
  //
  // const throttleScrollStart = useThrottle(() => {
  //   onScrollStart?.()
  // }, 500)

  useInfiniteScroll({
    triggerRefEnd,
    triggerRefStart,
    wrapperRef: undefined,
    callbackEnd: onScrollEnd
  })

  useEffect(() => {
    if (isSaveScroll && isRestorationEnabled) {
      if (wrapperRef.current) {
        wrapperRef.current.scrollTop = scrollPosition
      }
    } else {
      if (wrapperRef.current) {
        wrapperRef.current.scrollTop = 0
      }
      window.scrollTo(0, 0)
    }
  }, [pathname, isSaveScroll, isRestorationEnabled, scrollPosition])
  const onScroll = useThrottle((e: UIEvent<HTMLDivElement>) => {
    if (isSaveScroll && isRestorationEnabled) {
      const scrollTop = e.currentTarget.scrollTop
      dispatch(scrollSaveActions.setScrollPosition({
        position: scrollTop,
        path: pathname
      }))
    }
  }, 500)

  return (
    <main
      ref={wrapperRef}
      className={classNames(
        cls.PageRedesigned,
        {},
        [className]
      )}
      onScroll={onScroll}
      data-testid={props['data-testid'] ?? 'Page'}
    >
      {children}
      {onScrollEnd
        ? (
          <div className={cls.trigger} ref={triggerRefEnd} />
        )
        : null}
    </main>
  )
}

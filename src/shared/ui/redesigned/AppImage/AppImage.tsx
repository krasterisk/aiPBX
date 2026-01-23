import {
  ImgHTMLAttributes,
  memo,
  ReactElement,
  useLayoutEffect,
  useState
} from 'react'

interface AppImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string
  fallback?: ReactElement
  errorFallback?: ReactElement
}

export const AppImage = memo((props: AppImageProps) => {
  const {
    className,
    fallback,
    errorFallback,
    src,
    alt = '',
    ...otherProps
  } = props

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useLayoutEffect(() => {
    const img = new Image()
    setIsLoading(true)
    setHasError(false)
    img.src = src ?? ''
    img.onload = () => {
      setIsLoading(false)
    }
    img.onerror = () => {
      setIsLoading(false)
      setHasError(true)
    }
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  if (isLoading && fallback) {
    return fallback
  }

  if (hasError && errorFallback) {
    return errorFallback
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      {...otherProps}
    />
  )
})

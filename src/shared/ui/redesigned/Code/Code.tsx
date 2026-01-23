import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Code.module.scss'
import { memo, useCallback } from 'react'
import CopyIcon from '@/shared/assets/icons/copy-20-20.svg'
import CopyIconNew from '@/shared/assets/icons/copy.svg'
import { Icon } from '../Icon'

interface CodeProps {
  className?: string
  text: string
}

export const Code = memo((props: CodeProps) => {
  const {
    className,
    text
  } = props

  const onCopy = useCallback(() => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .catch(err => {
          console.error('Failed to copy text: ', err)
        })
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-9999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err)
      }
      document.body.removeChild(textArea)
    }
  }, [text])

  return (
    <pre className={classNames(cls.CodeRedesigned, {}, [className])}>
      <Icon
        clickable
        onClick={onCopy}
        className={cls.copyBtn}
        Svg={CopyIconNew}
      >
        <CopyIcon className={cls.copyIcon} />
      </Icon>
      <code>
        {text}
      </code>
    </pre>
  )
})

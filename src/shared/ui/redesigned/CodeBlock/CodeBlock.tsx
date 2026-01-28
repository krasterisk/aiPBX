import { memo, useCallback } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './CodeBlock.module.scss'
import { Button } from '../Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

interface CodeBlockProps {
    className?: string
    code: string
    language?: string
    showCopyButton?: boolean
}

export const CodeBlock = memo((props: CodeBlockProps) => {
    const {
        className,
        code,
        language = 'html',
        showCopyButton = true
    } = props

    const { t } = useTranslation('assistants')

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code)
            .then(() => {
                toast.success(t('Код скопирован!') || 'Code copied!')
            })
            .catch((err) => {
                toast.error('Failed to copy code')
                console.error('Copy failed:', err)
            })
    }, [code, t])

    return (
        <div className={classNames(cls.CodeBlock, {}, [className])}>
            <div className={cls.header}>
                <span className={cls.language}>{language}</span>
                {showCopyButton && (
                    <button className={cls.copyButton} onClick={handleCopy}>
                        <ContentCopyIcon fontSize="small" />
                        {t('Скопировать код')}
                    </button>
                )}
            </div>
            <div className={cls.codeWrapper}>
                <pre className={cls.code}>{code}</pre>
            </div>
        </div>
    )
})

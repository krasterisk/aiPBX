import { memo, useCallback } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './CodeBlock.module.scss'
import { Icon } from '@/shared/ui/redesigned/Icon'
import CopyIcon from '@/shared/assets/icons/copy.svg'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'

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
        <VStack
            className={classNames(cls.CodeBlock, {}, [className])}
            max
        >
            <HStack
                justify="between"
                align="center"
                className={cls.header}
                max
            >
                <Text
                    text={language}
                    className={cls.language}
                    bold
                />
                {showCopyButton && (
                    <button className={cls.copyButton} onClick={handleCopy}>
                        <Icon Svg={CopyIcon} width={16} height={16} />
                        {t('Копировать')}
                    </button>
                )}
            </HStack>
            <div className={cls.codeWrapper}>
                <pre className={cls.code}>
                    {code}
                </pre>
            </div>
        </VStack>
    )
})

import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { CodeBlock } from '@/shared/ui/redesigned/CodeBlock'
import { Icon } from '@/shared/ui/redesigned/Icon'
import CodeIcon from '@mui/icons-material/Code'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './EmbedCodeCard.module.scss'

interface EmbedCodeCardProps {
    className?: string
    embedCode: string
    widgetName?: string
}

export const EmbedCodeCard = memo((props: EmbedCodeCardProps) => {
    const { className, embedCode, widgetName } = props
    const { t } = useTranslation('publish-widgets')

    return (
        <Card
            padding="24"
            max
            border="partial"
            className={classNames(cls.EmbedCodeCard, {}, [className])}
        >
            <VStack gap="16" max>
                <HStack gap="12" align="center" className={cls.header} max>
                    <Icon Svg={CodeIcon} className={cls.icon} />
                    <Text
                        title={`${t('Код для встраивания')} "${widgetName}"`}
                        size="l"
                        bold
                    />
                </HStack>

                <Text
                    text={t('Скопируйте этот код и вставьте перед закрывающим тегом </body>')}
                    variant="accent"
                />

                <CodeBlock
                    code={embedCode}
                    language="html"
                    showCopyButton
                />
            </VStack>
        </Card>
    )
})

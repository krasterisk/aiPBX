import { memo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getDocumentationContent } from '../../lib/getDocumentationContent'
import { CodeBlock } from '@/shared/ui/redesigned/CodeBlock/CodeBlock'
import { Text } from '@/shared/ui/redesigned/Text'
import cls from './DocumentationContent.module.scss'

export const DocumentationContent = memo(() => {
    const { t, i18n } = useTranslation('docs')
    const [searchParams] = useSearchParams()
    const currentSection = searchParams.get('section') || 'getting-started'

    const content = getDocumentationContent(currentSection, i18n.language)

    return (
        <Box className={cls.DocumentationContent}>
            <Text
                title={t(content.title)}
                size="xl"
                bold
                className={cls.title}
            />

            <Box className={cls.contentBody}>
                {content.sections.map((section, index) => (
                    <Box key={index} className={cls.section}>
                        {section.heading && (
                            <Text
                                title={t(section.heading)}
                                size="l"
                                bold
                                className={cls.heading}
                            />
                        )}

                        {section.subheading && (
                            <Text
                                text={t(section.subheading)}
                                variant="accent"
                                bold
                                className={cls.subheading}
                            />
                        )}

                        {section.content && (
                            <Text
                                text={t(section.content)}
                                className={cls.paragraph}
                            />
                        )}

                        {section.list && (
                            <Box component="ul" className={cls.list}>
                                {section.list.map((item, i) => (
                                    <li key={i}>
                                        <Text text={t(item)} />
                                    </li>
                                ))}
                            </Box>
                        )}

                        {section.image && (
                            <Box className={cls.imageContainer}>
                                <img
                                    src={section.image}
                                    alt={section.imageAlt ? t(section.imageAlt) ?? '' : ''}
                                    className={cls.image}
                                />
                                {section.imageCaption && (
                                    <Text
                                        text={t(section.imageCaption)}
                                        size="s"
                                        className={cls.imageCaption}
                                    />
                                )}
                            </Box>
                        )}

                        {section.note && (
                            <Box className={cls.note}>
                                <Text
                                    text={t(section.note)}
                                    title={t('Note') + ':'}
                                />
                            </Box>
                        )}

                        {section.steps && (
                            <Box component="ol" className={cls.steps}>
                                {section.steps.map((step, i) => (
                                    <li key={i}>
                                        <Text text={t(step)} />
                                    </li>
                                ))}
                            </Box>
                        )}

                        {section.code && (
                            <Box className={cls.codeBlockContainer}>
                                <CodeBlock
                                    code={section.code}
                                    language={section.language || 'ini'}
                                />
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    )
})

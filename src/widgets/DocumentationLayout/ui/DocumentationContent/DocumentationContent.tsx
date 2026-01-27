import { memo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getDocumentationContent } from '../../lib/getDocumentationContent'
import cls from './DocumentationContent.module.scss'

export const DocumentationContent = memo(() => {
    const { t, i18n } = useTranslation('docs')
    const [searchParams] = useSearchParams()
    const currentSection = searchParams.get('section') || 'getting-started'

    const content = getDocumentationContent(currentSection, i18n.language)

    return (
        <Box className={cls.DocumentationContent}>
            <Typography variant="h4" className={cls.title}>
                {t(content.title)}
            </Typography>

            <Box className={cls.contentBody}>
                {content.sections.map((section, index) => (
                    <Box key={index} className={cls.section}>
                        {section.heading && (
                            <Typography variant="h5" className={cls.heading}>
                                {t(section.heading)}
                            </Typography>
                        )}

                        {section.subheading && (
                            <Typography variant="h6" className={cls.subheading}>
                                {t(section.subheading)}
                            </Typography>
                        )}

                        {section.content && (
                            <Typography className={cls.paragraph}>
                                {t(section.content)}
                            </Typography>
                        )}

                        {section.list && (
                            <Box component="ul" className={cls.list}>
                                {section.list.map((item, i) => (
                                    <li key={i}>
                                        <Typography>{t(item)}</Typography>
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
                                    <Typography variant="caption" className={cls.imageCaption}>
                                        {t(section.imageCaption)}
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {section.note && (
                            <Box className={cls.note}>
                                <Typography>
                                    <strong>{t('Note')}: </strong>
                                    {t(section.note)}
                                </Typography>
                            </Box>
                        )}

                        {section.steps && (
                            <Box component="ol" className={cls.steps}>
                                {section.steps.map((step, i) => (
                                    <li key={i}>
                                        <Typography>{t(step)}</Typography>
                                    </li>
                                ))}
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    )
})

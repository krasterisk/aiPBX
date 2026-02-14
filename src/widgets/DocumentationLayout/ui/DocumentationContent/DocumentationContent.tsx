import { memo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getDocumentationContent } from '../../lib/getDocumentationContent'
import { CodeBlock } from '@/shared/ui/redesigned/CodeBlock/CodeBlock'
import { Text } from '@/shared/ui/redesigned/Text'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
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

                        {section.table && (
                            <Box className={cls.tableContainer}>
                                <table className={cls.table}>
                                    <thead>
                                        <tr>
                                            {section.table.headers.map((header, i) => (
                                                <th key={i}>{t(header)}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section.table.rows.map((row, i) => (
                                            <tr key={i}>
                                                {row.map((cell, j) => (
                                                    <td key={j}>{t(cell)}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

                        {section.tip && (
                            <Box className={cls.tip}>
                                <Box className={cls.tipIcon}>
                                    <TipsAndUpdatesOutlinedIcon fontSize="small" />
                                </Box>
                                <Box className={cls.tipContent}>
                                    <Typography variant="subtitle2" className={cls.tipTitle}>
                                        {t('Совет')}
                                    </Typography>
                                    <Text text={t(section.tip)} size="s" />
                                </Box>
                            </Box>
                        )}

                        {section.warning && (
                            <Box className={cls.warning}>
                                <Box className={cls.warningIcon}>
                                    <WarningAmberOutlinedIcon fontSize="small" />
                                </Box>
                                <Box className={cls.warningContent}>
                                    <Typography variant="subtitle2" className={cls.warningTitle}>
                                        {t('Внимание')}
                                    </Typography>
                                    <Text text={t(section.warning)} size="s" />
                                </Box>
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

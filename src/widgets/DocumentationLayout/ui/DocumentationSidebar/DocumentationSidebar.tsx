import { memo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Collapse,
    Typography
} from '@mui/material'
import { ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react'
import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'
import { getRouteMain } from '@/shared/const/router'
import { ThemeSwitcher } from '@/entities/ThemeSwitcher'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { DOC_SECTIONS } from '../../lib/getDocumentationContent'
import cls from './DocumentationSidebar.module.scss'

interface DocumentationSidebarProps {
    onItemClick?: () => void
}

export const DocumentationSidebar = memo(({ onItemClick }: DocumentationSidebarProps) => {
    const { t } = useTranslation('docs')
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const userData = useSelector(getUserAuthData)
    const currentSection = searchParams.get('section') || 'getting-started'

    const [expandedSections, setExpandedSections] = useState<string[]>(() => {
        // Auto-expand the parent section if we're on a subsection
        const parent = DOC_SECTIONS.find(s =>
            s.id === currentSection || s.subsections?.some(sub => sub.id === currentSection)
        )
        return parent?.subsections ? [parent.id] : []
    })

    const toggleSection = useCallback((sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        )
    }, [])

    const handleSectionClick = useCallback((sectionId: string, hasSubsections: boolean) => {
        if (hasSubsections) {
            toggleSection(sectionId)
            // Also navigate to the section top
            navigate(`/docs?section=${sectionId}`)
            onItemClick?.()
        } else {
            navigate(`/docs?section=${sectionId}`)
            onItemClick?.()
        }
    }, [navigate, onItemClick, toggleSection])

    const handleSubsectionClick = useCallback((subsectionId: string, anchor?: string) => {
        navigate(`/docs?section=${subsectionId}${anchor ? `#${anchor}` : ''}`)
        onItemClick?.()

        // Scroll to anchor with retry (content may need time to load)
        if (anchor) {
            let attempts = 0
            const maxAttempts = 10
            const tryScroll = () => {
                const el = document.getElementById(anchor)
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                } else if (attempts < maxAttempts) {
                    attempts++
                    setTimeout(tryScroll, 150)
                }
            }
            setTimeout(tryScroll, 100)
        }
    }, [navigate, onItemClick])

    return (
        <Box className={cls.DocumentationSidebar}>
            <Box className={cls.header}>
                <Typography variant="h6" className={cls.title}>
                    📖 {t('doc_title')}
                </Typography>
                <Typography variant="caption" className={cls.subtitle}>
                    AI PBX Platform
                </Typography>
            </Box>

            <List className={cls.list}>
                {DOC_SECTIONS.map((section) => (
                    <Box key={section.id}>
                        <ListItem disablePadding>
                            <ListItemButton
                                selected={currentSection === section.id}
                                onClick={() => handleSectionClick(section.id, !!section.subsections)}
                                className={cls.sectionButton}
                            >
                                <ListItemText
                                    primary={t(section.titleKey)}
                                    className={cls.sectionText}
                                />
                                {section.subsections && (
                                    expandedSections.includes(section.id) ? (
                                        <ChevronDown size={18} className={cls.chevron} />
                                    ) : (
                                        <ChevronRight size={18} className={cls.chevron} />
                                    )
                                )}
                            </ListItemButton>
                        </ListItem>

                        {section.subsections && (
                            <Collapse
                                in={expandedSections.includes(section.id)}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="div" disablePadding className={cls.subsectionList}>
                                    {section.subsections.map((subsection, idx) => (
                                        <ListItem key={`${subsection.id}-${idx}`} disablePadding>
                                            <ListItemButton
                                                onClick={() => handleSubsectionClick(subsection.id, subsection.anchor)}
                                                className={cls.subsectionButton}
                                            >
                                                <ListItemText
                                                    primary={t(subsection.titleKey)}
                                                    className={cls.subsectionText}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </Box>
                ))}
            </List>

            <Box className={cls.footer}>
                <VStack gap="16" max>
                    <HStack gap="16" justify="between" max>
                        <LangSwitcher short />
                        <ThemeSwitcher />
                    </HStack>

                    {userData && (
                        <ListItemButton
                            onClick={() => navigate(getRouteMain())}
                            className={cls.backButton}
                        >
                            <ArrowLeft size={20} className={cls.backIcon} />
                            <ListItemText
                                primary={t('doc_back_to_app')}
                                className={cls.backText}
                            />
                        </ListItemButton>
                    )}
                </VStack>
            </Box>
        </Box>
    )
})

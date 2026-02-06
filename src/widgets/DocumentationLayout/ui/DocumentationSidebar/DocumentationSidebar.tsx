import { memo, useState } from 'react'
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
import cls from './DocumentationSidebar.module.scss'

interface DocSection {
    id: string
    titleKey: string
    subsections?: Array<{ id: string; titleKey: string }>
}

const DOC_SECTIONS: DocSection[] = [
    {
        id: 'getting-started',
        titleKey: 'Getting Started'
    },
    {
        id: 'dashboard',
        titleKey: 'Dashboard',
        subsections: [
            { id: 'dashboard-overview', titleKey: 'Overview' },
            { id: 'dashboard-metrics', titleKey: 'Metrics' },
            { id: 'dashboard-navigation', titleKey: 'Navigation' }
        ]
    },
    {
        id: 'assistants',
        titleKey: 'Assistants',
        subsections: [
            { id: 'assistants-create', titleKey: 'Creating Your First Assistant' },
            { id: 'assistants-config', titleKey: 'Configuration' },
            { id: 'assistants-models', titleKey: 'Model Selection' },
            { id: 'assistants-voices', titleKey: 'Voice Options' },
            { id: 'assistants-speech', titleKey: 'Speech Settings' },
            { id: 'assistants-publish', titleKey: 'Publishing' }
        ]
    },
    {
        id: 'tools',
        titleKey: 'Tools (Function Calling)',
        subsections: [
            { id: 'tools-understanding', titleKey: 'Understanding Tools' },
            { id: 'tools-create', titleKey: 'Creating Tools' },
            { id: 'tools-config', titleKey: 'Tool Configuration' },
            { id: 'tools-auth', titleKey: 'Authentication' },
            { id: 'tools-mcp', titleKey: 'MCP Servers' }
        ]
    },
    {
        id: 'playground',
        titleKey: 'Playground',
        subsections: [
            { id: 'playground-testing', titleKey: 'Testing Assistants' },
            { id: 'playground-use-cases', titleKey: 'Use Cases' }
        ]
    },
    {
        id: 'reports',
        titleKey: 'Reports & Analytics',
        subsections: [
            { id: 'reports-history', titleKey: 'Call History' },
            { id: 'reports-metrics', titleKey: 'Metrics' },
            { id: 'reports-visualizations', titleKey: 'Visualizations' },
            { id: 'reports-export', titleKey: 'Exporting Data' }
        ]
    },
    {
        id: 'payments',
        titleKey: 'Payments & Billing',
        subsections: [
            { id: 'payments-balance', titleKey: 'Balance Overview' },
            { id: 'payments-topup', titleKey: 'Top Up Balance' },
            { id: 'payments-notifications', titleKey: 'Notification Thresholds' },
            { id: 'payments-history', titleKey: 'Payment History' },
            { id: 'payments-organizations', titleKey: 'Organizations' }
        ]
    },
    {
        id: 'publish',
        titleKey: 'Publish & Integration',
        subsections: [
            { id: 'publish-overview', titleKey: 'Overview' },
            { id: 'publish-sips', titleKey: 'SIPs (VoIP)' },
            { id: 'publish-widgets', titleKey: 'Widgets (WebRTC)' },
            { id: 'publish-pbxs', titleKey: 'PBXs (Servers)' },
            { id: 'asterisk-config', titleKey: 'Asterisk Configuration' }
        ]
    }
]

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
        const parentSection = DOC_SECTIONS.find(section =>
            section.subsections?.some(sub => sub.id === currentSection)
        )
        return parentSection ? [parentSection.id] : []
    })

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        )
    }

    const handleSectionClick = (sectionId: string, hasSubsections: boolean) => {
        if (hasSubsections) {
            toggleSection(sectionId)
        } else {
            navigate(`/docs?section=${sectionId}`)
            onItemClick?.()
        }
    }

    const handleSubsectionClick = (subsectionId: string) => {
        navigate(`/docs?section=${subsectionId}`)
        onItemClick?.()
    }

    return (
        <Box className={cls.DocumentationSidebar}>
            <Box className={cls.header}>
                <Typography variant="h6" className={cls.title}>
                    {t('Documentation')}
                </Typography>
            </Box>

            <List className={cls.list}>
                {DOC_SECTIONS.map((section) => (
                    <Box key={section.id}>
                        <ListItem disablePadding>
                            <ListItemButton
                                selected={currentSection === section.id && !section.subsections}
                                onClick={() => handleSectionClick(section.id, !!section.subsections)}
                                className={cls.sectionButton}
                            >
                                <ListItemText
                                    primary={t(section.titleKey)}
                                    className={cls.sectionText}
                                />
                                {section.subsections && (
                                    expandedSections.includes(section.id) ? (
                                        <ChevronDown size={20} className={cls.chevron} />
                                    ) : (
                                        <ChevronRight size={20} className={cls.chevron} />
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
                                <List component="div" disablePadding>
                                    {section.subsections.map((subsection) => (
                                        <ListItem key={subsection.id} disablePadding>
                                            <ListItemButton
                                                selected={currentSection === subsection.id}
                                                onClick={() => handleSubsectionClick(subsection.id)}
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
                                primary={t('Back to App')}
                                className={cls.backText}
                            />
                        </ListItemButton>
                    )}
                </VStack>
            </Box>
        </Box>
    )
})

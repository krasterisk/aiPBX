import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Drawer, IconButton, useMediaQuery } from '@mui/material'
import { Menu as MenuIcon } from 'lucide-react'
import { DocumentationSidebar } from '../DocumentationSidebar/DocumentationSidebar'
import { DocumentationContent } from '../DocumentationContent/DocumentationContent'
import cls from './DocumentationLayout.module.scss'

export const DocumentationLayout = memo(() => {
    const { t } = useTranslation('docs')
    const isMobile = useMediaQuery('(max-width:960px)')
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    return (
        <Box className={cls.DocumentationLayout}>
            {isMobile && (
                <Box className={cls.mobileHeader}>
                    <IconButton
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={cls.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}

            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 300,
                            background: 'rgba(21, 28, 31, 0.8)',
                            backdropFilter: 'blur(20px)',
                            color: 'var(--text-redesigned)',
                            borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                        }
                    }}
                >
                    <DocumentationSidebar onItemClick={handleDrawerToggle} />
                </Drawer>
            ) : (
                <Box className={cls.sidebar}>
                    <DocumentationSidebar />
                </Box>
            )}

            <Box className={cls.content}>
                <DocumentationContent />
            </Box>
        </Box>
    )
})

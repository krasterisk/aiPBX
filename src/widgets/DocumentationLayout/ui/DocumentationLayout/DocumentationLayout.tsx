import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, SwipeableDrawer, IconButton, useMediaQuery } from '@mui/material'
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
                <SwipeableDrawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    onOpen={() => setMobileOpen(true)}
                    swipeAreaWidth={20}
                    disableSwipeToOpen
                    ModalProps={{
                        keepMounted: true
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 300,
                            background: 'var(--bg-redesigned)',
                            backdropFilter: 'blur(20px)',
                            color: 'var(--text-redesigned)',
                            borderRight: '1px solid var(--divider-solid)'
                        }
                    }}
                >
                    <DocumentationSidebar onItemClick={handleDrawerToggle} />
                </SwipeableDrawer>
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

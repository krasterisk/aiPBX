import React, { memo } from 'react'
import { MenubarItemType } from '../../model/types/menubar'
import cls from './MenubarItems.module.scss'
import { useTranslation } from 'react-i18next'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view'
import { useMenubarItems } from '../../model/selectors/getMenubarItems'
import { Drawer } from '@/shared/ui/mui/Drawer'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { ThemeSwitcher } from '@/entities/ThemeSwitcher'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import AppLogoV3 from '@/shared/assets/icons/aipbx_logo_v3.svg'

interface MenubarItemProps {
    className?: string
    isMobile?: boolean
    openDrawer?: boolean
    onDrawerClose?: () => void
}

export const MenubarItems = memo((props: MenubarItemProps) => {
    const {
        openDrawer = false,
        isMobile = false,
        onDrawerClose
    } = props

    const { t } = useTranslation()
    const menubarItemList = useMenubarItems()

    const renderNodes = (nodes: MenubarItemType[]) => (
        nodes.map((node) => {
            const content = (
                <TreeItem
                    key={node.path}
                    itemId={node.path}
                    sx={{
                        '& .MuiTreeItem-iconContainer': {
                            width: '24px !important',
                            marginRight: '0px !important',
                            flexShrink: 0,
                        },
                        '& .MuiTreeItem-label': {
                            paddingLeft: '0px !important',
                        },
                        // Не переопределяем padding-left у content через !important, 
                        // чтобы MUI мог применить отступ вложенности
                    }}
                    label={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0' }}>
                            {node.Icon && <node.Icon style={{ width: 18, height: 18, color: 'inherit' }} />}
                            <span style={{ fontSize: 'inherit', fontWeight: 'inherit' }}>{t(node.text)}</span>
                        </div>
                    }
                    onClick={(e) => {
                        if (!node.subItems && onDrawerClose) onDrawerClose()
                        if (node.subItems) e.stopPropagation()
                    }}
                >
                    {node.subItems ? renderNodes(node.subItems) : null}
                </TreeItem>
            )

            if (node.subItems) {
                return content
            }

            return (
                <AppLink
                    key={node.path}
                    to={node.path}
                    className={cls.itemLink}
                >
                    {content}
                </AppLink>
            )
        })
    )

    const tree = (
        <SimpleTreeView
            className={cls.menuContainer}
            style={{
                // @ts-ignore
                '--TreeView-itemChildrenIndentation': '32px'
            }}
            sx={{
                width: '100%',
                '& .MuiTreeItem-groupTransition': {
                    marginLeft: '15px !important',
                    borderLeft: '1px solid var(--glass-border-subtle) !important',
                },
            }}
        >
            {renderNodes(menubarItemList)}
        </SimpleTreeView>
    )

    if (isMobile) {
        return (
            <Drawer isOpen={openDrawer} onClose={onDrawerClose}>
                <VStack max gap="8">
                    <VStack max align="center" gap="8" className={cls.appLogo}>
                        <AppLogoV3 className={cls.logoIcon} />
                        <span className={cls.brandText}>AI PBX</span>
                    </VStack>
                    {tree}
                    <HStack className={cls.switchers} justify="between" gap="16" wrap="wrap">
                        <LangSwitcher short />
                        <ThemeSwitcher />
                    </HStack>
                </VStack>
            </Drawer>
        )
    }

    return (
        <>
            {tree}
        </>
    )
})

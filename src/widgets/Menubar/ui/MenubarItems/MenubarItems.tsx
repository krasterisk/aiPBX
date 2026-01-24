import React, { memo } from 'react'
import { MenubarItemType } from '../../model/types/menubar'
import cls from './MenubarItems.module.scss'
import { useTranslation } from 'react-i18next'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view'
import { useMenubarItems } from '../../model/selectors/getMenubarItems'
import { Drawer } from '@/shared/ui/mui/Drawer'
import { AppLogo } from '@/shared/ui/redesigned/AppLogo'
import { LangSwitcher } from '@/entities/LangSwitcher'
import { ThemeSwitcher } from '@/entities/ThemeSwitcher'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'

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
    // const isAuth = useSelector(getUserAuthData)
    const menubarItemList = useMenubarItems()

    const renderTree = (nodes: MenubarItemType[]) => (
        <SimpleTreeView className={cls.menuContainer}>

            {nodes.map((node) => (
                <AppLink
                    key={node.path}
                    to={node.path}
                // activeClassName={cls.active}
                >
                    <TreeItem
                        key={node.path}
                        itemId={node.path}
                        label={t(node.text)}
                        onClick={!node.subItems ? () => { if (onDrawerClose) onDrawerClose() } : undefined}
                        slots={{
                            icon: () => <node.Icon />
                        }}
                    >
                        {node.subItems ? renderTree(node.subItems) : null}
                    </TreeItem>
                </AppLink>
            ))}
        </SimpleTreeView>
    )

    if (isMobile) {
        return (
            <Drawer isOpen={openDrawer} onClose={onDrawerClose}>
                <VStack max style={{ height: '100%' }}>
                    <AppLogo
                        size={60}
                        variant="3"
                        className={cls.appLogo}
                    />
                    <div className={cls.brandText}>AI PBX</div>
                    {renderTree(menubarItemList)}
                    <HStack className={cls.switchers} justify="center" gap="16" wrap="wrap">
                        <LangSwitcher short />
                        <ThemeSwitcher />
                    </HStack>
                </VStack>
            </Drawer>
        )
    }

    return (
        <>
            {renderTree(menubarItemList)}
        </>
    )
})

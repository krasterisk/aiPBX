import React, { memo } from 'react'
import { MenubarItemType } from '../../model/types/menubar'
import cls from './MenubarItems.module.scss'
import { useTranslation } from 'react-i18next'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view'
import { useMenubarItems } from '../../model/selectors/getMenubarItems'
import { Drawer } from '@/shared/ui/mui/Drawer'

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
        <SimpleTreeView>
            {nodes.map((node) => (
                <AppLink
                    key={node.path}
                    to={node.path}
                    className={cls.MenubarItems}
                    // activeClassName={cls.active}
                >
                    <TreeItem
                        key={node.path}
                        nodeId={node.path}
                        label={t(node.text)}
                        onClick={!node.subItems ? () => { if (onDrawerClose) onDrawerClose() } : undefined}
                        // icon={<Icon Svg={node.Icon} />}
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
                {renderTree(menubarItemList)}
            </Drawer>
    )
  }

  return (
        <>
            {renderTree(menubarItemList)}
        </>
  )
})

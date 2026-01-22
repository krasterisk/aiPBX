import React from 'react'
import { SvgIconComponent } from '@mui/icons-material'

export interface MenubarItemType {
  path: string
  text: string
  Icon: React.VFC<React.SVGProps<SVGSVGElement>> | SvgIconComponent
  authOnly?: boolean
  subItems?: MenubarItemType[]
}

import { User } from '../../../User'
import { HTMLAttributeAnchorTarget } from 'react'
import { ToolTypesValues } from '../consts/consts'

export interface AllTools {
  count: number
  rows: Tool[]
}

export interface Tool {
  id?: string
  name?: string
  type?: string
  description?: string
  parameters?: ToolParameters
  toolData?: object
  strict?: boolean
  webhook?: string
  method?: string
  auth_type?: string
  auth_token?: string
  auth_login?: string
  auth_password?: string
  headers?: Record<string, string>
  user?: User
  userId?: string
  comment?: string
}

export interface ToolParameters {
  type: string
  properties: Record<string, ToolParam>
  required?: string[]
}

export interface ToolParam {
  type: string
  description?: string
  enum?: string[]
  required?: boolean
}

export interface ToolsListProps {
  className?: string
  target?: HTMLAttributeAnchorTarget
  isToolsLoading?: boolean
  isToolsError?: boolean
  tools?: AllTools
  onDelete?: (id: string) => void
  onRefetch?: () => void
}

export interface ToolType {
  value: ToolTypesValues
  descriptions: string
}

import { FC, lazy } from 'react'
import { ToolAddParameterModalProps } from './ToolAddParameterModal'

export const ToolAddParameterModalAsync = lazy<FC<ToolAddParameterModalProps>>(async () => await import('./ToolAddParameterModal'))

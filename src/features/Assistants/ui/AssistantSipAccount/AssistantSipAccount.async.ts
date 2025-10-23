import { FC, lazy } from 'react'
import { AssistantSipAccountProps } from './AssistantSipAccount'

export const AssistantSipAccountAsync = lazy<FC<AssistantSipAccountProps>>(async () => await import('./AssistantSipAccount'))

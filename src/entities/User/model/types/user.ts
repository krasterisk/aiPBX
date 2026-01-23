import { UserCurrencyValues, UserRolesValues } from '../consts/consts'
import { ContentView } from '../../../Content'
import { HTMLAttributeAnchorTarget } from 'react'

export interface ResetUserPasswordProps {
  resetPasswordLink: string
  password: string
}

export interface UserRoles {
  value: UserRolesValues
  description?: string
}

export interface UserCurrency {
  value: UserCurrencyValues
  description?: string
}

export interface ClientOptions {
  id: string
  name: string
}

export interface AllUsers {
  count: number
  rows: User[]
}

export interface User {
  id: string
  username?: string
  name?: string
  email?: string
  password?: string
  clientData?: string
  designed?: boolean
  avatar?: string
  balance?: number
  currency?: UserCurrencyValues
  token?: string
  roles?: UserRoles[]
  vpbxUser?: ClientOptions
  vpbx_user_id?: string
}

export interface UserSchema {
  authData?: User
  token?: string
  _mounted: boolean
  redesigned: boolean
}

export interface UsersListProps {
  className?: string
  target?: HTMLAttributeAnchorTarget
  isLoading?: boolean
  isError?: boolean
  view?: ContentView
  users?: AllUsers
  onDelete?: (id: string) => void
}

export interface AuthData {
  token: string
  user: User
}

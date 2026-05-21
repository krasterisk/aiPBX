import { UserCurrencyValues, UserRolesValues } from '../consts/consts'
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
  our_organization_id?: string
  ourOrganizationId?: string | number | null
  authType?: string
  /** Tenant owner l/s (read-only); same for all sub-users of the tenant */
  personalAccountNumber?: string | null
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
  users?: AllUsers
  onDelete?: (id: string) => void
}

export interface AuthData {
  token: string
  user: User
}

export interface UsageLimitProps {
  userId: string
  limitAmount: number
  emails: string[]
}

export interface CreateSubUserDto {
  email: string
  name: string
}

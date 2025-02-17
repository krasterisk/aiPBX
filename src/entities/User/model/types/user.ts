import { UserRolesValues } from '../consts/consts'

export interface UserRoles {
  id?: string
  value: UserRolesValues
}

export interface User {
  id: string
  username: string
  password?: string
  designed?: boolean
  avatar?: string
  token?: string
  roles?: UserRoles[]
  vpbx_user_id?: string
}

export interface UserSchema {
  authData?: User
  token?: string
  _mounted: boolean
  redesigned: boolean
}

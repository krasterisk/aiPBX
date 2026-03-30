import { StateSchema } from '@/app/providers/StoreProvider'
import { createSelector } from '@reduxjs/toolkit'
import { UserRolesValues } from '../consts/consts'

const getUserRoles = (state: StateSchema) => state.user.authData?.roles

export const getVpbxUser = (state: StateSchema) => state.user.authData?.vpbx_user_id || state.user.authData?.vpbxUser?.id
export const getUserId = (state: StateSchema) => state.user.authData?.id

export const getAllUserRoles = createSelector(getUserRoles, (roles) => {
  return roles?.map(role => role.value)
})

export const isUserAdmin = createSelector(getUserRoles, (roles) => {
  if (!roles) {
    return false
  }
  return roles.some(role => role.value === UserRolesValues.ADMIN)
})

export const isUserClient = createSelector(getUserRoles, (roles) => {
  if (!roles) {
    return false
  }

  return roles.some(role => role.value === UserRolesValues.CLIENT)
})

export const isUserUser = createSelector(getUserRoles, (roles) => {
  if (!roles) {
    return false
  }

  return roles.some(role => role.value === UserRolesValues.USER)
})

// Owner-user: has USER role and no parent (vpbx_user_id is missing or equals their own id)
export const isOwnerUser = createSelector(
  [getUserRoles, getVpbxUser, getUserId],
  (roles, vpbxUserId, userId) => {
    if (!roles) return false
    const isUser = roles.some(role => role.value === UserRolesValues.USER)
    return isUser && (!vpbxUserId || vpbxUserId === userId)
  }
)

// Sub-user: has USER role and has a parent (vpbx_user_id is present and not equal to their own id)
export const isSubUser = createSelector(
  [getUserRoles, getVpbxUser, getUserId],
  (roles, vpbxUserId, userId) => {
    if (!roles) return false
    const isUser = roles.some(role => role.value === UserRolesValues.USER)
    return isUser && !!vpbxUserId && vpbxUserId !== userId
  }
)

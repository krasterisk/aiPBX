import { StateSchema } from '@/app/providers/StoreProvider'
import { createSelector } from '@reduxjs/toolkit'
import { UserRolesValues } from '../consts/consts'

const getUserRoles = (state: StateSchema) => state.user.authData?.roles

export const getVpbxUser = (state: StateSchema) => state.user.authData?.vpbx_user_id

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

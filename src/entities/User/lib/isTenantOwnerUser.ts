interface TenantOwnerCheck {
  id?: string | number | null
  vpbx_user_id?: string | number | null
}

/** Account with its own wallet: tenant owner or platform admin, not a sub-user. */
export function isTenantOwnerUser (user: TenantOwnerCheck | null | undefined): boolean {
  if (user?.id == null || user.id === '') return false
  const parentId = user.vpbx_user_id
  return parentId == null || parentId === '' || String(parentId) === String(user.id)
}

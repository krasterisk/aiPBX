import { isTenantOwnerUser } from './isTenantOwnerUser'

describe('isTenantOwnerUser', () => {
  it('returns true for a user without a parent tenant', () => {
    expect(isTenantOwnerUser({
      id: '10',
      vpbx_user_id: null,
    })).toBe(true)
  })

  it('returns true when vpbx_user_id equals own id', () => {
    expect(isTenantOwnerUser({
      id: '10',
      vpbx_user_id: '10',
    })).toBe(true)
  })

  it('returns false for a sub-user', () => {
    expect(isTenantOwnerUser({
      id: '11',
      vpbx_user_id: '10',
    })).toBe(false)
  })

  it('returns true for a platform admin with own wallet', () => {
    expect(isTenantOwnerUser({
      id: '1',
      vpbx_user_id: null,
    })).toBe(true)
  })

  it('returns false without an id', () => {
    expect(isTenantOwnerUser({ vpbx_user_id: null })).toBe(false)
  })
})

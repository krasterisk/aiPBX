export {
  userReducer,
  userActions
} from './model/slice/userSlice'

export {
  isUserOperator,
  isUserUser,
  isUserAdmin,
  isUserSupervisor,
  isUserVPBXAdmin,
  getAllUserRoles
} from './model/selectors/roleSelector'

export type {
  User,
  UserSchema,
  UserRoles
} from './model/types/user'
export { getUserAuthData } from './model/selectors/getUserAuthData/getUserAuthData'
export { getUserMounted } from './model/selectors/getUserMounted/getUserMounted'
export { getUserRedesign } from './model/selectors/getUserRedesinged/getUserRedesigned'
export { UserRolesValues } from './model/consts/consts'

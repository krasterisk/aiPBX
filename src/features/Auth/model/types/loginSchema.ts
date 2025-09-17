export interface LoginSchema {
  username: string
  name: string
  activationCode: string
  password: string
  email: string
  isLoading: boolean
  error?: string
}

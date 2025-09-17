export interface SignupSchema {
  activationCode: string
  password: string
  email: string
  isLoading: boolean
  error?: string
}

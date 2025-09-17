import { User } from '@/entities/User'

export interface AuthResponse {
  token: string
  user: User
}

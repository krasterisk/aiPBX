import { User } from '@/entities/User'

export interface Price {
    id: number
    userId: number
    realtime: number
    analytic: number
    stt: number
    userName?: string
    createdAt?: string
    updatedAt?: string
    user?: User
}

export interface CreatePriceDto {
    userId: number
    realtime: number
    analytic: number
    stt: number
}

export interface UpdatePriceDto {
    realtime?: number
    analytic?: number
    stt?: number
}

export interface Event {
  channelId: string
  callerId: string
  type: string
  event_id: string
  timestamp?: string
  response?: {
    usage?: {
      total_tokens?: number
    }
  }
}

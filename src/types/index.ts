export interface User {
  id?: number
  username: string
  profile?: {
    first_name?: string
    specialization?: string
    specialization_display?: string
    bio?: string
    fee?: string
  }
}

export interface AuthResponse {
  access: string
  user: User
}

export interface ChatMessage {
  id: string
  sender: string
  text: string
  timestamp: number
  own: boolean
}

export type SocketStatus = 'connecting' | 'authorizing' | 'connected' | 'disconnected' | 'error'

export interface ServerEvent {
  type: string
  payload?: {
    username?: string
    sender?: string
    text?: string
    timestamp?: number
    detail?: string
  }
}

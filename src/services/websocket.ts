import type { ServerEvent } from '../types'

export const CHAT_SOCKET_URL = 'wss://inai-col3.fishrungames.com/chat/'

export interface ChatSocketHandlers {
  onStatus: (status: 'connecting' | 'authorizing' | 'connected' | 'disconnected' | 'error') => void
  onMessage: (event: ServerEvent) => void
  onError: () => void
}

export function connectChat(token: string, handlers: ChatSocketHandlers): WebSocket {
  handlers.onStatus('connecting')
  const socket = new WebSocket(CHAT_SOCKET_URL)

  socket.addEventListener('open', () => {
    handlers.onStatus('authorizing')
    // По протоколу AUTH должен быть первым сообщением после открытия соединения.
    socket.send(JSON.stringify({
      type: 'AUTH',
      payload: { token },
    }))
  })

  socket.addEventListener('message', (event: MessageEvent<string>) => {
    try {
      const data = JSON.parse(event.data) as ServerEvent
      if (data.type === 'AUTH_SUCCESS') {
        handlers.onStatus('connected')
      } else if (data.type === 'NEW_MESSAGE') {
        handlers.onMessage(data)
      } else if (data.type === 'ERROR' || data.type === 'AUTH_ERROR') {
        handlers.onError()
      } else {
        handlers.onMessage(data)
      }
    } catch {
      // Игнорируем некорректный JSON от сервера.
    }
  })

  socket.addEventListener('close', () => handlers.onStatus('disconnected'))
  socket.addEventListener('error', () => {
    handlers.onStatus('error')
    handlers.onError()
  })

  return socket
}

export function sendChatMessage(socket: WebSocket, text: string) {
  if (socket.readyState !== WebSocket.OPEN) {
    throw new Error('Соединение с чатом не готово')
  }
  socket.send(JSON.stringify({
    type: 'CHAT_MESSAGE',
    payload: { text },
  }))
}

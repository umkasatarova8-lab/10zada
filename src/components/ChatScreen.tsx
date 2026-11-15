import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { ChatMessage, SocketStatus, User } from '../types'

interface Props {
  user: User
  messages: ChatMessage[]
  status: SocketStatus
  error: string
  onSend: (text: string) => void
  onLogout: () => void
}

const statusText: Record<SocketStatus, string> = {
  connecting: 'Подключение…',
  authorizing: 'Проверка доступа…',
  connected: 'В сети',
  disconnected: 'Нет соединения',
  error: 'Ошибка соединения',
}

function initials(username: string) {
  return username.slice(0, 1).toUpperCase()
}

function timeLabel(timestamp: number) {
  return new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp))
}

export function ChatScreen({ user, messages, status, error, onSend, onLogout }: Props) {
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || status !== 'connected') return
    onSend(text)
    setDraft('')
  }

  return (
    <main className="chat-shell">
      <aside className="sidebar">
        <div className="sidebar-brand"><div className="brand-mark small">p</div><span>PULSE</span></div>
        <div className="sidebar-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
        <div className="room-item selected">
          <div className="room-icon">#</div>
          <div><strong>общий-чат</strong><small>Групповое общение</small></div>
          <span className="room-dot" />
        </div>
        <div className="sidebar-note">
          <div className="note-icon">✳</div>
          <strong>Добро пожаловать!</strong>
          <p>Здесь каждое сообщение сразу появляется у всех подключённых участников.</p>
        </div>
        <div className="sidebar-user">
          <div className="user-avatar">{initials(user.username)}</div>
          <div className="user-meta"><strong>{user.username}</strong><small>Авторизован</small></div>
          <button className="icon-button" onClick={onLogout} title="Выйти" aria-label="Выйти">↪</button>
        </div>
      </aside>

      <section className="chat-main">
        <header className="chat-header">
          <div>
            <div className="channel-name"><span>#</span> общий-чат</div>
            <div className="channel-subtitle">Общий канал для всех участников</div>
          </div>
          <div className={`connection-state ${status}`}>
            <span className="connection-dot" /> {statusText[status]}
          </div>
        </header>

        <div className="messages-area">
          <div className="day-divider"><span>СЕГОДНЯ</span></div>
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✳</div>
              <h2>Начни разговор</h2>
              <p>Пока сообщений нет. Напиши первое сообщение в общий чат.</p>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((message) => (
                <article className={message.own ? 'message own' : 'message'} key={message.id}>
                  <div className="message-avatar">{initials(message.sender)}</div>
                  <div className="message-content">
                    <div className="message-heading">
                      <strong>{message.sender}</strong>
                      <time>{timeLabel(message.timestamp)}</time>
                      {message.own && <span className="you-label">ВЫ</span>}
                    </div>
                    <p>{message.text}</p>
                  </div>
                </article>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <footer className="composer-wrap">
          {error && <div className="inline-error">{error}</div>}
          {status !== 'connected' && <div className="connection-hint">Отправка сообщений доступна после авторизации в WebSocket.</div>}
          <form className="composer" onSubmit={submit}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={status === 'connected' ? 'Написать сообщение…' : 'Ожидание подключения…'}
              disabled={status !== 'connected'}
              aria-label="Текст сообщения"
            />
            <button className="send-button" type="submit" disabled={status !== 'connected' || !draft.trim()} aria-label="Отправить сообщение">↑</button>
          </form>
          <div className="composer-caption">Enter — отправить сообщение <span>Сообщения видны всем участникам</span></div>
        </footer>
      </section>
    </main>
  )
}

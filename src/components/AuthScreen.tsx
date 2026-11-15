import { useState, type FormEvent } from 'react'

interface Props {
  onAuthenticate: (username: string, password: string, mode: 'login' | 'register') => Promise<void>
  busy: boolean
  error: string
}

export function AuthScreen({ onAuthenticate, busy, error }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onAuthenticate(username.trim(), password, mode)
  }

  return (
    <main className="auth-layout">
      <section className="auth-card">
        <div className="brand-mark">p</div>
        <div className="eyebrow">PULSE · GROUP CHAT</div>
        <h1>{mode === 'login' ? 'С возвращением' : 'Создать аккаунт'}</h1>
        <p className="muted auth-description">
          {mode === 'login'
            ? 'Войди, чтобы присоединиться к общему разговору.'
            : 'Зарегистрируйся и общайся с другими участниками.'}
        </p>

        <div className="auth-tabs" role="tablist" aria-label="Тип авторизации">
          <button className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => setMode('login')} type="button">Вход</button>
          <button className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => setMode('register')} type="button">Регистрация</button>
        </div>

        <form onSubmit={submit} className="auth-form">
          <label>
            Имя пользователя
            <input
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Например - Умкаааа"
              minLength={1}
              required
            />
          </label>
          <label>
            Пароль
            <input
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Введи пароль"
              minLength={1}
              required
            />
          </label>
          {error && <div className="alert" role="alert">{error}</div>}
          <button className="primary-button" disabled={busy} type="submit">
            {busy ? 'Подождите…' : mode === 'login' ? 'Войти в чат' : 'Создать аккаунт'}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
        <p className="auth-footnote">Защищённое подключение · JWT + WebSocket</p>
      </section>
      <aside className="auth-aside">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="aside-content">
          <div className="live-pill"><span /> ОБЩЕНИЕ В РЕАЛЬНОМ ВРЕМЕНИ</div>
          <h2>Один чат.<br /><em>Все на связи.</em></h2>
          <p>Пространство для быстрых разговоров, идей и командного общения.</p>
          <div className="aside-bottom">
            <div className="avatar-stack"><span>А</span><span>М</span><span>Е</span><span>+</span></div>
            <small>Твой групповой чат начинается здесь</small>
          </div>
        </div>
      </aside>
    </main>
  )
}

import type { AuthResponse, User } from '../types'

export const API_BASE = 'https://inai-col3.fishrungames.com'

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  const raw = await response.text()
  let data: unknown = {}
  try {
    data = raw ? JSON.parse(raw) : {}
  } catch {
    data = { detail: raw }
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'detail' in data
        ? String((data as { detail: unknown }).detail)
        : `Ошибка запроса (${response.status})`
    throw new Error(message)
  }

  return data as T
}

export function register(username: string, password: string) {
  return request<AuthResponse>('/api/register/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function login(username: string, password: string) {
  return request<AuthResponse>('/api/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function getProfile(token: string) {
  return request<User>('/api/profile/', { method: 'GET' }, token)
}

export function refreshAccessToken() {
  return request<{ access: string }>('/api/token/refresh/', { method: 'POST' })
}

export function logout(token: string) {
  return request<{ detail: string }>('/api/logout/', { method: 'POST' }, token)
}

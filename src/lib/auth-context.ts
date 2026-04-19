import { createContext, useContext } from 'react'
import { pb } from './pocketbase'

export type AuthUser = { id: string; email: string } | null

export type AuthContextValue = {
  user: AuthUser
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function readUser(): AuthUser {
  const record = pb.authStore.record
  if (!record) return null
  const email = typeof record.email === 'string' ? record.email : ''
  return { id: record.id, email }
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

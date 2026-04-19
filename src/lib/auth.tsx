import { useEffect, useState, type ReactNode } from 'react'
import { pb } from './pocketbase'
import { AuthContext, readUser, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(readUser())
  const [token, setToken] = useState<string | null>(pb.authStore.token || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(readUser())
      setToken(pb.authStore.token || null)
    })

    async function refresh() {
      if (!pb.authStore.isValid) {
        setLoading(false)
        return
      }
      try {
        await pb.collection('users').authRefresh()
      } catch {
        pb.authStore.clear()
      } finally {
        setLoading(false)
      }
    }
    refresh()

    return () => unsubscribe()
  }, [])

  const login: AuthContextValue['login'] = async (email, password) => {
    await pb.collection('users').authWithPassword(email, password)
  }

  const register: AuthContextValue['register'] = async (email, password) => {
    await pb.collection('users').create({ email, password, passwordConfirm: password })
    await pb.collection('users').authWithPassword(email, password)
  }

  const logout = () => {
    pb.authStore.clear()
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

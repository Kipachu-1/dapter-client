import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth-context'

const PUBLIC_ROUTES = new Set(['/login', '/register'])

export function AuthGate() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isPublic = PUBLIC_ROUTES.has(location.pathname)

  useEffect(() => {
    if (loading) return
    if (!user && !isPublic) {
      navigate({ to: '/login' })
    }
    if (user && isPublic) {
      navigate({ to: '/' })
    }
  }, [loading, user, isPublic, navigate])

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center px-6">
        <p className="text-xs text-muted-foreground">Loading…</p>
      </main>
    )
  }
  if (!user && !isPublic) return null

  return <Outlet />
}

import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <form onSubmit={onSubmit} className="flex w-full max-w-xs flex-col gap-3">
        <div className="flex flex-col items-center gap-1">
          <h1 className="font-heading text-sm font-medium uppercase">Sign in</h1>
          <p className="text-xs text-muted-foreground">Welcome back to dapter</p>
        </div>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="bg-transparent px-3 py-2 text-xs ring-1 ring-foreground/10 outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="bg-transparent px-3 py-2 text-xs ring-1 ring-foreground/10 outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <p className="text-[10px] text-destructive">{error}</p>}
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
        <p className="text-center text-[10px] text-muted-foreground">
          No account?{' '}
          <Link to="/register" className="underline">
            Create one
          </Link>
        </p>
      </form>
    </main>
  )
}

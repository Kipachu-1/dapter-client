import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { haptics } from '@/lib/haptics'

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
      haptics.success()
      navigate({ to: '/' })
    } catch (err) {
      haptics.error()
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex flex-1 flex-col justify-center overflow-y-auto px-6 py-8">
      <form onSubmit={onSubmit} className="flex w-full max-w-xs flex-col gap-3 self-center">
        <div className="flex flex-col items-center gap-1">
          <h1 className="h2 uppercase">Sign in</h1>
          <p className="text-xs text-muted-foreground">Welcome back to dapter</p>
        </div>
        <Field label="Email" error={undefined}>
          {(p) => (
            <Input
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="off"
              autoCorrect="off"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              {...p}
            />
          )}
        </Field>
        <Field label="Password" error={error ?? undefined}>
          {(p) => (
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              {...p}
            />
          )}
        </Field>
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
        <p className="text-center text-xxs text-muted-foreground">
          No account?{' '}
          <Link to="/register" className="underline">
            Create one
          </Link>
        </p>
      </form>
    </main>
  )
}

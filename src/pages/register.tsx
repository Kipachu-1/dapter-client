import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { haptics } from '@/lib/haptics'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      haptics.error()
      setError('Password must be at least 8 characters')
      return
    }
    setSubmitting(true)
    try {
      await register(email, password)
      haptics.success()
      navigate({ to: '/' })
    } catch (err) {
      haptics.error()
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex flex-1 flex-col justify-center overflow-y-auto px-6 py-8">
      <form onSubmit={onSubmit} className="flex w-full max-w-xs flex-col gap-3 self-center">
        <div className="flex flex-col items-center gap-1">
          <h1 className="h2 uppercase">Create account</h1>
          <p className="text-xs text-muted-foreground">Join dapter</p>
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
              autoComplete="new-password"
              placeholder="••••••••"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              {...p}
            />
          )}
        </Field>
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create account'}
        </Button>
        <p className="text-center text-xxs text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  )
}

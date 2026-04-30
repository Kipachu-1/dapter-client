import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
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
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <form onSubmit={onSubmit} className="flex w-full max-w-xs flex-col gap-3">
        <div className="flex flex-col items-center gap-1">
          <h1 className="font-heading text-sm font-medium uppercase">Create account</h1>
          <p className="text-xs text-muted-foreground">Join dapter</p>
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
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 chars)"
          className="bg-transparent px-3 py-2 text-xs ring-1 ring-foreground/10 outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <p className="text-[10px] text-destructive">{error}</p>}
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create account'}
        </Button>
        <p className="text-center text-[10px] text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  )
}

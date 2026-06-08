import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { getTheme, setTheme, type Theme } from '@/lib/theme'
import { haptics } from '@/lib/haptics'
import { ArrowLeft, LogOut, Monitor, Moon, Sun } from 'lucide-react'

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Monitor }[] = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
]

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [theme, setThemeState] = useState<Theme>(getTheme())

  function selectTheme(t: Theme) {
    if (t === theme) return
    haptics.selection()
    setTheme(t)
    setThemeState(t)
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon-md" aria-label="Back to home" render={<Link to="/" />}>
          <ArrowLeft />
        </Button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="h2">Settings</h1>
          <p className="truncate text-xs text-muted-foreground">Appearance &amp; account</p>
        </div>
      </header>

      <div
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
      >
        <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
          <section className="flex flex-col gap-2">
            <span className="label-mono">Appearance</span>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme">
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
                const active = theme === value
                return (
                  <Button
                    key={value}
                    variant={active ? 'default' : 'outline'}
                    role="radio"
                    aria-checked={active}
                    className="h-auto flex-col gap-1.5 py-3"
                    onClick={() => selectTheme(value)}
                  >
                    <Icon className="size-4" />
                    <span className="text-xs">{label}</span>
                  </Button>
                )
              })}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <span className="label-mono">Account</span>
            <div className="flex items-center gap-3 px-3 py-2.5 ring-1 ring-foreground/10">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="label-mono">Signed in as</span>
                <span className="truncate text-sm">{user?.email ?? '—'}</span>
              </div>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              aria-label="Sign out"
              onClick={() => {
                haptics.medium()
                logout()
              }}
            >
              <LogOut />
              Sign out
            </Button>
          </section>
        </div>
      </div>
    </main>
  )
}

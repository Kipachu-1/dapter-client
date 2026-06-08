export type Theme = 'system' | 'light' | 'dark'

const KEY = 'dapter-theme'

export function getTheme(): Theme {
  const v = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null
  return v === 'light' || v === 'dark' ? v : 'system'
}

function prefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

export function resolveDark(theme: Theme = getTheme()): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return prefersDark()
}

export function applyTheme(theme: Theme = getTheme()): void {
  document.documentElement.classList.toggle('dark', resolveDark(theme))
}

export function setTheme(theme: Theme): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, theme)
  applyTheme(theme)
}

/** Apply the saved theme at startup and keep 'system' in sync with the OS. */
export function initTheme(): void {
  applyTheme()
  if (typeof window === 'undefined') return
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (getTheme() === 'system') applyTheme('system')
    })
}

import { AuthProvider } from '@/lib/auth'
import { AuthGate } from './auth-gate'

export function RootLayout() {
  return (
    <AuthProvider>
      <div className="flex h-dvh flex-col overflow-hidden" style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:bg-background focus:px-2 focus:py-1 focus:text-xs focus:ring-1 focus:ring-ring"
        >
          Skip to main content
        </a>
        <div id="main" tabIndex={-1} className="flex flex-1 flex-col overflow-hidden outline-none">
          <AuthGate />
        </div>
      </div>
    </AuthProvider>
  )
}

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
        <AuthGate />
      </div>
    </AuthProvider>
  )
}

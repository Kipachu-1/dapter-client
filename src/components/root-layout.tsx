import { Outlet } from '@tanstack/react-router'

export function RootLayout() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden" style={{
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
    }}>
      <Outlet />
    </div>
  )
}

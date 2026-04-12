import { QueryClient } from '@tanstack/react-query'
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import App from './app'

type RouterContext = {
  queryClient: QueryClient
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

const routeTree = rootRoute.addChildren([indexRoute])

export const router = createRouter({
  routeTree,
  context: {
    queryClient: undefined!,
  },
  defaultPreload: 'intent',
})

function RootLayout() {
  return <Outlet />
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

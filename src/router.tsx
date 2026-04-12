import { QueryClient } from '@tanstack/react-query'
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import App from './app'
import FlashcardsListPage from './pages/flashcards-list'
import FlashcardsPage from './pages/flashcards'
import QuizzesListPage from './pages/quizzes-list'
import QuizPage from './pages/quiz'

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

const flashcardsListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/flashcards',
  component: FlashcardsListPage,
})

const flashcardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/flashcards/$deckId',
  component: FlashcardsPage,
})

const quizzesListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quizzes',
  component: QuizzesListPage,
})

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quizzes/$quizId',
  component: QuizPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  flashcardsListRoute,
  flashcardsRoute,
  quizzesListRoute,
  quizRoute,
])

export const router = createRouter({
  routeTree,
  context: {
    queryClient: undefined!,
  },
  defaultPreload: 'intent',
})

function RootLayout() {
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

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

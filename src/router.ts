import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { RootLayout } from './components/root-layout'
import App from './app'
import FlashcardsListPage from './pages/flashcards-list'
import FlashcardsPage from './pages/flashcards'
import QuizzesListPage from './pages/quizzes-list'
import QuizPage from './pages/quiz'
import GeneratePage from './pages/generate'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import ProcessingPage from './pages/processing'

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
  path: '/flashcards/$id',
  component: FlashcardsPage,
})

const quizzesListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quizzes',
  component: QuizzesListPage,
})

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quizzes/$id',
  component: QuizPage,
})

const generateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/generate',
  component: GeneratePage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const processingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/processing/$target/$id',
  component: ProcessingPage,
  parseParams: (params) => ({
    target: (params.target === 'quizzes' ? 'quizzes' : 'flashcards') as 'flashcards' | 'quizzes',
    id: String(params.id),
  }),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  flashcardsListRoute,
  flashcardsRoute,
  quizzesListRoute,
  quizRoute,
  generateRoute,
  loginRoute,
  registerRoute,
  processingRoute,
])

export const router = createRouter({
  routeTree,
  context: {
    queryClient: undefined!,
  },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

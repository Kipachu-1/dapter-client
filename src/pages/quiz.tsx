import { QuizViewer } from '@/components/quiz/index'
import { Button } from '@/components/ui/button'
import { mockQuizzes } from '@/lib/mock/quizzes'
import { Link, getRouteApi, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

const route = getRouteApi('/quizzes/$quizId')

export default function QuizPage() {
  const { quizId } = route.useParams()
  const router = useRouter()
  const quiz = mockQuizzes[Number(quizId)]

  if (!quiz) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-muted-foreground">Quiz not found.</p>
        <Button variant="outline" size="sm" render={<Link to="/quizzes" />}>
          <ArrowLeft />
          Back
        </Button>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon-sm" render={<Link to="/quizzes" />}>
          <ArrowLeft />
        </Button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-heading truncate text-sm font-medium">{quiz.title}</h1>
          {quiz.description && (
            <p className="truncate text-[10px] text-muted-foreground">{quiz.description}</p>
          )}
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-4">
        <QuizViewer quiz={quiz} onExit={() => router.navigate({ to: '/quizzes' })} />
      </div>
    </main>
  )
}

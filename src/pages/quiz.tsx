import { QuizViewer } from '@/components/quiz/index'
import { Button } from '@/components/ui/button'
import { useQuiz } from '@/lib/api/hooks'
import type { Quiz } from '@/lib/schemas/quiz'
import { Link, getRouteApi, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useMemo } from 'react'

const route = getRouteApi('/quizzes/$id')

export default function QuizPage() {
  const { id } = route.useParams()
  const router = useRouter()
  const { data, isLoading, error } = useQuiz(id)

  const quiz: Quiz | undefined = useMemo(() => {
    if (!data || data.status !== 'COMPLETED' || data.questions.length === 0) return undefined
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      questions: data.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        tags: q.tags,
        imageUrls: q.imageUrls,
      })),
    }
  }, [data])

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </main>
    )
  }

  if (error || !quiz) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-muted-foreground">
          {error ? error.message : data?.status === 'FAILED' ? (data.error ?? 'Generation failed') : 'Quiz not ready.'}
        </p>
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

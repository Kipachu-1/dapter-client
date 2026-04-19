import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAllQuizzes, useDocuments } from '@/lib/api/hooks'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Play } from 'lucide-react'

export default function QuizzesListPage() {
  const docs = useDocuments()
  const completedIds = (docs.data ?? [])
    .filter((d) => d.status === 'COMPLETED')
    .map((d) => d.documentId)
  const quizQueries = useAllQuizzes(completedIds)

  const quizzes = quizQueries.flatMap((q, i) => {
    const docId = completedIds[i]
    if (!docId) return []
    if (q.data?.status !== 'COMPLETED') return []
    return q.data.quizzes.map((quiz) => ({ docId, quiz }))
  })

  const isLoading = docs.isLoading || quizQueries.some((q) => q.isLoading)

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-heading text-sm font-medium">Quizzes</h1>
          <p className="text-[10px] text-muted-foreground">
            Pick a quiz to test yourself
          </p>
        </div>
        <Button variant="ghost" size="sm" render={<Link to="/" />}>
          <ArrowLeft />
          Home
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          {isLoading && (
            <p className="text-center text-xs text-muted-foreground">Loading…</p>
          )}
          {!isLoading && quizzes.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              No quizzes yet. Generate some from the home screen.
            </p>
          )}
          {quizzes.map(({ docId, quiz }) => (
            <Card key={`${docId}:${quiz.id}`}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                {quiz.description && (
                  <CardDescription>{quiz.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Badge variant="secondary">
                  {quiz.questions.length} questions
                </Badge>
                <Button
                  size="sm"
                  render={
                    <Link
                      to="/quizzes/$quizId"
                      params={{ quizId: `${docId}__${quiz.id}` }}
                    />
                  }
                >
                  <Play />
                  Start
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

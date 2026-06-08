import { useEffect } from 'react'
import { Link, getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, BookOpen, BookText, ClipboardList, Loader2 } from 'lucide-react'
import { useFlashcardsStatus, useNotesStatus, useQuizStatus } from '@/lib/api/hooks'

const route = getRouteApi('/processing/$target/$id')

export default function ProcessingPage() {
  const { target, id } = route.useParams()
  const navigate = useNavigate()

  const flashcardsStatus = useFlashcardsStatus(target === 'flashcards' ? id : undefined)
  const quizStatus = useQuizStatus(target === 'quizzes' ? id : undefined)
  const notesStatus = useNotesStatus(target === 'notes' ? id : undefined)
  const { data, error } =
    target === 'flashcards'
      ? flashcardsStatus
      : target === 'quizzes'
        ? quizStatus
        : notesStatus

  useEffect(() => {
    if (data?.status !== 'COMPLETED') return
    if (target === 'flashcards') {
      navigate({ to: '/flashcards/$id', params: { id } })
    } else if (target === 'quizzes') {
      navigate({ to: '/quizzes/$id', params: { id } })
    } else {
      navigate({ to: '/notes/$id', params: { id } })
    }
  }, [data, target, id, navigate])

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <Button
          variant="ghost"
          size="icon-md"
          aria-label="Back to generate"
          render={<Link to="/generate" />}
        >
          <ArrowLeft />
        </Button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="h2">Processing</h1>
          <p className="flex min-w-0 items-center gap-1 truncate text-xs text-muted-foreground">
            Generating your{' '}
            <span className="inline-flex items-center gap-1">
              {target === 'quizzes' ? (
                <ClipboardList className="size-3" />
              ) : target === 'notes' ? (
                <BookText className="size-3" />
              ) : (
                <BookOpen className="size-3" />
              )}
              {target}
            </span>
            …
          </p>
        </div>
      </header>

      <div
        className="flex flex-1 flex-col items-center justify-center gap-4 px-4"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {error ? (
          <>
            <p className="text-xs text-destructive">{error.message}</p>
            <Button variant="outline" size="sm" render={<Link to="/generate" />}>
              Back
            </Button>
          </>
        ) : data?.status === 'FAILED' ? (
          <>
            <p className="select-text text-xs text-destructive">
              {data.error ?? 'Processing failed'}
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" render={<Link to="/generate" />}>
                Start over
              </Button>
              <Button
                variant="outline"
                size="sm"
                render={
                  <Link
                    to={
                      target === 'quizzes'
                        ? '/quizzes'
                        : target === 'notes'
                          ? '/notes'
                          : '/flashcards'
                    }
                  />
                }
              >
                {target === 'quizzes' ? (
                  <ClipboardList />
                ) : target === 'notes' ? (
                  <BookText />
                ) : (
                  <BookOpen />
                )}
                View all
              </Button>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <div className="h-1.5 w-32 overflow-hidden bg-muted">
              <div className="h-full w-1/2 bg-primary/60 animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground animate-pulse">
              {data?.status === 'COMPLETED' ? 'Done — loading…' : 'Working on it…'}
            </p>
            <Button
              size="sm"
              variant="outline"
              render={
                <Link
                  to={
                    target === 'quizzes'
                      ? '/quizzes'
                      : target === 'notes'
                        ? '/notes'
                        : '/flashcards'
                  }
                />
              }
            >
              {target === 'quizzes' ? <ClipboardList /> : target === 'notes' ? <BookText /> : <BookOpen />}
              View {target}
              <ArrowRight />
            </Button>
          </>
        )}
      </div>
    </main>
  )
}

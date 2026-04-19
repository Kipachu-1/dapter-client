import { useEffect } from 'react'
import { Link, getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useDocumentStatus } from '@/lib/api/hooks'

const route = getRouteApi('/processing/$documentId')

export default function ProcessingPage() {
  const { documentId } = route.useParams()
  const { target } = route.useSearch()
  const navigate = useNavigate()
  const { data, error } = useDocumentStatus(documentId)

  useEffect(() => {
    if (data?.status === 'COMPLETED') {
      navigate({
        to: target === 'quizzes' ? '/quizzes' : '/flashcards',
      })
    }
  }, [data, target, navigate])

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon-sm" render={<Link to="/generate" />}>
          <ArrowLeft />
        </Button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-heading text-sm font-medium">Processing</h1>
          <p className="truncate text-[10px] text-muted-foreground">
            Generating your {target}…
          </p>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        {error ? (
          <>
            <p className="text-xs text-destructive">{error.message}</p>
            <Button variant="outline" size="sm" render={<Link to="/generate" />}>
              Back
            </Button>
          </>
        ) : data?.status === 'FAILED' ? (
          <>
            <p className="text-xs text-destructive">
              {data.error ?? 'Processing failed'}
            </p>
            <Button variant="outline" size="sm" render={<Link to="/generate" />}>
              Try again
            </Button>
          </>
        ) : (
          <>
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {data?.status === 'COMPLETED' ? 'Done — loading…' : 'Working on it…'}
            </p>
          </>
        )}
      </div>
    </main>
  )
}

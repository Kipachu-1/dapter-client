import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAllQuizzes, useDocuments } from '@/lib/api/hooks'
import type { DocumentListItem, StageStatus } from '@/lib/api/types'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Play } from 'lucide-react'

type StageView = {
  doc: DocumentListItem
  status: StageStatus
  error?: string
}

export default function QuizzesListPage() {
  const docs = useDocuments()
  const docIds = (docs.data ?? []).map((d) => d.documentId)
  const queries = useAllQuizzes(docIds)

  const stages: StageView[] = (docs.data ?? []).map((doc, i) => {
    const stage = queries[i]?.data
    const raw = stage?.status ?? 'PENDING'
    const status: StageStatus =
      doc.status === 'FAILED' && (raw === 'PENDING' || raw === 'PROCESSING') ? 'FAILED' : raw
    return { doc, status, error: stage?.error }
  })

  const inProgress = stages.filter((s) => s.status === 'PENDING' || s.status === 'PROCESSING')
  const failed = stages.filter((s) => s.status === 'FAILED')

  const quizzes = stages.flatMap((s, i) => {
    if (s.status !== 'COMPLETED') return []
    return (queries[i]?.data?.quizzes ?? []).map((quiz) => ({ docId: s.doc.documentId, quiz }))
  })

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon-sm" render={<Link to="/" />}>
          <ArrowLeft />
        </Button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-heading text-sm font-medium">Quizzes</h1>
          <p className="truncate text-[10px] text-muted-foreground">Pick a quiz to test yourself</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          {docs.isLoading && (
            <p className="text-center text-xs text-muted-foreground">Loading…</p>
          )}

          {inProgress.map((s) => (
            <Card key={`p-${s.doc.documentId}`}>
              <CardContent className="flex items-center gap-2 py-3">
                <Loader2 className="size-3 shrink-0 animate-spin text-muted-foreground" />
                <p className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
                  Generating quizzes for <span className="font-medium">{s.doc.fileName}</span>…
                </p>
                <Badge variant="secondary">Processing</Badge>
              </CardContent>
            </Card>
          ))}

          {failed.map((s) => (
            <Card key={`f-${s.doc.documentId}`}>
              <CardContent className="flex items-center gap-2 py-3">
                <p className="min-w-0 flex-1 truncate text-[11px] text-destructive">
                  <span className="font-medium">{s.doc.fileName}</span>
                  {s.error ? ` — ${s.error}` : ''}
                </p>
                <Badge variant="destructive">Failed</Badge>
              </CardContent>
            </Card>
          ))}

          {!docs.isLoading && quizzes.length === 0 && inProgress.length === 0 && failed.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              No quizzes yet. Generate some from the home screen.
            </p>
          )}

          {quizzes.map(({ docId, quiz }) => (
            <Card key={`${docId}:${quiz.id}`}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                {quiz.description && <CardDescription>{quiz.description}</CardDescription>}
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Badge variant="secondary">{quiz.questions.length} questions</Badge>
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

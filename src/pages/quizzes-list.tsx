import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useQuizzesList } from '@/lib/api/hooks'
import { timeAgo } from '@/lib/time'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Clock, Loader2, Play } from 'lucide-react'

export default function QuizzesListPage() {
  const list = useQuizzesList()
  const items = list.data ?? []

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
          {list.isLoading && (
            <p className="text-center text-xs text-muted-foreground">Loading…</p>
          )}
          {!list.isLoading && items.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              No quizzes yet. Generate some from the home screen.
            </p>
          )}

          {items.map((item) => {
            if (item.status === 'PROCESSING') {
              return (
                <Card key={`p-${item.id}`}>
                  <CardContent className="flex items-center gap-2 py-3">
                    <Loader2 className="size-3 shrink-0 animate-spin text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground">{item.title}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {timeAgo(item.createdAt)}
                      </p>
                    </div>
                    <Badge variant="secondary">Processing</Badge>
                  </CardContent>
                </Card>
              )
            }
            if (item.status === 'FAILED') {
              return (
                <Card key={`f-${item.id}`}>
                  <CardContent className="flex items-center gap-2 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] text-destructive">
                        <span className="font-medium">{item.title}</span>
                        {item.error ? ` — ${item.error}` : ''}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {timeAgo(item.createdAt)}
                      </p>
                    </div>
                    <Badge variant="destructive">Failed</Badge>
                  </CardContent>
                </Card>
              )
            }
            return (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  {item.description && <CardDescription>{item.description}</CardDescription>}
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-2.5" />
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Badge variant="secondary">{item.questionCount} questions</Badge>
                  <Button size="sm" render={<Link to="/quizzes/$id" params={{ id: item.id }} />}>
                    <Play />
                    Start
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}

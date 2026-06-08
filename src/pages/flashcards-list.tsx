import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { useFlashcardsList, useRetryFlashcards } from '@/lib/api/hooks'
import { timeAgo } from '@/lib/time'
import { Link } from '@tanstack/react-router'
import { AlertCircle, ArrowLeft, BookOpen, Clock, Loader2 } from 'lucide-react'

export default function FlashcardsListPage() {
  const list = useFlashcardsList()
  const items = list.data ?? []
  const retry = useRetryFlashcards()

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur-sm">
        <Button variant="ghost" size="icon-md" aria-label="Back to home" render={<Link to="/" />}>
          <ArrowLeft />
        </Button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="h2">Flashcards</h1>
          <p className="truncate text-xs text-muted-foreground">Pick a deck to study</p>
        </div>
      </header>

      <div
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
      >
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          {list.isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={`s-${i}`}>
                <CardContent className="py-3">
                  <div className="h-16 animate-pulse bg-muted" />
                </CardContent>
              </Card>
            ))}
          {!list.isLoading && items.length === 0 && (
            <EmptyState
              icon={BookOpen}
              message="No flashcard decks yet. Generate one to start studying."
            />
          )}

          {items.map((item) => {
            if (item.status === 'PROCESSING') {
              return (
                <Card key={`p-${item.id}`} variant="elevated" className="animate-pulse">
                  <CardContent className="flex items-center gap-2 py-3">
                    <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xxs text-muted-foreground">
                        <span className="font-medium text-foreground">{item.title}</span>
                      </p>
                      <p className="text-xxs text-muted-foreground">
                        {timeAgo(item.createdAt)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="label-mono">
                      Generating
                    </Badge>
                  </CardContent>
                </Card>
              )
            }
            if (item.status === 'FAILED') {
              return (
                <Card key={`f-${item.id}`} className="ring-1 ring-destructive/20">
                  <CardContent className="flex items-center gap-2 py-3">
                    <AlertCircle className="size-4 shrink-0 text-destructive" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xxs text-destructive">
                        <span className="font-medium">{item.title}</span>
                        {item.error ? ` — ${item.error}` : ''}
                      </p>
                      <p className="text-xxs text-muted-foreground">
                        {timeAgo(item.createdAt)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => retry.mutate(item.id)}
                      disabled={retry.isPending}
                    >
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              )
            }
            return (
              <Card
                key={item.id}
                variant="elevated"
                className="anim-enter transition-all hover:shadow-sm hover:ring-foreground/20"
              >
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  {item.description && <CardDescription>{item.description}</CardDescription>}
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xxs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-2.5" />
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Badge variant="secondary">{item.cardCount} cards</Badge>
                  <Button
                    size="sm"
                    render={<Link to="/flashcards/$id" params={{ id: item.id }} />}
                  >
                    <BookOpen />
                    Study
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

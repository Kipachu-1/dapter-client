import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAllFlashcards, useDocuments } from '@/lib/api/hooks'
import type { StageStatus } from '@/lib/api/types'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react'

const STAGE_BADGE: Record<StageStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: { label: 'Queued', variant: 'outline' },
  PROCESSING: { label: 'Processing', variant: 'secondary' },
  COMPLETED: { label: 'Ready', variant: 'default' },
  FAILED: { label: 'Failed', variant: 'destructive' },
}

export default function FlashcardsListPage() {
  const docs = useDocuments()
  const docIds = (docs.data ?? []).map((d) => d.documentId)
  const flashcardQueries = useAllFlashcards(docIds)

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon-sm" render={<Link to="/" />}>
          <ArrowLeft />
        </Button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-heading text-sm font-medium">Flashcard Decks</h1>
          <p className="truncate text-[10px] text-muted-foreground">Pick a deck to study</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
          {docs.isLoading && (
            <p className="text-center text-xs text-muted-foreground">Loading…</p>
          )}
          {!docs.isLoading && docIds.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              No documents yet. Generate some from the home screen.
            </p>
          )}

          {(docs.data ?? []).map((doc, i) => {
            const q = flashcardQueries[i]
            const stageStatus = q?.data?.status ?? 'PENDING'
            const badge = STAGE_BADGE[stageStatus]
            const decks = q?.data?.flashcardDecks ?? []

            return (
              <div key={doc.documentId} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 px-1">
                  <p className="truncate text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    {doc.fileName}
                  </p>
                  <Badge variant={badge.variant}>
                    {stageStatus === 'PROCESSING' && (
                      <Loader2 className="mr-1 size-2.5 animate-spin" />
                    )}
                    {badge.label}
                  </Badge>
                </div>

                {stageStatus === 'FAILED' && (
                  <Card>
                    <CardContent className="py-3">
                      <p className="text-[11px] text-destructive">
                        {q?.data?.error ?? 'Flashcard generation failed'}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {(stageStatus === 'PENDING' || stageStatus === 'PROCESSING') && (
                  <Card>
                    <CardContent className="flex items-center gap-2 py-3">
                      <Loader2 className="size-3 animate-spin text-muted-foreground" />
                      <p className="text-[11px] text-muted-foreground">
                        Generating flashcards…
                      </p>
                    </CardContent>
                  </Card>
                )}

                {stageStatus === 'COMPLETED' && decks.length === 0 && (
                  <Card>
                    <CardContent className="py-3">
                      <p className="text-[11px] text-muted-foreground">No decks produced.</p>
                    </CardContent>
                  </Card>
                )}

                {stageStatus === 'COMPLETED' &&
                  decks.map((deck) => (
                    <Card key={`${doc.documentId}:${deck.id}`}>
                      <CardHeader>
                        <CardTitle>{deck.title}</CardTitle>
                        {deck.description && (
                          <CardDescription>{deck.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <Badge variant="secondary">{deck.cards.length} cards</Badge>
                        <Button
                          size="sm"
                          render={
                            <Link
                              to="/flashcards/$deckId"
                              params={{ deckId: `${doc.documentId}__${deck.id}` }}
                            />
                          }
                        >
                          <BookOpen />
                          Study
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

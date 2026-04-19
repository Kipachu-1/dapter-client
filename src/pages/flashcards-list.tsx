import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAllFlashcards, useDocuments } from '@/lib/api/hooks'
import type { DocumentListItem, FlashcardDeckApi, StageStatus } from '@/lib/api/types'
import { timeAgo } from '@/lib/time'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, Clock, FileText, Loader2 } from 'lucide-react'

type ListItem =
  | { kind: 'processing'; doc: DocumentListItem }
  | { kind: 'failed'; doc: DocumentListItem; error?: string }
  | { kind: 'deck'; doc: DocumentListItem; deck: FlashcardDeckApi }

export default function FlashcardsListPage() {
  const docs = useDocuments()

  const sortedDocs = useMemo(
    () =>
      [...(docs.data ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [docs.data],
  )
  const docIds = sortedDocs.map((d) => d.documentId)
  const queries = useAllFlashcards(docIds)

  const items: ListItem[] = sortedDocs.flatMap((doc, i) => {
    const stage = queries[i]?.data
    const raw = stage?.status ?? 'PENDING'
    const status: StageStatus =
      doc.status === 'FAILED' && (raw === 'PENDING' || raw === 'PROCESSING') ? 'FAILED' : raw

    if (status === 'FAILED') return [{ kind: 'failed', doc, error: stage?.error }]
    if (status === 'PENDING' || status === 'PROCESSING') return [{ kind: 'processing', doc }]
    return (stage?.flashcardDecks ?? []).map(
      (deck): ListItem => ({ kind: 'deck', doc, deck }),
    )
  })

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
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          {docs.isLoading && (
            <p className="text-center text-xs text-muted-foreground">Loading…</p>
          )}
          {!docs.isLoading && items.length === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              No flashcard decks yet. Generate some from the home screen.
            </p>
          )}

          {items.map((item) => {
            if (item.kind === 'processing') {
              return (
                <Card key={`p-${item.doc.documentId}`}>
                  <CardContent className="flex items-center gap-2 py-3">
                    <Loader2 className="size-3 shrink-0 animate-spin text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] text-muted-foreground">
                        Generating flashcards for{' '}
                        <span className="font-medium text-foreground">{item.doc.fileName}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {timeAgo(item.doc.createdAt)}
                      </p>
                    </div>
                    <Badge variant="secondary">Processing</Badge>
                  </CardContent>
                </Card>
              )
            }
            if (item.kind === 'failed') {
              return (
                <Card key={`f-${item.doc.documentId}`}>
                  <CardContent className="flex items-center gap-2 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] text-destructive">
                        <span className="font-medium">{item.doc.fileName}</span>
                        {item.error ? ` — ${item.error}` : ''}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {timeAgo(item.doc.createdAt)}
                      </p>
                    </div>
                    <Badge variant="destructive">Failed</Badge>
                  </CardContent>
                </Card>
              )
            }
            const { doc, deck } = item
            return (
              <Card key={`${doc.documentId}:${deck.id}`}>
                <CardHeader>
                  <CardTitle>{deck.title}</CardTitle>
                  {deck.description && <CardDescription>{deck.description}</CardDescription>}
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <FileText className="size-2.5" />
                      <span className="max-w-40 truncate">{doc.fileName}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-2.5" />
                      {timeAgo(doc.createdAt)}
                    </span>
                  </div>
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
            )
          })}
        </div>
      </div>
    </main>
  )
}

import { FlashcardViewer } from '@/components/flashcard-deck/index'
import { Button } from '@/components/ui/button'
import { useFlashcards } from '@/lib/api/hooks'
import type { FlashcardDeck } from '@/lib/schemas/flashcard'
import { Link, getRouteApi, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'

const route = getRouteApi('/flashcards/$deckId')

export default function FlashcardsPage() {
  const { deckId } = route.useParams()
  const router = useRouter()
  const [documentId, rawDeckId] = deckId.split('__')

  const { data, isLoading, error } = useFlashcards(documentId)
  const deck = data?.flashcardDecks.find((d) => d.id === rawDeckId) as FlashcardDeck | undefined

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </main>
    )
  }

  if (error || !deck) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-muted-foreground">
          {error ? error.message : 'Deck not found.'}
        </p>
        <Button variant="outline" size="sm" render={<Link to="/flashcards" />}>
          <ArrowLeft />
          Back
        </Button>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon-sm" render={<Link to="/flashcards" />}>
          <ArrowLeft />
        </Button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-heading truncate text-sm font-medium">{deck.title}</h1>
          {deck.description && (
            <p className="truncate text-[10px] text-muted-foreground">{deck.description}</p>
          )}
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-4">
        <FlashcardViewer deck={deck} onExit={() => router.navigate({ to: '/flashcards' })} />
      </div>
    </main>
  )
}

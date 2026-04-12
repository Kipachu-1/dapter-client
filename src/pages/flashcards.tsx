import { FlashcardViewer } from '@/components/flashcard-deck/index'
import { Button } from '@/components/ui/button'
import { mockDecks } from '@/lib/mock/flashcards'
import { Link, getRouteApi, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

const route = getRouteApi('/flashcards/$deckId')

export default function FlashcardsPage() {
  const { deckId } = route.useParams()
  const router = useRouter()
  const deck = mockDecks[Number(deckId)]

  if (!deck) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-muted-foreground">Deck not found.</p>
        <Button variant="outline" size="sm" render={<Link to="/flashcards" />}>
          <ArrowLeft />
          Back
        </Button>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* Fixed header */}
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

      {/* Flashcard area fills remaining space */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-4">
        <FlashcardViewer deck={deck} onExit={() => router.navigate({ to: '/flashcards' })} />
      </div>
    </main>
  )
}

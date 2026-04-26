import { FlashcardViewer } from '@/components/flashcard-deck/index'
import { Button } from '@/components/ui/button'
import { useFlashcards } from '@/lib/api/hooks'
import type { FlashcardDeck } from '@/lib/schemas/flashcard'
import { Link, getRouteApi, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useMemo } from 'react'

const route = getRouteApi('/flashcards/$id')

export default function FlashcardsPage() {
  const { id } = route.useParams()
  const router = useRouter()
  const { data, isLoading, error } = useFlashcards(id)

  const deck: FlashcardDeck | undefined = useMemo(() => {
    if (!data || data.status !== 'COMPLETED' || data.cards.length === 0) return undefined
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      cards: data.cards.map((card) => ({
        id: card.id,
        front: card.front,
        back: card.back,
        imageUrls: card.imageUrls,
        tags: card.tags,
      })),
    }
  }, [data])

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
          {error ? error.message : data?.status === 'FAILED' ? (data.error ?? 'Generation failed') : 'Deck not ready.'}
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

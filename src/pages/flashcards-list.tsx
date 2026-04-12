import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockDecks } from '@/lib/mock/flashcards'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function FlashcardsListPage() {
  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* Fixed header */}
      <header className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-heading text-sm font-medium">Flashcard Decks</h1>
          <p className="text-[10px] text-muted-foreground">
            Pick a deck to study
          </p>
        </div>
        <Button variant="ghost" size="sm" render={<Link to="/" />}>
          <ArrowLeft />
          Home
        </Button>
      </header>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
          {mockDecks.map((deck, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{deck.title}</CardTitle>
                {deck.description && (
                  <CardDescription>{deck.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Badge variant="secondary">
                  {deck.cards.length} cards
                </Badge>
                <Button size="sm" render={<Link to="/flashcards/$deckId" params={{ deckId: String(i) }} />}>
                  <BookOpen />
                  Study
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

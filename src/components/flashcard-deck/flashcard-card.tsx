import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageGrid } from '@/components/image-grid'
import { CircleHelp, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Flashcard } from '@/lib/schemas/flashcard'

export const FlashcardCard = memo(function FlashcardCard({
  card,
  flipped,
  transitioning,
}: {
  card: Flashcard
  flipped: boolean
  transitioning: boolean
}) {
  return (
    <Card className="flex w-full flex-col">
      <CardContent
        key={flipped ? 'back' : 'front'}
        className={cn(
          'anim-pop flex flex-1 flex-col items-center justify-center gap-3 overflow-y-auto overscroll-contain p-4 transition-opacity duration-150 ease-out',
          transitioning ? 'opacity-0' : 'opacity-100',
        )}
      >
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {flipped ? <Lightbulb className="size-3.5" /> : <CircleHelp className="size-3.5" />}
          <span className="label-mono">
            {flipped ? 'answer' : 'question'}
          </span>
        </div>
        <p className="text-center text-xs font-medium text-foreground sm:text-sm">
          {flipped ? card.back : card.front}
        </p>
        {card.imageUrls && card.imageUrls.length > 0 && (
          <ImageGrid urls={card.imageUrls} />
        )}
        {!flipped && card.tags && card.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap justify-center gap-1">
            {card.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
})

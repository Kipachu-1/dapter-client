import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from 'lucide-react'

export const DeckControls = memo(function DeckControls({
  index,
  total,
  onPrev,
  onNext,
  onShuffle,
  onResetOpen,
}: {
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  onShuffle: () => void
  onResetOpen: () => void
}) {
  return (
    <>
      <div className="flex shrink-0 items-center justify-between">
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {index + 1} / {total}
        </span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" onClick={onShuffle} aria-label="Random card">
            <Shuffle />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onResetOpen} aria-label="Reset progress">
            <RotateCcw />
          </Button>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <Button variant="outline" className="h-12 flex-1" onClick={onPrev} aria-label="Previous card">
          <ChevronLeft />
          Prev
        </Button>
        <Button variant="outline" className="h-12 flex-1" onClick={onNext} aria-label="Next card">
          Next
          <ChevronRight />
        </Button>
      </div>
    </>
  )
})

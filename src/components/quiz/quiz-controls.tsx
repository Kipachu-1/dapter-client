import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const QuizControls = memo(function QuizControls({
  index,
  total,
  hasAnswered,
  onPrev,
  onNext,
}: {
  index: number
  total: number
  hasAnswered: boolean
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <>
      <div className="flex shrink-0 items-center justify-between">
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {index + 1} / {total}
        </span>
        {hasAnswered && (
          <span className="text-[10px] text-muted-foreground">
            Tap next to continue
          </span>
        )}
      </div>

      <div className="flex shrink-0 gap-2">
        <Button variant="outline" className="h-12 flex-1" onClick={onPrev} aria-label="Previous question">
          <ChevronLeft />
          Prev
        </Button>
        <Button variant="outline" className="h-12 flex-1" onClick={onNext} aria-label="Next question">
          Next
          <ChevronRight />
        </Button>
      </div>
    </>
  )
})

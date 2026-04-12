import { useCallback, useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress'
import type { FlashcardDeck } from '@/lib/schemas/flashcard'
import { useDeck } from './use-deck'
import { FlashcardCard } from './flashcard-card'
import { CompletionCard } from './completion-card'
import { DeckControls } from './deck-controls'
import { ResetDialog } from './reset-dialog'

export function FlashcardViewer({ deck, onExit }: { deck: FlashcardDeck; onExit?: () => void }) {
  const {
    card,
    index,
    total,
    flipped,
    transitioning,
    progress,
    completed,
    flip,
    go,
    shuffle,
    reset,
  } = useDeck(deck)

  const [resetOpen, setResetOpen] = useState(false)

  const handleReset = useCallback(() => {
    setResetOpen(false)
    reset()
  }, [reset])

  const handlePrev = useCallback(() => go(-1), [go])
  const handleNext = useCallback(() => go(1), [go])
  const handleResetOpen = useCallback(() => setResetOpen(true), [])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
    trackTouch: true,
    delta: 30,
  })

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (resetOpen) return
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        flip()
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        go(1)
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flip, go, resetOpen])

  const showCompletion = completed && !flipped

  return (
    <>
      <div className="flex w-full max-w-lg flex-1 flex-col gap-3">
        <div className="shrink-0">
          <Progress value={progress}>
            <ProgressLabel>Progress</ProgressLabel>
            <ProgressValue />
          </Progress>
        </div>

        {showCompletion ? (
          <CompletionCard total={total} onReset={handleReset} onExit={onExit} />
        ) : (
          <div
            {...swipeHandlers}
            className="flex min-h-0 flex-1 cursor-pointer select-none"
            onClick={flip}
            role="button"
            tabIndex={0}
            aria-label={flipped ? 'Showing answer, tap to show question' : 'Showing question, tap to show answer'}
          >
            <FlashcardCard card={card} flipped={flipped} transitioning={transitioning} />
          </div>
        )}

        <DeckControls
          index={index}
          total={total}
          onPrev={handlePrev}
          onNext={handleNext}
          onShuffle={shuffle}
          onResetOpen={handleResetOpen}
        />
      </div>

      <ResetDialog open={resetOpen} onOpenChange={setResetOpen} onReset={handleReset} />
    </>
  )
}

import { useCallback, useState } from 'react'
import type { FlashcardDeck } from '@/lib/schemas/flashcard'
import { haptics } from '@/lib/haptics'

export function useDeck(deck: FlashcardDeck) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]))
  const [transitioning, setTransitioning] = useState(false)

  const card = deck.cards[index]
  const total = deck.cards.length
  const progress = (seen.size / total) * 100
  const completed = seen.size === total

  const flip = useCallback(() => {
    haptics.light()
    setTransitioning(true)
    setTimeout(() => {
      setFlipped((f) => !f)
      setTransitioning(false)
    }, 100)
  }, [])

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = (index + dir + total) % total
      const justCompleted = !seen.has(next) && seen.size + 1 === total
      setIndex(next)
      setSeen((s) => new Set(s).add(next))
      if (justCompleted) haptics.success()
      setTransitioning(true)
      setTimeout(() => setTransitioning(false), 100)
    },
    [index, seen, total],
  )

  const shuffle = useCallback(() => {
    if (total <= 1) return
    haptics.medium()
    setIndex((prev) => {
      let next: number
      do {
        next = Math.floor(Math.random() * total)
      } while (next === prev)
      setSeen((s) => new Set(s).add(next))
      return next
    })
    setFlipped(false)
    setTransitioning(true)
    setTimeout(() => setTransitioning(false), 100)
  }, [total])

  const reset = useCallback(() => {
    haptics.medium()
    setIndex(0)
    setFlipped(false)
    setSeen(new Set([0]))
  }, [])

  return {
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
  }
}

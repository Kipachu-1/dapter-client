import { useCallback, useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress'
import type { Quiz } from '@/lib/schemas/quiz'
import { haptics } from '@/lib/haptics'
import { useQuiz } from './use-quiz'
import { QuizQuestionCard } from './quiz-question-card'
import { ResultsCard } from './results-card'
import { QuizControls } from './quiz-controls'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function QuizViewer({ quiz, onExit }: { quiz: Quiz; onExit?: () => void }) {
  const {
    question,
    index,
    total,
    currentAnswer,
    progress,
    completed,
    score,
    answer,
    go,
    goToNext,
    reset,
  } = useQuiz(quiz)

  const [resetOpen, setResetOpen] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleReset = useCallback(() => {
    setResetOpen(false)
    setShowResults(false)
    reset()
  }, [reset])

  const handlePrev = useCallback(() => go(-1), [go])
  const handleNext = useCallback(() => {
    if (completed && currentAnswer !== undefined) {
      haptics.success()
      setShowResults(true)
    } else {
      goToNext()
    }
  }, [completed, currentAnswer, goToNext])

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
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleNext, handlePrev, resetOpen])

  return (
    <>
      <div className="flex w-full max-w-lg flex-1 flex-col gap-3">
        <div className="shrink-0">
          <Progress value={progress}>
            <ProgressLabel>Progress</ProgressLabel>
            <ProgressValue />
          </Progress>
        </div>

        {showResults ? (
          <ResultsCard score={score} total={total} onReset={handleReset} onExit={onExit} />
        ) : (
          <div
            {...swipeHandlers}
            className="flex min-h-0 flex-1 select-none"
          >
            <QuizQuestionCard
              question={question}
              answer={currentAnswer}
              onAnswer={answer}
            />
          </div>
        )}

        {!showResults && (
          <QuizControls
            index={index}
            total={total}
            hasAnswered={currentAnswer !== undefined}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </div>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Restart quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all your answers and start from the first question.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleReset}>
              Restart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

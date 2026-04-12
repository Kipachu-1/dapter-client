import { useCallback, useState } from 'react'
import type { Quiz } from '@/lib/schemas/quiz'

export type AnswerRecord = {
  selected: number
  correct: boolean
}

export function useQuiz(quiz: Quiz) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<number, AnswerRecord>>(new Map())

  const question = quiz.questions[index]
  const total = quiz.questions.length
  const answered = answers.size
  const progress = (answered / total) * 100
  const currentAnswer = answers.get(index)
  const completed = answered === total

  const score = Array.from(answers.values()).filter((a) => a.correct).length

  const answer = useCallback(
    (optionIndex: number) => {
      if (answers.has(index)) return
      setAnswers((prev) => {
        const next = new Map(prev)
        next.set(index, {
          selected: optionIndex,
          correct: optionIndex === quiz.questions[index].correctIndex,
        })
        return next
      })
    },
    [index, answers, quiz.questions],
  )

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((prev) => (prev + dir + total) % total)
    },
    [total],
  )

  const goToNext = useCallback(() => {
    if (index < total - 1) {
      setIndex((prev) => prev + 1)
    }
  }, [index, total])

  const reset = useCallback(() => {
    setIndex(0)
    setAnswers(new Map())
  }, [])

  return {
    question,
    index,
    total,
    answers,
    currentAnswer,
    answered,
    progress,
    completed,
    score,
    answer,
    go,
    goToNext,
    reset,
  }
}

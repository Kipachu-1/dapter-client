import { z } from 'zod'

export const quizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctIndex: z.number().int().min(0),
  explanation: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const quizSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  questions: z.array(quizQuestionSchema).min(1),
})

export type QuizQuestion = z.infer<typeof quizQuestionSchema>
export type Quiz = z.infer<typeof quizSchema>

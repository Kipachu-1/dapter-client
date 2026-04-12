import { z } from 'zod'

export const flashcardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  tags: z.array(z.string()).optional(),
})

export const flashcardDeckSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  cards: z.array(flashcardSchema).min(1),
})

export type Flashcard = z.infer<typeof flashcardSchema>
export type FlashcardDeck = z.infer<typeof flashcardDeckSchema>

import { z } from 'zod'

export const flashcardSchema = z.object({
  id: z.string(),
  front: z.string().min(1),
  back: z.string().min(1),
  imageUrls: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
})

export const flashcardDeckSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  cards: z.array(flashcardSchema).min(1),
})

export type Flashcard = z.infer<typeof flashcardSchema>
export type FlashcardDeck = z.infer<typeof flashcardDeckSchema>

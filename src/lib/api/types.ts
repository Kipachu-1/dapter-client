export type RowStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED'

export type FlashcardsListItem = {
  id: string
  title: string
  description?: string
  status: RowStatus
  error?: string
  cardCount: number
  createdAt: string
  updatedAt: string
}

export type FlashcardsCardApi = {
  id: string
  front: string
  back: string
  imageUrls?: string[]
  tags?: string[]
}

export type FlashcardsDetail = FlashcardsListItem & {
  cards: FlashcardsCardApi[]
}

export type FlashcardsStatusResponse = {
  id: string
  status: RowStatus
  error?: string
}

export type CreateFlashcardsResponse = {
  id: string
  status: 'PROCESSING'
}

export type QuizListItem = {
  id: string
  title: string
  description?: string
  status: RowStatus
  error?: string
  questionCount: number
  createdAt: string
  updatedAt: string
}

export type QuizQuestionApi = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
  tags?: string[]
  imageUrls?: string[]
}

export type QuizDetail = QuizListItem & {
  questions: QuizQuestionApi[]
}

export type QuizStatusResponse = {
  id: string
  status: RowStatus
  error?: string
}

export type CreateQuizResponse = {
  id: string
  status: 'PROCESSING'
}

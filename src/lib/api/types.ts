export type DocumentStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type StageStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export type DocumentListItem = {
  documentId: string
  fileName: string
  mimeType: string
  fileSize: number
  status: DocumentStatus
  createdAt: string
  updatedAt: string
}

export type DocumentStatusResponse = {
  documentId: string
  status: DocumentStatus
  error?: string
}

export type UploadDocumentResponse = {
  documentId: string
  status: 'PROCESSING'
}

export type FlashcardApi = {
  id: string
  front: string
  back: string
  imageUrls?: string[]
  tags?: string[]
}

export type FlashcardDeckApi = {
  id: string
  title: string
  description?: string
  cards: FlashcardApi[]
}

export type DocumentFlashcardsResponse = {
  documentId: string
  status: StageStatus
  error?: string
  flashcardDecks: FlashcardDeckApi[]
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

export type QuizApi = {
  id: string
  title: string
  description?: string
  questions: QuizQuestionApi[]
}

export type DocumentQuizzesResponse = {
  documentId: string
  status: StageStatus
  error?: string
  quizzes: QuizApi[]
}

import { env } from '../env'
import { pb } from '../pocketbase'
import type {
  CreateFlashcardsResponse,
  CreateNotesResponse,
  CreateQuizResponse,
  FlashcardsDetail,
  FlashcardsListItem,
  FlashcardsStatusResponse,
  NotesDetail,
  NotesListItem,
  NotesStatusResponse,
  QuizDetail,
  QuizListItem,
  QuizStatusResponse,
} from './types'

export class ApiError extends Error {
  public readonly status: number
  public constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = pb.authStore.token
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${env.apiUrl}${path}`, { ...init, headers })
  const contentType = res.headers.get('content-type') ?? ''
  const body = contentType.includes('application/json') ? await res.json() : await res.text()

  if (!res.ok) {
    const message = typeof body === 'object' && body && 'message' in body
      ? String((body as { message: unknown }).message)
      : typeof body === 'string'
        ? body
        : 'Request failed'
    throw new ApiError(res.status, message)
  }
  return body as T
}

const buildFilesForm = (files: File[]): FormData => {
  const form = new FormData()
  for (const file of files) form.append('files', file)
  return form
}

export const api = {
  // flashcards
  listFlashcards: () => request<FlashcardsListItem[]>('/flashcards/'),
  createFlashcards: (files: File[]) =>
    request<CreateFlashcardsResponse>('/flashcards/', {
      method: 'POST',
      body: buildFilesForm(files),
    }),
  getFlashcards: (id: string) => request<FlashcardsDetail>(`/flashcards/${id}`),
  getFlashcardsStatus: (id: string) =>
    request<FlashcardsStatusResponse>(`/flashcards/${id}/status`),
  retryFlashcards: (id: string) =>
    request<CreateFlashcardsResponse>(`/flashcards/${id}/retry`, { method: 'POST' }),
  deleteFlashcards: (id: string) =>
    request<{ success: boolean }>(`/flashcards/${id}`, { method: 'DELETE' }),

  // quizzes
  listQuizzes: () => request<QuizListItem[]>('/quizzes/'),
  createQuiz: (files: File[]) =>
    request<CreateQuizResponse>('/quizzes/', {
      method: 'POST',
      body: buildFilesForm(files),
    }),
  getQuiz: (id: string) => request<QuizDetail>(`/quizzes/${id}`),
  getQuizStatus: (id: string) => request<QuizStatusResponse>(`/quizzes/${id}/status`),
  retryQuiz: (id: string) =>
    request<CreateQuizResponse>(`/quizzes/${id}/retry`, { method: 'POST' }),
  deleteQuiz: (id: string) =>
    request<{ success: boolean }>(`/quizzes/${id}`, { method: 'DELETE' }),

  // notes
  listNotes: () => request<NotesListItem[]>('/notes/'),
  createNotes: (files: File[]) =>
    request<CreateNotesResponse>('/notes/', {
      method: 'POST',
      body: buildFilesForm(files),
    }),
  getNotes: (id: string) => request<NotesDetail>(`/notes/${id}`),
  getNotesStatus: (id: string) => request<NotesStatusResponse>(`/notes/${id}/status`),
  retryNotes: (id: string) =>
    request<CreateNotesResponse>(`/notes/${id}/retry`, { method: 'POST' }),
  deleteNotes: (id: string) =>
    request<{ success: boolean }>(`/notes/${id}`, { method: 'DELETE' }),
}

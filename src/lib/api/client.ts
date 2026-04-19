import { env } from '../env'
import { pb } from '../pocketbase'
import type {
  DocumentFlashcardsResponse,
  DocumentListItem,
  DocumentQuizzesResponse,
  DocumentStatusResponse,
  UploadDocumentResponse,
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

export const api = {
  listDocuments: () => request<DocumentListItem[]>('/documents/'),
  uploadDocument: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return request<UploadDocumentResponse>('/documents/upload', {
      method: 'POST',
      body: form,
    })
  },
  getStatus: (id: string) => request<DocumentStatusResponse>(`/documents/${id}/status`),
  getFlashcards: (id: string) => request<DocumentFlashcardsResponse>(`/documents/${id}/flashcards`),
  getQuizzes: (id: string) => request<DocumentQuizzesResponse>(`/documents/${id}/quizzes`),
}

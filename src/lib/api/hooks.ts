import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import { api } from './client'
import type {
  DocumentFlashcardsResponse,
  DocumentListItem,
  DocumentQuizzesResponse,
  DocumentStatusResponse,
} from './types'

const isStageActive = (status: string | undefined) =>
  status === 'PROCESSING' || status === 'PENDING'

export const queryKeys = {
  documents: ['documents'] as const,
  status: (id: string) => ['documents', id, 'status'] as const,
  flashcards: (id: string) => ['documents', id, 'flashcards'] as const,
  quizzes: (id: string) => ['documents', id, 'quizzes'] as const,
}

export function useDocuments() {
  return useQuery({
    queryKey: queryKeys.documents,
    queryFn: api.listDocuments,
    refetchInterval: (query) => {
      const data = query.state.data as DocumentListItem[] | undefined
      if (!data) return 3000
      return data.some((doc) => doc.status === 'PROCESSING') ? 3000 : false
    },
  })
}

export function useUploadDocument() {
  return useMutation({
    mutationFn: (file: File) => api.uploadDocument(file),
  })
}

export function useDocumentStatus(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: id ? queryKeys.status(id) : ['documents', 'pending', 'status'],
    queryFn: () => api.getStatus(id!),
    enabled: Boolean(id) && enabled,
    refetchInterval: (query) => {
      const data = query.state.data as DocumentStatusResponse | undefined
      if (!data) return 2000
      return data.status === 'PROCESSING' ? 2000 : false
    },
  })
}

export function useFlashcards(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.flashcards(id) : ['documents', 'pending', 'flashcards'],
    queryFn: () => api.getFlashcards(id!),
    enabled: Boolean(id),
  })
}

export function useQuizzes(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.quizzes(id) : ['documents', 'pending', 'quizzes'],
    queryFn: () => api.getQuizzes(id!),
    enabled: Boolean(id),
  })
}

export function useAllFlashcards(ids: string[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.flashcards(id),
      queryFn: () => api.getFlashcards(id),
      refetchInterval: (query: { state: { data?: DocumentFlashcardsResponse } }) =>
        isStageActive(query.state.data?.status) ? 3000 : false,
    })),
  })
}

export function useAllQuizzes(ids: string[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.quizzes(id),
      queryFn: () => api.getQuizzes(id),
      refetchInterval: (query: { state: { data?: DocumentQuizzesResponse } }) =>
        isStageActive(query.state.data?.status) ? 3000 : false,
    })),
  })
}

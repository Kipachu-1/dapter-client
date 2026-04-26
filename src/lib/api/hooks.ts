import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from './client'
import type {
  FlashcardsDetail,
  FlashcardsStatusResponse,
  NotesDetail,
  NotesStatusResponse,
  QuizDetail,
  QuizStatusResponse,
} from './types'

const isActive = (status: string | undefined) => status === 'PROCESSING'

export const queryKeys = {
  flashcardsList: ['flashcards'] as const,
  flashcards: (id: string) => ['flashcards', id] as const,
  flashcardsStatus: (id: string) => ['flashcards', id, 'status'] as const,
  quizzesList: ['quizzes'] as const,
  quiz: (id: string) => ['quizzes', id] as const,
  quizStatus: (id: string) => ['quizzes', id, 'status'] as const,
  notesList: ['notes'] as const,
  notes: (id: string) => ['notes', id] as const,
  notesStatus: (id: string) => ['notes', id, 'status'] as const,
}

export function useFlashcardsList() {
  return useQuery({
    queryKey: queryKeys.flashcardsList,
    queryFn: api.listFlashcards,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return 3000
      return data.some((item) => item.status === 'PROCESSING') ? 3000 : false
    },
  })
}

export function useFlashcards(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.flashcards(id) : ['flashcards', 'pending'],
    queryFn: () => api.getFlashcards(id!),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const data = query.state.data as FlashcardsDetail | undefined
      if (!data) return 3000
      if (isActive(data.status)) return 3000
      if (data.status !== 'COMPLETED') return false
      const cardsMissingImages = data.cards.some(
        (c) => !c.imageUrls || c.imageUrls.length === 0,
      )
      return cardsMissingImages ? 4000 : false
    },
  })
}

export function useFlashcardsStatus(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.flashcardsStatus(id) : ['flashcards', 'pending', 'status'],
    queryFn: () => api.getFlashcardsStatus(id!),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const data = query.state.data as FlashcardsStatusResponse | undefined
      if (!data) return 2000
      return isActive(data.status) ? 2000 : false
    },
  })
}

export function useCreateFlashcards() {
  return useMutation({
    mutationFn: (files: File[]) => api.createFlashcards(files),
  })
}

export function useQuizzesList() {
  return useQuery({
    queryKey: queryKeys.quizzesList,
    queryFn: api.listQuizzes,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return 3000
      return data.some((item) => item.status === 'PROCESSING') ? 3000 : false
    },
  })
}

export function useQuiz(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.quiz(id) : ['quizzes', 'pending'],
    queryFn: () => api.getQuiz(id!),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const data = query.state.data as QuizDetail | undefined
      if (!data) return 3000
      return isActive(data.status) ? 3000 : false
    },
  })
}

export function useQuizStatus(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.quizStatus(id) : ['quizzes', 'pending', 'status'],
    queryFn: () => api.getQuizStatus(id!),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const data = query.state.data as QuizStatusResponse | undefined
      if (!data) return 2000
      return isActive(data.status) ? 2000 : false
    },
  })
}

export function useCreateQuiz() {
  return useMutation({
    mutationFn: (files: File[]) => api.createQuiz(files),
  })
}

export function useNotesList() {
  return useQuery({
    queryKey: queryKeys.notesList,
    queryFn: api.listNotes,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return 3000
      return data.some((item) => item.status === 'PROCESSING') ? 3000 : false
    },
  })
}

export function useNotes(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.notes(id) : ['notes', 'pending'],
    queryFn: () => api.getNotes(id!),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const data = query.state.data as NotesDetail | undefined
      if (!data) return 3000
      return isActive(data.status) ? 3000 : false
    },
  })
}

export function useNotesStatus(id: string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.notesStatus(id) : ['notes', 'pending', 'status'],
    queryFn: () => api.getNotesStatus(id!),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const data = query.state.data as NotesStatusResponse | undefined
      if (!data) return 2000
      return isActive(data.status) ? 2000 : false
    },
  })
}

export function useCreateNotes() {
  return useMutation({
    mutationFn: (files: File[]) => api.createNotes(files),
  })
}

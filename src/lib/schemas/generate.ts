import { z } from 'zod'

const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/markdown',
  'application/vnd.oasis.opendocument.presentation',
]

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
const MAX_FILES = 5

export const generateFormSchema = z.object({
  files: z
    .array(
      z.instanceof(File).check(
        z.refine((f) => ACCEPTED_MIME_TYPES.includes(f.type), 'Unsupported file type'),
        z.refine((f) => f.size <= MAX_FILE_SIZE, 'File must be under 20 MB'),
      ),
    )
    .max(MAX_FILES, `Maximum ${MAX_FILES} files`),
  text: z.string().optional(),
  generateFlashcards: z.boolean(),
  generateQuiz: z.boolean(),
}).refine((d) => d.generateFlashcards || d.generateQuiz, {
  message: 'Select at least one type',
  path: ['generateFlashcards'],
}).refine((d) => d.files.length > 0 || (d.text && d.text.trim().length > 0), {
  message: 'Upload files or enter text',
  path: ['files'],
})

export type GenerateFormData = z.infer<typeof generateFormSchema>

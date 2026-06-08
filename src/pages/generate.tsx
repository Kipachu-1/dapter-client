import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { inputClassName } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { FileUpload } from '@/components/file-upload'
import { generateFormSchema, type GenerateFormData } from '@/lib/schemas/generate'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, BookText, Check, ClipboardList, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCreateFlashcards, useCreateNotes, useCreateQuiz } from '@/lib/api/hooks'
import { haptics } from '@/lib/haptics'

const TARGET_OPTIONS = [
  { value: 'flashcards' as const, label: 'Flashcards', icon: BookOpen },
  { value: 'quizzes' as const, label: 'Quiz', icon: ClipboardList },
  { value: 'notes' as const, label: 'Notes', icon: BookText },
]

export default function GeneratePage() {
  const navigate = useNavigate()
  const createFlashcards = useCreateFlashcards()
  const createQuiz = useCreateQuiz()
  const createNotes = useCreateNotes()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GenerateFormData>({
    resolver: zodResolver(generateFormSchema),
    defaultValues: {
      files: [],
      text: '',
    },
  })

  const target = watch('target')
  const files = watch('files')
  const text = watch('text')

  const hasContent = files.length > 0 || (text?.trim().length ?? 0) > 0
  const hasTarget = Boolean(target)
  const isPending =
    isSubmitting || createFlashcards.isPending || createQuiz.isPending || createNotes.isPending

  async function onSubmit(data: GenerateFormData) {
    setSubmitError(null)
    const uploads: File[] = [...data.files]
    if (data.text && data.text.trim().length > 0) {
      uploads.push(new File([data.text], 'input.txt', { type: 'text/plain' }))
    }
    if (uploads.length === 0) return
    try {
      const result =
        data.target === 'flashcards'
          ? await createFlashcards.mutateAsync(uploads)
          : data.target === 'quizzes'
            ? await createQuiz.mutateAsync(uploads)
            : await createNotes.mutateAsync(uploads)
      haptics.success()
      navigate({
        to: '/processing/$target/$id',
        params: { target: data.target, id: result.id },
      })
    } catch (err) {
      haptics.error()
      setSubmitError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <Button
          variant="ghost"
          size="icon-md"
          aria-label="Back to home"
          render={<Link to="/" />}
        >
          <ArrowLeft />
        </Button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="h2">Generate</h1>
          <p className="truncate text-xs text-muted-foreground">
            Upload content to generate study material
          </p>
        </div>
      </header>

      <form
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
            <Controller
              control={control}
              name="files"
              render={({ field }) => (
                <FileUpload
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.files?.message ?? errors.files?.root?.message}
                />
              )}
            />

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="label-mono">or</span>
              <Separator className="flex-1" />
            </div>

            <Field label="Paste text" error={errors.text?.message}>
              {(p) => (
                <textarea
                  {...register('text')}
                  {...p}
                  placeholder="Paste or type your content here..."
                  className={cn(inputClassName, 'min-h-40 resize-none py-2')}
                />
              )}
            </Field>

            <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
              <legend className="label-mono">Generate</legend>
              <div className="grid grid-cols-3 gap-2">
                {TARGET_OPTIONS.map(({ value, label, icon: Icon }) => {
                  const checked = target === value
                  return (
                    <label key={value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="target"
                        className="peer sr-only"
                        checked={checked}
                        onChange={() => {
                          haptics.selection()
                          setValue('target', value, { shouldValidate: true })
                        }}
                      />
                      <Card
                        variant="elevated"
                        className={cn(
                          'transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-ring',
                          checked && 'ring-2 ring-primary',
                        )}
                      >
                        <CardContent className="flex items-center gap-2 py-3">
                          <div
                            className={cn(
                              'flex size-4 shrink-0 items-center justify-center ring-1 ring-foreground/20',
                              checked && 'bg-primary ring-primary',
                            )}
                          >
                            {checked && <Check className="size-3 text-primary-foreground" />}
                          </div>
                          <Icon className="size-4 shrink-0 text-muted-foreground" />
                          <span className="text-xs font-medium">{label}</span>
                        </CardContent>
                      </Card>
                    </label>
                  )
                })}
              </div>
              {errors.target && (
                <p className="text-xxs text-destructive">{errors.target.message}</p>
              )}
            </fieldset>
          </div>
        </div>

        <div className="shrink-0 border-t px-4 py-3">
          <div className="mx-auto w-full max-w-lg flex flex-col gap-2">
            {submitError && <p className="text-xxs text-destructive">{submitError}</p>}
            <p className="text-xxs text-muted-foreground">You will see generation progress next.</p>
            <Button
              type="submit"
              className="h-12 w-full"
              disabled={isPending || !hasContent || !hasTarget}
            >
              <Sparkles />
              {isPending ? 'Uploading...' : 'Generate'}
            </Button>
          </div>
        </div>
      </form>
    </main>
  )
}

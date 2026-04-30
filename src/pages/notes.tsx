import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Markdown } from '@/components/markdown'
import { useNotes } from '@/lib/api/hooks'
import { haptics } from '@/lib/haptics'
import { Link, getRouteApi } from '@tanstack/react-router'
import { ArrowLeft, Check, Copy, Loader2 } from 'lucide-react'

const route = getRouteApi('/notes/$id')

export default function NotesPage() {
  const { id } = route.useParams()
  const { data, isLoading, error } = useNotes(id)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!data || data.status !== 'COMPLETED') return
    try {
      await navigator.clipboard.writeText(data.markdown)
      haptics.success()
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      haptics.error()
    }
  }, [data])

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </main>
    )
  }

  if (error || !data || data.status !== 'COMPLETED') {
    const message =
      error?.message ??
      (data?.status === 'FAILED' ? (data.error ?? 'Generation failed') : 'Notes not ready.')
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-muted-foreground">{message}</p>
        <Button variant="outline" size="sm" render={<Link to="/notes" />}>
          <ArrowLeft />
          Back
        </Button>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon-sm" render={<Link to="/notes" />}>
          <ArrowLeft />
        </Button>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-heading truncate text-sm font-medium">{data.title}</h1>
          {data.description && (
            <p className="truncate text-[10px] text-muted-foreground">{data.description}</p>
          )}
        </div>
        <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
          {data.wordCount.toLocaleString()} words
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy markdown'}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        <div className="mx-auto w-full max-w-2xl">
          <Markdown>{data.markdown}</Markdown>
        </div>
      </div>
    </main>
  )
}

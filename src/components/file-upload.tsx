import { memo, useCallback, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Presentation, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { haptics } from '@/lib/haptics'

const ACCEPTED_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'text/plain': 'TXT',
  'text/markdown': 'MD',
  'application/vnd.oasis.opendocument.presentation': 'ODP',
}

const ACCEPT_STRING = [...Object.keys(ACCEPTED_TYPES), '.md', '.txt'].join(',')

const EXTENSION_MIME: Record<string, string> = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  txt: 'text/plain',
}

function normalizeFile(file: File): File {
  if (file.type in ACCEPTED_TYPES) return file
  const ext = file.name.split('.').pop()?.toLowerCase()
  const inferred = ext ? EXTENSION_MIME[ext] : undefined
  if (!inferred) return file
  return new File([file], file.name, { type: inferred, lastModified: file.lastModified })
}

function fileIcon(type: string) {
  if (type.includes('presentation') || type.includes('powerpoint') || type.includes('odp')) {
    return <Presentation className="size-4 shrink-0 text-muted-foreground" />
  }
  return <FileText className="size-4 shrink-0 text-muted-foreground" />
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const FileUpload = memo(function FileUpload({
  value = [],
  onChange,
  onBlur,
  error,
  maxFiles = 5,
}: {
  value?: File[]
  onChange: (files: File[]) => void
  onBlur?: () => void
  error?: string
  maxFiles?: number
}) {
  const [dragOver, setDragOver] = useState(false)
  const [rejected, setRejected] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const raw = Array.from(incoming).map(normalizeFile)
      const arr = raw.filter((f) => f.type in ACCEPTED_TYPES)
      if (arr.length === 0 && raw.length > 0) {
        haptics.error()
        setRejected(true)
        setTimeout(() => setRejected(false), 3000)
        return
      }
      if (arr.length > 0) haptics.success()
      const next = [...value, ...arr].slice(0, maxFiles)
      onChange(next)
    },
    [value, onChange, maxFiles],
  )

  const removeFile = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index))
    },
    [value, onChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      addFiles(e.dataTransfer.files)
    },
    [addFiles],
  )

  return (
    <div className="flex flex-col gap-3" onBlur={onBlur}>
      {/* Drop zone */}
      <Card
        variant="elevated"
        role="button"
        tabIndex={0}
        aria-label="Upload study material. Tap to choose files or drag them here. Accepted: PDF, PPTX, TXT, MD"
        className={cn(
          'cursor-pointer border-dashed transition-all duration-150 outline-none active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-primary',
          dragOver && 'bg-accent/50',
          error && 'ring-1 ring-destructive',
        )}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center gap-2 py-10">
          <Upload className="size-6 text-muted-foreground" />
          <p className="text-xs font-medium text-foreground">
            Tap to upload or drag files here
          </p>
          <p className="text-xxs text-muted-foreground">
            PDF, PowerPoint, or text files
          </p>
          <div className="flex gap-1">
            <Badge variant="secondary">PDF</Badge>
            <Badge variant="secondary">PPTX</Badge>
            <Badge variant="secondary">TXT</Badge>
            <Badge variant="secondary">MD</Badge>
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-xxs text-destructive">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_STRING}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {/* Rejection feedback */}
      {rejected && (
        <p className="text-xxs text-destructive">
          Unsupported format. Accepted: PDF, PPTX, TXT, MD
        </p>
      )}

      {/* File list */}
      {value.length > 0 && (
        <div className="flex flex-col gap-1">
          {value.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-2 rounded-none border px-3 py-2"
            >
              {fileIcon(file.type)}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs font-medium">{file.name}</span>
                <span className="text-xxs text-muted-foreground">
                  {ACCEPTED_TYPES[file.type] ?? 'File'} &middot; {formatSize(file.size)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => removeFile(i)}
                aria-label={`Remove ${file.name}`}
              >
                <X />
              </Button>
            </div>
          ))}
          <p className="text-xxs text-muted-foreground">
            {value.length} / {maxFiles} files
          </p>
        </div>
      )}
    </div>
  )
})

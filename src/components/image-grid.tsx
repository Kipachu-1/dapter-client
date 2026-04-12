import { memo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const MAX_IMAGES = 6

export const ImageGrid = memo(function ImageGrid({
  urls,
}: {
  urls: string[]
}) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)

  const thumbnails = urls.slice(0, MAX_IMAGES)
  const thumbCount = thumbnails.length
  const allCount = urls.length
  const overflow = allCount - MAX_IMAGES

  if (allCount === 0) return null

  function open(index: number) {
    setViewerIndex(index)
    setViewerOpen(true)
  }

  return (
    <>
      <div
        className={cn(
          'grid w-full gap-1',
          thumbCount === 1 && 'grid-cols-1',
          thumbCount === 2 && 'grid-cols-2',
          thumbCount >= 3 && 'grid-cols-3',
        )}
      >
        {thumbnails.map((url, i) => {
          const isLast = i === thumbCount - 1 && overflow > 0
          return (
            <button
              key={url}
              type="button"
              className={cn(
                'relative aspect-square overflow-hidden bg-muted ring-1 ring-foreground/10 transition-opacity active:opacity-80',
                thumbCount === 1 && 'aspect-video',
              )}
              onClick={(e) => {
                e.stopPropagation()
                open(i)
              }}
            >
              <img
                src={url}
                alt=""
                className="size-full object-cover"
                loading="lazy"
              />
              {isLast && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="font-mono text-sm font-medium text-white">
                    +{overflow}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent
          showCloseButton
          className="max-w-[calc(100%-1rem)] p-2 sm:max-w-lg"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <DialogHeader className="px-2 pt-1">
            <DialogTitle>Image {viewerIndex + 1} of {allCount}</DialogTitle>
          </DialogHeader>
          <div className="relative flex items-center justify-center">
            <img
              src={urls[viewerIndex]}
              alt=""
              className="max-h-[70dvh] w-full object-contain"
            />
          </div>

          {allCount > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setViewerIndex((i) => (i - 1 + allCount) % allCount)}
                aria-label="Previous image"
              >
                <ChevronLeft />
              </Button>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                {viewerIndex + 1} / {allCount}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setViewerIndex((i) => (i + 1) % allCount)}
                aria-label="Next image"
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
})

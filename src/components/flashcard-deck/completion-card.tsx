import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, PartyPopper, RotateCcw } from 'lucide-react'

export const CompletionCard = memo(function CompletionCard({
  total,
  onReset,
  onExit,
}: {
  total: number
  onReset: () => void
  onExit?: () => void
}) {
  return (
    <div className="flex min-h-0 flex-1">
      <Card className="flex w-full flex-col">
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
          <PartyPopper className="size-6 text-muted-foreground" />
          <p className="text-center text-xs font-medium text-foreground sm:text-sm">
            You've seen all {total} cards!
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw />
              Start over
            </Button>
            {onExit && (
              <Button variant="outline" size="sm" onClick={onExit}>
                <ArrowLeft />
                Exit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

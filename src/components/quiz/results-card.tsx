import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react'

export const ResultsCard = memo(function ResultsCard({
  score,
  total,
  onReset,
  onExit,
}: {
  score: number
  total: number
  onReset: () => void
  onExit?: () => void
}) {
  const pct = Math.round((score / total) * 100)

  return (
    <div className="flex min-h-0 flex-1">
      <Card className="flex w-full flex-col">
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
          <Trophy className="size-6 text-muted-foreground" />
          <div className="flex flex-col items-center gap-1">
            <p className="font-heading text-2xl font-medium">{pct}%</p>
            <p className="text-xs text-muted-foreground">
              {score} of {total} correct
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw />
              Try again
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

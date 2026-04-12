import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ImageGrid } from '@/components/image-grid'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QuizQuestion } from '@/lib/schemas/quiz'
import type { AnswerRecord } from './use-quiz'

export const QuizQuestionCard = memo(function QuizQuestionCard({
  question,
  answer,
  onAnswer,
}: {
  question: QuizQuestion
  answer: AnswerRecord | undefined
  onAnswer: (index: number) => void
}) {
  const answered = answer !== undefined

  return (
    <Card className="flex w-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-4">
        <p className="text-center text-xs font-medium text-foreground sm:text-sm">
          {question.question}
        </p>

        {question.imageUrls && question.imageUrls.length > 0 && (
          <ImageGrid urls={question.imageUrls} />
        )}

        <div className="flex flex-col gap-2">
          {question.options.map((option, i) => {
            const isSelected = answer?.selected === i
            const isCorrect = i === question.correctIndex

            let variant: 'outline' | 'default' | 'destructive' | 'ghost' = 'outline'
            if (answered && isCorrect) variant = 'default'
            else if (answered && isSelected && !isCorrect) variant = 'destructive'

            return (
              <Button
                key={i}
                variant={variant}
                className={cn(
                  'h-auto min-h-10 w-full justify-start whitespace-normal px-3 py-2 text-left text-xs',
                  answered && !isSelected && !isCorrect && 'opacity-50',
                )}
                onClick={() => onAnswer(i)}
                disabled={answered}
              >
                {answered && isCorrect && <Check className="mr-1 size-3.5 shrink-0" />}
                {answered && isSelected && !isCorrect && <X className="mr-1 size-3.5 shrink-0" />}
                {option}
              </Button>
            )
          })}
        </div>

        {answered && question.explanation && (
          <p className="text-center text-[10px] text-muted-foreground">
            {question.explanation}
          </p>
        )}

        {question.tags && question.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap justify-center gap-1">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
})

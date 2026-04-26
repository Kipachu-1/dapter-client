import { Streamdown } from 'streamdown'
import { cn } from '@/lib/utils'

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <Streamdown
      className={cn(className)}
    >
      {children}
    </Streamdown>
  )
}

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { cn } from '@/lib/utils'

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <article
      className={cn(
        'prose prose-sm prose-neutral max-w-none dark:prose-invert',
        'prose-headings:font-heading prose-headings:tracking-tight',
        'prose-h1:text-2xl prose-h2:text-lg prose-h3:text-base',
        'prose-p:text-sm prose-li:text-sm',
        'prose-pre:bg-muted prose-pre:text-foreground prose-pre:text-xs',
        'prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.85em]',
        'prose-blockquote:border-l-primary prose-blockquote:text-foreground/90',
        'prose-table:text-xs',
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {children}
      </ReactMarkdown>
    </article>
  )
}

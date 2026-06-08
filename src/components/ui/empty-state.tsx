import type { LucideIcon } from "lucide-react"
import { Sparkles } from "lucide-react"
import { Link } from "@tanstack/react-router"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * On-brand empty state: a centered card with an icon, a mono "EMPTY" tag, a
 * short message, and a primary CTA back to the generate flow.
 */
export function EmptyState({
  icon: Icon,
  message,
  actionLabel = "Generate",
}: {
  icon: LucideIcon
  message: string
  actionLabel?: string
}) {
  return (
    <Card className="anim-enter">
      <CardContent className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
        <Icon className="size-6 text-muted-foreground" />
        <span className="label-mono">Empty</span>
        <p className="text-xs text-muted-foreground">{message}</p>
        <Button size="sm" render={<Link to="/generate" />}>
          <Sparkles />
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  )
}

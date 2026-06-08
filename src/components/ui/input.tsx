import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Shared visual recipe for text inputs and the paste-text textarea.
 * h-11 (~44px touch target) + text-sm legibility; sharp corners and thin ring
 * to match the mono aesthetic. `aria-invalid` drives the error ring, so no
 * separate error prop is needed.
 */
export const inputClassName =
  "w-full rounded-none bg-transparent px-3 text-sm text-foreground ring-1 ring-foreground/10 outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary aria-invalid:ring-2 aria-invalid:ring-destructive"

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      className={cn(inputClassName, "h-11", className)}
      {...props}
    />
  )
}

export { Input }

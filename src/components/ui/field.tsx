import * as React from "react"

import { cn } from "@/lib/utils"

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn("label-mono", className)}
      {...props}
    />
  )
}

/**
 * A labeled form field with accessible wiring done once: a generated id links
 * the <label> to the control, and when `error` is set the control receives
 * `aria-invalid` + `aria-describedby` pointing at the error message.
 *
 * Usage:
 *   <Field label="Email" error={err}>
 *     {(p) => <Input type="email" {...p} value={...} onChange={...} />}
 *   </Field>
 */
function Field({
  label,
  error,
  className,
  children,
}: {
  label: string
  error?: string
  className?: string
  children: (props: {
    id: string
    "aria-invalid"?: true
    "aria-describedby"?: string
  }) => React.ReactNode
}) {
  const id = React.useId()
  const errorId = `${id}-error`
  return (
    <div data-slot="field" className={cn("flex flex-col gap-1.5", className)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} className="text-xxs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export { Field, FieldLabel }

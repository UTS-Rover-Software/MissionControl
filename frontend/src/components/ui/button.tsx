import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button-variants"

function Button({
  className,
  variant,
  size,
  asChild = false,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    leadingIcon?: React.ReactNode
    trailingIcon?: React.ReactNode
  }) {
  const Comp = asChild ? Slot : "button"
  const variantClass = variant ? `button--${variant}` : 'button--default'
  const sizeClass = size ? `button--${size}` : ''

  return (
    <Comp
      data-slot="button"
      className={cn('button', variantClass, sizeClass, buttonVariants({ variant, size, className }))}
      {...props}
    >
      {leadingIcon ? <span className="button__icon button__icon--leading">{leadingIcon}</span> : null}
      {children}
      {trailingIcon ? <span className="button__icon button__icon--trailing">{trailingIcon}</span> : null}
    </Comp>
  )
}

export { Button }

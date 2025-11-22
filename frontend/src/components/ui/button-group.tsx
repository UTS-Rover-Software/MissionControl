import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "./button-variants"
import { buttonGroupVariants } from "./button-group-variants"

function ButtonGroup({
  className,
  orientation,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants> & VariantProps<typeof buttonVariants>) {
  const orientationClass = orientation ? `button-group--${orientation}` : 'button-group--horizontal'
  const variantClass = variant ? `button-group--${variant}` : 'button-group--default'
  const sizeClass = size ? `button-group--${size}` : ''

  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      data-variant={variant}
      data-size={size}
      className={cn('button-group', orientationClass, variantClass, sizeClass, buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      className={cn(
        "flex items-center gap-2 rounded-md px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "button-group__separator",
          "relative !m-0 self-stretch data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
}

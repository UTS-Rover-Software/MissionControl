import { cva } from "class-variance-authority"

export const badgeVariants = cva(
  "badge inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-light w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "badge--default",
        primary:
          "badge--primary",
        secondary:
          "badge--secondary",
        destructive:
          "badge--destructive",
        outline:
          "badge--outline",
        warning:
          "badge--warning",
        selected:
          "badge--selected",
        neutral:
          "badge--neutral",
        dark:
          "badge--dark",
        info:
          "badge--info",
        success:
          "badge--success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"

import { cn } from "@/lib/utils"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & { className?: string }) {
  return <AccordionPrimitive.Root data-slot="accordion" className={cn('accordion', className)} {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("accordion__item", "border-b last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  arrowPosition = "left",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { arrowPosition?: "left" | "right" }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        data-arrow-position={arrowPosition}
        className={cn(
          "accordion__trigger",
          `accordion__trigger--arrow-${arrowPosition}`,
          "flex flex-1 items-center gap-4 rounded-md text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content> & { value?: string | number }) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="accordion__content data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pa-0 flex items-center justify-between", className)}>
        <div className="flex-1">{children}</div>
        {value !== undefined && (
          <span className="accordion__content-value ml-4 flex-shrink-0">{value}</span>
        )}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

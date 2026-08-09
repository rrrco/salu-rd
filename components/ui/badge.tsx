import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

/**
 * Badges are the one place `--radius-full` is allowed (DESIGN.md 3.2). Buttons
 * are never pill-shaped, so the pill silhouette is what tells a reader at a
 * glance that this is a label and not a control.
 *
 * Two variants, both non-interactive by default. `tinted` is Apple's tinted
 * treatment and carries the product category; `outline` is quieter and carries
 * the species list, which is a set rather than a headline.
 */
const badgeVariants = cva(
  [
    'inline-flex w-fit shrink-0 items-center justify-center gap-1.5',
    'rounded-full px-2.5 py-1 font-sans text-xs font-semibold whitespace-nowrap',
    'transition-[background-color,border-color,color] duration-[180ms] ease-[var(--ease-out)]',
    "[&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-3.5",
  ].join(' '),
  {
    variants: {
      variant: {
        tinted: 'bg-teal-100 text-accent-deep',
        outline: 'border border-border bg-transparent text-fg-muted',
      },
    },
    defaultVariants: {
      variant: 'tinted',
    },
  }
)

function Badge({
  className,
  variant = 'tinted',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

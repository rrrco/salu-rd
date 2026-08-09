'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Toggle as TogglePrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

const toggleVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans',
    'cursor-pointer select-none',
    'transition-[background-color,border-color,color,transform] duration-[180ms] ease-[var(--ease-out)]',
    'active:scale-[0.97] active:duration-[100ms]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
    'disabled:pointer-events-none disabled:opacity-55',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'h-11 rounded-md px-3 text-sm font-semibold bg-transparent text-fg-muted',
          'hover-fine:bg-teal-50 hover-fine:text-fg',
          'data-[state=on]:bg-teal-100 data-[state=on]:text-accent-deep',
        ].join(' '),
        /* Filter chip. Pill radius is correct here - chips are badges, not
           buttons (DESIGN.md 3.2 reserves `--radius-full` for exactly this).
           Active chips take the solid brand fill; inactive ones read as quiet
           outlined surfaces until hover. */
        chip: [
          'rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.06em]',
          'border-border bg-surface text-fg-muted',
          'hover-fine:border-accent hover-fine:text-accent',
          'data-[state=on]:border-accent data-[state=on]:bg-brand data-[state=on]:text-on-brand',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Toggle({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }

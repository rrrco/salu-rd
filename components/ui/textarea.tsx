import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'w-full min-w-0 min-h-32 resize-y rounded-sm px-4 py-3 text-body text-fg font-sans',
        'bg-surface border border-border-strong',
        'placeholder:text-fg-subtle selection:bg-teal-200 selection:text-ink-900',
        'transition-[background-color,border-color,box-shadow] duration-[180ms] ease-[var(--ease-out)]',
        'focus:border-accent focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-accent)_30%,transparent)]',
        'aria-invalid:border-destructive',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

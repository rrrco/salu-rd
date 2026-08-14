import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Inputs sit on `--radius-sm` (6px). The border is a real 3:1 boundary
 * (border-strong) per WCAG 1.4.11; focus turns it accent and adds a soft
 * accent ring, which keeps the branded focus moment. `focus:` rather than
 * `focus-visible:` on purpose - a text control should show focus on pointer
 * entry too.
 *
 * `type="search"` draws a clear button of its own in WebKit and Chromium, on
 * hover and focus only, so a search field that ships its own clear control
 * showed two crosses side by side the moment the pointer entered. The native
 * one is suppressed here rather than at the call site: it is the same defect
 * wherever a search input appears, and the answer never differs.
 */
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full min-w-0 rounded-sm px-4 py-3 text-body text-fg font-sans',
        'bg-surface border border-border-strong',
        'placeholder:text-fg-subtle selection:bg-teal-200 selection:text-ink-900',
        'transition-[background-color,border-color,box-shadow] duration-[180ms] ease-[var(--ease-out)]',
        'focus:border-accent focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-accent)_30%,transparent)]',
        'aria-invalid:border-destructive',
        '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    />
  )
}

export { Input }

import type { ReactNode } from 'react'
import { Plus } from '@phosphor-icons/react/ssr'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

/**
 * Animated open/close panel on Radix Collapsible.
 *
 * Replaces a native `<details>`, which snaps: the content is there or it is
 * not, and the surrounding layout jumps by a few hundred pixels in one frame.
 * That reads as a bug even when it is the browser default.
 *
 * This file has no state and no client directive: Radix owns the open state
 * behind the `collapsible.tsx` boundary, and the plus-into-cross glyph is a
 * CSS rotation driven by `data-state`, so it stays a retargetable transition
 * instead of a JS animation (a mid-flight close reverses smoothly).
 */
export function Disclosure({
  title,
  hint,
  children,
  className,
}: {
  title: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <Collapsible className={className}>
      <CollapsibleTrigger
        className={[
          'group flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left',
          'transition-colors duration-[180ms] ease-[var(--ease-out)]',
          'hover-fine:bg-teal-50',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-focus)]',
          'rounded-lg',
        ].join(' ')}
      >
        <span className="flex flex-col">
          <span className="font-semibold text-fg">{title}</span>
          {hint ? <span className="text-sm text-fg-muted">{hint}</span> : null}
        </span>

        {/* The plus rotates into a cross. One glyph doing both states beats
            two glyphs swapping, because the rotation is continuous and the
            reader never sees a hard cut. */}
        <span
          aria-hidden="true"
          className={[
            'flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-accent-deep',
            'transition-transform duration-[300ms] ease-[var(--ease-out)]',
            'group-data-[state=open]:rotate-135',
          ].join(' ')}
        >
          <Plus size={16} />
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent
        className={[
          'overflow-hidden',
          'data-[state=open]:animate-[collapsible-down_340ms_var(--ease-out)]',
          'data-[state=closed]:animate-[collapsible-up_240ms_var(--ease-out)]',
        ].join(' ')}
      >
        <div className="border-t border-border p-6">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

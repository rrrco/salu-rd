'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogCloseButton, DialogContent } from '@/components/ui/dialog'

/**
 * The overlay shell for an intercepted product route.
 *
 * It opens already open: the route rendering is what "opened" it, so there is
 * no trigger and no client state to sync. Closing is `router.back()`, which
 * pops the intercepted URL and returns the catalog exactly as it was, with the
 * buyer's search term and category filter intact. That is the entire reason
 * this route is intercepted rather than navigated to.
 *
 * Escape, a press on the scrim and the close button all route through the same
 * `onOpenChange`, so the browser back button and the interface agree on what
 * closing means.
 *
 * `aria-describedby` is cleared because the product description is optional in
 * the CMS; pointing at an element that may not exist is worse than not
 * pointing. The title carries the accessible name.
 *
 * Focus has to be put back by hand. Radix restores focus to the trigger that
 * opened a dialog, and this one has no trigger: it opened because a route
 * rendered. Left alone, closing drops a keyboard user at the top of the
 * document and makes them tab the whole catalog again to get back to where
 * they were. The tile is found by its href, which is the one thing the modal
 * and the grid provably agree on.
 */
export function ProductModal({
  href,
  title,
  children,
}: {
  href: string
  title: ReactNode
  children: ReactNode
}) {
  const router = useRouter()

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        onCloseAutoFocus={(event) => {
          // JSON.stringify supplies the quotes and escapes them; CSS.escape is
          // for identifiers, not for the inside of an attribute selector.
          const tile = document.querySelector<HTMLElement>(
            `[data-tile-link][href=${JSON.stringify(href)}]`
          )
          // Only take over when the tile is actually there. Arriving from
          // anywhere else, Radix's own restore is the better answer.
          if (!tile) return
          event.preventDefault()
          tile.focus()
        }}
      >
        {/* The name lives in the bar, not in the body. On a phone the packshot
            is the tallest thing in the sheet, and a title underneath it means
            the buyer opens a product and cannot see which product it is. Here
            it survives every scroll position, and so does the way out. */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-surface py-2 pl-5 pr-2">
          <div className="min-w-0 flex-1">{title}</div>
          <DialogCloseButton label="Cerrar" />
        </div>

        <div className="overflow-y-auto overscroll-contain p-5 sm:p-7">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

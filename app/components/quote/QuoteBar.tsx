'use client'

import { CaretUp } from '@phosphor-icons/react/ssr'
import { openQuote, useQuoteCount } from '../../lib/quote-store'

/**
 * The quote's mobile home: a bar that does not exist until there is something
 * in it.
 *
 * The catalog is browsed with a thumb, and a 17px badge in a 56px header is the
 * wrong place to tell someone they have six products waiting. This says it in
 * words, at the bottom of the screen, and costs nothing at all until the first
 * product goes in. It is the reason `QuoteNavButton` is desktop-only: two
 * permanent controls for one list is one too many.
 *
 * `lg:hidden` because above that breakpoint the nav button is always on screen
 * and this would be a duplicate.
 *
 * It enters with a keyframe and leaves without one. Radix owns the exit
 * animation for the panel because Radix controls that unmount; here the bar
 * disappears because the buyer emptied the list, and an exit animation on the
 * last remove would keep a bar on screen describing a quote that is gone.
 */
export function QuoteBar() {
  const count = useQuoteCount()
  if (count === 0) return null

  return (
    <div
      // Read by the WhatsApp FAB, which lifts out of the way. Presence, not
      // measurement: the offset is a token both sides agree on.
      data-quote-bar
      className={[
        'fixed inset-x-4 bottom-4 z-40 lg:hidden',
        'animate-[quote-bar-in_240ms_var(--ease-out)]',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={openQuote}
        className={[
          'on-dark flex w-full cursor-pointer items-center justify-between gap-3 rounded-md',
          'bg-teal-900 py-3 pl-4 pr-3 text-left shadow-lg',
          'transition-[background-color,scale] duration-[180ms] ease-[var(--ease-out)]',
          'hover-fine:bg-teal-800 active:scale-[0.99] active:duration-[100ms]',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
        ].join(' ')}
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-white">
            {count === 1 ? '1 producto en tu cotización' : `${count} productos en tu cotización`}
          </span>
          <span className="block text-xs text-teal-200">Toca para revisar y enviar</span>
        </span>
        <CaretUp size={20} aria-hidden="true" className="shrink-0 text-teal-200" />
      </button>
    </div>
  )
}

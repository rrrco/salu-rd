'use client'

import { ClipboardText } from '@phosphor-icons/react/ssr'
import { openQuote, useQuoteCount } from '../../lib/quote-store'

/**
 * The quote's desktop home: a glyph in the nav with a count on it.
 *
 * Desktop only, and the mobile bar (`QuoteBar`) is deliberately its opposite -
 * it exists only when the list has something in it. The nav is sticky on every
 * route at every scroll position, so a permanent control there is always
 * reachable and a bar underneath it would be a second copy of the same button.
 * On a phone the bar is the only copy, because that bar already had to exist
 * and a third control in a 56px header does not fit beside the WhatsApp glyph
 * and the hamburger.
 *
 * A clipboard, not a shopping cart. There are no prices and no checkout on this
 * site; a cart glyph promises a transaction that never arrives.
 */
export function QuoteNavButton() {
  const count = useQuoteCount()

  return (
    <button
      type="button"
      onClick={openQuote}
      aria-label={
        count === 0
          ? 'Ver tu cotización, vacía'
          : `Ver tu cotización, ${count === 1 ? '1 producto' : `${count} productos`}`
      }
      className={[
        'relative flex size-11 cursor-pointer items-center justify-center rounded-md text-fg-muted',
        'transition-[color,transform] duration-[180ms] ease-[var(--ease-out)]',
        'hover-fine:text-fg active:scale-[0.97] active:duration-[100ms]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
      ].join(' ')}
    >
      <ClipboardText size={24} aria-hidden="true" />
      {count > 0 ? (
        /* teal-300 on teal-950 text: the one accent that reads on every ground
           this bar takes, and it takes several - the nav is transparent over
           the hero and a teal gradient everywhere else, so a badge ringed in
           any single color would be wrong on one of them.

           `aria-hidden`: the count is already in the button's name, and read
           twice it comes out as "cotización, 3 productos, 3". */
        <span
          aria-hidden="true"
          className={[
            'absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1',
            'bg-teal-300 text-[0.625rem] font-bold leading-none text-teal-950 tabular-nums',
          ].join(' ')}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}

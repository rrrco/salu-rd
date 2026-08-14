'use client'

import { WhatsAppIcon } from '../../lib/icons'
import { SITE } from '../../lib/site'
import { useQuoteCount } from '../../lib/quote-store'

/**
 * Lives in `layout.tsx`, so it renders once for every route. Previously this
 * markup and its inline SVG path were duplicated verbatim across both pages.
 *
 * Kept on every breakpoint even though the navbar also carries a WhatsApp
 * control (`Nav.tsx`). The redundancy is deliberate: this is the conversion
 * path, and a thumb-height target costs nothing to leave in place.
 *
 * The brand-tinted shadow is the one place `--shadow-accent` is used: it makes
 * the button read as part of the brand rather than a bolted-on third-party
 * widget.
 *
 * It lifts rather than hides when the mobile quote bar appears. The bar is
 * about one specific list; this is the way to ask anything else, and a control
 * that vanishes because you added a product to a list is a control the buyer
 * then has to go looking for. 64px clears the bar's 56px plus its 16px inset.
 * `translate`, never `bottom`: DESIGN.md 4.2 allows transform and opacity and
 * nothing else, and the bar is `lg:hidden`, so above that the FAB never moves.
 */
export function WhatsAppFab() {
  const raised = useQuoteCount() > 0

  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escribir por WhatsApp al ${SITE.phoneDisplay}`}
      className={[
        'fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full',
        'bg-brand text-on-brand shadow-[var(--shadow-accent)]',
        // `translate` and `scale` are their own properties in Tailwind v4, so
        // both have to be named here or the lift and the hover cut instead of
        // animating.
        'transition-[background-color,translate,scale] duration-[180ms] ease-[var(--ease-out)]',
        'hover-fine:bg-brand-hover',
        'hover-fine:scale-[1.06]',
        'active:scale-[0.97]',
        raised ? '-translate-y-16 lg:translate-y-0' : '',
        'motion-reduce:transition-none motion-reduce:hover-fine:scale-100',
      ].join(' ')}
    >
      <WhatsAppIcon size={28} />
    </a>
  )
}

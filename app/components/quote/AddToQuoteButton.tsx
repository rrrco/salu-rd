'use client'

import { Check, Plus } from '@phosphor-icons/react/ssr'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { addToQuote, useQuoteLine } from '../../lib/quote-store'

/**
 * The one control that puts a product on the quote.
 *
 * Two shapes, one behavior. In a tile it is the 25% square beside "Cotizar",
 * where a label has no room; on a product page it carries its label, because
 * that page is often where a buyer meets the feature for the first time and a
 * bare glyph there is a puzzle.
 *
 * Pressing it again adds another unit rather than toggling the product off.
 * Removal lives in the panel, with the quantities, so one target never carries
 * two meanings. Both labels stay verbs for the same reason: the accessible
 * name has to describe what the press does, and a control reading "En tu
 * cotización" that adds a unit lies about it.
 *
 * Feedback is the button filling in, plus the nav badge (desktop) or the bar
 * (mobile) moving. No toast: three taps down a catalog would stack three of
 * them over the grid the buyer is still reading.
 */
export function AddToQuoteButton({
  slug,
  name,
  packageSize,
  withLabel = false,
  size = 'md',
  className,
}: {
  slug: string
  name: string
  /** Set only when the product declares exactly one, see `soleSize`. Named for
   *  the package, not `size`, because `size` on a Button means its height. */
  packageSize?: string
  withLabel?: boolean
  size?: 'md' | 'lg'
  className?: string
}) {
  const line = useQuoteLine(slug)

  const label = line ? `Agregar otra (${line.qty})` : 'Agregar a la cotización'
  const description = line
    ? `Agregar otra unidad de ${name}. Ya tienes ${line.qty} en tu cotización.`
    : `Agregar ${name} a la cotización`

  return (
    <Button
      variant={line ? 'primary' : 'tinted'}
      size={size}
      aria-label={description}
      onClick={() => addToQuote({ slug, name, size: packageSize })}
      // Square and label-less it still has to fill its grid track, and the
      // 20px side padding of a labelled button would crush a 44px one.
      className={cn(withLabel ? '' : 'w-full px-0', className)}
    >
      {/* Explicit `size-5` on the glyph, not a `size` prop: the button's CVA
          sizes bare icons at 16px, which is right beside a label and too small
          alone in a 44px square. The class is what makes the CVA's
          `:not([class*='size-'])` step aside; the prop would be dead. */}
      {line ? <Check className="size-5" /> : <Plus className="size-5" />}
      {/* The count rides along only where the button has a label to hang it
          on. In a tile the glyph is alone in a 30px track and a number beside
          it would push that track past its quarter and overflow the card; the
          quantity is one glance away in the nav badge, the mobile bar and the
          panel itself. */}
      {withLabel ? label : null}
    </Button>
  )
}

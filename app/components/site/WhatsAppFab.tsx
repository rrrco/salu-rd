import { WhatsAppIcon } from '../../lib/icons'
import { SITE } from '../../lib/site'

/**
 * Lives in `layout.tsx`, so it renders once for every route. Previously this
 * markup and its inline SVG path were duplicated verbatim across both pages.
 *
 * The brand-tinted shadow is the one place `--shadow-accent` is used: it makes
 * the button read as part of the brand rather than a bolted-on third-party
 * widget.
 */
export function WhatsAppFab() {
  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escribir por WhatsApp al ${SITE.phoneDisplay}`}
      className={[
        'fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full',
        'bg-brand text-on-brand shadow-[var(--shadow-accent)]',
        'transition-[background-color,transform] duration-[180ms] ease-[var(--ease-out)]',
        'hover-fine:bg-brand-hover',
        'hover-fine:scale-[1.06]',
        'active:scale-[0.97]',
        'motion-reduce:transition-none motion-reduce:hover-fine:scale-100',
      ].join(' ')}
    >
      <WhatsAppIcon size={28} />
    </a>
  )
}

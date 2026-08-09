import type { ReactNode } from 'react'

/**
 * One vertical rhythm and one max width for every section on the site.
 *
 * `--space-section` and `--space-gutter` are fluid clamps, so the desktop to
 * mobile step is a single system rather than three hand-written breakpoint
 * overrides. That is what let the previous build's type scale drift.
 */
export function Section({
  id,
  children,
  className,
  bleed = false,
  labelledBy,
}: {
  id?: string
  children: ReactNode
  className?: string
  /** Full-bleed background; the inner container still constrains content. */
  bleed?: boolean
  labelledBy?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={[bleed ? '' : 'py-(--space-section)', className].filter(Boolean).join(' ')}
    >
      {bleed ? (
        children
      ) : (
        <div className="mx-auto max-w-(--container-content) px-(--space-gutter)">
          {children}
        </div>
      )}
    </section>
  )
}

/**
 * Section heading.
 *
 * Eyebrows are rationed: at most one per three sections, and the hero holds one
 * of the two this page is allowed. Everything else runs headline-only, which is
 * why `eyebrow` is optional and used exactly once below the hero.
 */
export function SectionHead({
  id,
  eyebrow,
  title,
  lead,
  align = 'start',
  onDark = false,
}: {
  id?: string
  eyebrow?: string
  title: string
  lead?: string
  align?: 'start' | 'center'
  onDark?: boolean
}) {
  return (
    <div
      className={[
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start',
      ].join(' ')}
    >
      {eyebrow && (
        <p
          className={[
            'font-semibold text-xs uppercase tracking-[0.14em]',
            // accent-deep, not accent: sections sit on teal-50 where #00818F
            // measures 4.1:1 at this size. accent-deep clears AA at 5.7:1.
            onDark ? 'text-teal-300' : 'text-accent-deep',
          ].join(' ')}
        >
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="max-w-[20ch] text-h2 font-semibold">
        {title}
      </h2>
      {lead && (
        <p
          className={[
            'max-w-[var(--width-prose)] text-lead',
            onDark ? 'text-fg-muted' : 'text-fg-muted',
            align === 'center' ? 'mx-auto' : '',
          ].join(' ')}
        >
          {lead}
        </p>
      )}
    </div>
  )
}

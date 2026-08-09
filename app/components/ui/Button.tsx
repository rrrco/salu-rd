import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'inverse' | 'tinted' | 'ghost'
type Size = 'md' | 'lg'

/**
 * Interactive radius is `--radius-md` (10px). Buttons are never pill-shaped:
 * pill CTAs read consumer, this is a pharma supplier. See DESIGN.md 3.2.
 *
 * Labels sit at 14px / weight 600. The previous 13px read as a caption rather
 * than a control, and a CTA that looks like small print does not get pressed.
 */
const base = [
  'inline-flex items-center justify-center gap-2 whitespace-nowrap',
  'rounded-md font-sans text-sm font-semibold tracking-[-0.005em]',
  'cursor-pointer select-none',
  // Named properties only. `transition: all` is banned.
  'transition-[background-color,border-color,color,transform,box-shadow]',
  'duration-[180ms] ease-[var(--ease-out)]',
  // Feedback belongs on the press, and it is instant. 100ms so the button is
  // already down by the time the finger registers contact.
  'active:translate-y-0 active:scale-[0.97] active:duration-[100ms]',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
  'disabled:pointer-events-none disabled:opacity-55',
  'motion-reduce:transition-[background-color,border-color,color] motion-reduce:hover:translate-y-0',
].join(' ')

const sizes: Record<Size, string> = {
  md: 'h-11 px-5',
  lg: 'h-13 px-7',
}

/**
 * The inset top highlight is what makes a flat fill read as a physical control:
 * a 1px line of light along the top edge, the way light catches a raised
 * surface. Without it a solid rectangle reads as a coloured label.
 *
 * On hover the button lifts 1px and the shadow deepens. That pairing is the
 * whole trick, since a shadow that grows while the object stays put reads as
 * the light moving rather than the object.
 */
const variants: Record<Variant, string> = {
  primary: [
    'bg-brand text-on-brand',
    'shadow-[0_1px_2px_rgb(6_36_40/0.24),inset_0_1px_0_rgb(255_255_255/0.22)]',
    'hover-fine:bg-brand-hover hover-fine:-translate-y-px',
    'hover-fine:shadow-[0_8px_20px_rgb(6_36_40/0.26),inset_0_1px_0_rgb(255_255_255/0.22)]',
  ].join(' '),
  /* A real surface, not a bare outline. An outline-only button on a tinted
     section reads as disabled. */
  secondary: [
    'border border-border-strong bg-surface text-fg shadow-sm',
    'hover-fine:border-accent hover-fine:text-accent hover-fine:-translate-y-px hover-fine:shadow-md',
  ].join(' '),
  /* For dark grounds. A solid white fill with near-black type reads as a real
     control where an outlined button just reads as a hole in the background.
     16.7:1 for the label, and the fill itself clears 5:1 against the darkest
     point of the hero gradient, so it needs no border. */
  inverse: [
    'bg-white text-ink-900 shadow-[0_1px_2px_rgb(6_36_40/0.24)]',
    'hover-fine:bg-teal-50 hover-fine:-translate-y-px hover-fine:shadow-md',
  ].join(' '),
  /* Apple's tinted button: the accent at low opacity carrying accent-coloured
     text. Reads as clearly actionable without competing with the primary, which
     a grey outline never manages. 5.9:1. */
  tinted: [
    'bg-teal-100 text-accent-deep',
    'hover-fine:bg-teal-200 hover-fine:-translate-y-px',
  ].join(' '),
  ghost: [
    'text-fg-muted bg-transparent px-3',
    'hover-fine:text-fg',
  ].join(' '),
}

function classesFor(variant: Variant, size: Size, className?: string) {
  return [base, sizes[size], variants[variant], className].filter(Boolean).join(' ')
}

type ButtonLinkProps = {
  href: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const isInternal = href.startsWith('/') || href.startsWith('#')
  const cls = classesFor(variant, size, className)

  if (!isInternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        {...(rest as ComponentProps<'a'>)}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  )
}

type ButtonProps = {
  variant?: Variant
  size?: Size
} & ComponentProps<'button'>

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classesFor(variant, size, className)} {...rest}>
      {children}
    </button>
  )
}

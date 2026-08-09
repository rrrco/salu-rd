import * as React from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

/**
 * Interactive radius is `--radius-md` (10px). Buttons are never pill-shaped:
 * pill CTAs read consumer, this is a pharma supplier. See DESIGN.md 3.2.
 *
 * Labels sit at 14px / weight 600. The previous 13px read as a caption rather
 * than a control, and a CTA that looks like small print does not get pressed.
 *
 * The inset top highlight on `primary` is what makes a flat fill read as a
 * physical control: a 1px line of light along the top edge, the way light
 * catches a raised surface. On hover the button lifts 1px and the shadow
 * deepens - a shadow that grows while the object stays put reads as the light
 * moving rather than the object.
 */
const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap',
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
    'motion-reduce:transition-[background-color,border-color,color] motion-reduce:hover-fine:translate-y-0',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-primary-foreground',
          'shadow-[0_1px_2px_rgb(6_36_40/0.24),inset_0_1px_0_rgb(255_255_255/0.22)]',
          'hover-fine:bg-brand-hover hover-fine:-translate-y-px',
          'hover-fine:shadow-[0_8px_20px_rgb(6_36_40/0.26),inset_0_1px_0_rgb(255_255_255/0.22)]',
        ].join(' '),
        /* A real surface, not a bare outline. An outline-only button on a
           tinted section reads as disabled. */
        secondary: [
          'border border-border-strong bg-surface text-fg shadow-sm',
          'hover-fine:border-accent hover-fine:text-accent hover-fine:-translate-y-px hover-fine:shadow-md',
        ].join(' '),
        /* For dark grounds. A solid white fill with near-black type reads as a
           real control where an outlined button just reads as a hole in the
           background. */
        inverse: [
          'bg-white text-ink-900 shadow-[0_1px_2px_rgb(6_36_40/0.24)]',
          'hover-fine:bg-teal-50 hover-fine:-translate-y-px hover-fine:shadow-md',
        ].join(' '),
        /* Apple's tinted button: the accent at low opacity carrying
           accent-coloured text. Reads as clearly actionable without competing
           with the primary. */
        tinted: [
          'bg-teal-100 text-accent-deep',
          'hover-fine:bg-teal-200 hover-fine:-translate-y-px',
        ].join(' '),
        ghost: ['text-fg-muted bg-transparent px-3', 'hover-fine:text-fg'].join(' '),
      },
      size: {
        md: 'h-11 px-5',
        lg: 'h-13 px-7',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      // Buttons submit by default inside forms; keep the repo's safe default
      // without stamping `type` onto Slot-rendered anchors.
      type={asChild ? type : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

type ButtonLinkProps = {
  href: string
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  className?: string
  children: React.ReactNode
} & Omit<React.ComponentProps<typeof Link>, 'href' | 'className' | 'children'>

/** CTA link styled as a button. Internal hrefs get client navigation via
 *  `next/link`; external ones open in a new tab with rel hardening. */
function ButtonLink({ href, variant, size, className, children, ...rest }: ButtonLinkProps) {
  const isInternal = href.startsWith('/') || href.startsWith('#')

  return (
    <Button asChild variant={variant} size={size} className={className}>
      {isInternal ? (
        <Link href={href} {...rest}>
          {children}
        </Link>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...(rest as React.ComponentProps<'a'>)}
        >
          {children}
        </a>
      )}
    </Button>
  )
}

export { Button, ButtonLink, buttonVariants }

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { List } from '@phosphor-icons/react/ssr'
import { Logo } from './Logo'
import { WhatsAppIcon } from '../../lib/icons'
import { ButtonLink } from '@/components/ui/button'
import {
  Sheet,
  SheetCloseButton,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { NAV_LINKS, whatsappUrl, WHATSAPP_MESSAGES } from '../../lib/site'

/** Cascade delay for the sheet links, applied via CSS custom property so the
 *  stagger runs off the main thread. */
const linkCascade = (index: number): CSSProperties =>
  ({ '--i': index }) as CSSProperties

const linkCascadeClass = [
  'animate-[nav-link-in_300ms_var(--ease-out)_backwards]',
  '[animation-delay:calc(40ms+var(--i)*40ms)]',
].join(' ')

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  /**
   * The nav is a dark band on every route, with one exception: the top of the
   * home hero, which supplies the dark ground itself, so the bar is transparent
   * there and lets it through. Everywhere else - including the top of
   * light-topped routes like productos - it is the solid teal-950 bar. It never
   * flips to a light face.
   *
   * Derived during render rather than tracked in state: it is a function of
   * values we already have, and an effect would introduce a frame where the
   * nav is styled for the wrong background.
   */
  const overHero = pathname === '/' && !scrolled

  /**
   * IntersectionObserver on a sentinel, not a scroll listener. A scroll handler
   * fires on every frame and would re-render this tree constantly; the observer
   * fires twice, at the two moments the state actually changes.
   */
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="absolute top-0 h-px w-full" />

      <header
        className={[
          'sticky top-0 z-40 w-full border-b border-transparent on-dark',
          'transition-[background-color,box-shadow] duration-[240ms] ease-[var(--ease-out)]',
          overHero ? 'bg-transparent' : 'nav-surface',
          scrolled ? 'shadow-[0_2px_12px_rgb(6_36_40/0.25)]' : '',
        ].filter(Boolean).join(' ')}
      >
        <nav
          aria-label="Principal"
          className="mx-auto flex h-[var(--nav-h)] max-w-(--container-content) items-center justify-between px-(--space-gutter)"
        >
          <Link href="/" aria-label="SALU División Veterinaria, inicio">
            <Logo onDark />
          </Link>

          {/* Desktop: one line, always. */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'rounded-sm px-3 py-2 text-sm text-fg-muted',
                  'transition-colors duration-[180ms] ease-[var(--ease-out)]',
                  'hover-fine:text-fg',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink
              href={whatsappUrl(WHATSAPP_MESSAGES.general)}
              className="ml-3"
            >
              <WhatsAppIcon />
              Cotizar
            </ButtonLink>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {/* WhatsApp is what this business closes on, so on mobile it is a
                control in the bar rather than a row inside the menu. Bare
                glyph, no surface: it reads as a peer of the hamburger it sits
                beside, and the filled CTA stays the one inside the sheet.

                White, flat. The bar is a dark band on every route and at every
                scroll position, so the glyph has exactly one ground to sit on
                and does not need to track a token. */}
            <ButtonLink
              href={whatsappUrl(WHATSAPP_MESSAGES.general)}
              variant="ghost"
              size="icon"
              className="text-white"
              aria-label="Cotizar por WhatsApp"
            >
              {/* `size-6` rather than a `size` prop: the CVA owns icon size
                  inside a control, and 24px is the hamburger's rung of the
                  ladder, so the pair sits on one optical line. */}
              <WhatsAppIcon className="size-6" />
            </ButtonLink>

            {/* Mobile sheet. Radix Dialog supplies the focus trap, Escape
                handling and body scroll lock the previous hand-rolled menu
                managed (or missed) itself. */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                aria-label="Abrir menú"
                className="flex size-11 cursor-pointer items-center justify-center rounded-md text-fg active:scale-[0.97]"
              >
                <List size={24} aria-hidden="true" />
              </SheetTrigger>

              {/* Portaled to body, so it needs its own breakpoint guard. */}
              <SheetContent aria-describedby={undefined} className="lg:hidden">
                <SheetTitle className="sr-only">Menú principal</SheetTitle>

                {/* The sheet's own top bar mirrors the header's geometry so the
                    close control sits visually where the hamburger was - and,
                    unlike the hamburger, inside the focus trap. */}
                <div className="mx-auto flex h-[var(--nav-h)] w-full max-w-(--container-content) shrink-0 items-center justify-between px-(--space-gutter)">
                  <Link href="/" aria-label="SALU División Veterinaria, inicio" onClick={() => setOpen(false)}>
                    <Logo />
                  </Link>
                  <SheetCloseButton label="Cerrar menú" />
                </div>

                <div className="flex flex-col gap-1 px-(--space-gutter) py-8">
                  {NAV_LINKS.map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      style={linkCascade(index)}
                      className={`block border-b border-border py-4 text-h3 text-fg ${linkCascadeClass}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {/* Still earns its place with the bar glyph in the header:
                      while the sheet is open, that control is behind the
                      overlay. */}
                  <div style={linkCascade(NAV_LINKS.length)} className={linkCascadeClass}>
                    <ButtonLink
                      href={whatsappUrl(WHATSAPP_MESSAGES.general)}
                      size="lg"
                      className="mt-6 w-full"
                      onClick={() => setOpen(false)}
                    >
                      <WhatsAppIcon />
                      Cotizar por WhatsApp
                    </ButtonLink>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  )
}

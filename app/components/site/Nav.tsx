'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { List, WhatsappLogo } from '@phosphor-icons/react/ssr'
import { Logo } from './Logo'
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
   * The nav is a dark-band element everywhere it has a face: transparent over
   * the home hero (which supplies the dark ground itself), and a solid
   * teal-950 bar once scrolled - on any route. It never flips to a light bar;
   * the only light state is the top of light-topped routes (productos), where
   * it stays transparent with dark contents.
   *
   * Derived during render rather than tracked in state: it is a function of
   * values we already have, and an effect would introduce a frame where the
   * nav is styled for the wrong background.
   */
  const dark = pathname === '/' || scrolled

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
          'sticky top-0 z-40 w-full border-b border-transparent',
          'transition-[background-color,box-shadow] duration-[240ms] ease-[var(--ease-out)]',
          dark ? 'on-dark' : '',
          scrolled
            ? 'nav-surface shadow-[0_2px_12px_rgb(6_36_40/0.25)]'
            : 'bg-transparent',
        ].filter(Boolean).join(' ')}
      >
        <nav
          aria-label="Principal"
          className="mx-auto flex h-[var(--nav-h)] max-w-(--container-content) items-center justify-between px-(--space-gutter)"
        >
          <Link href="/" aria-label="SALU División Veterinaria, inicio">
            <Logo onDark={dark} />
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
              <WhatsappLogo size={16} aria-hidden="true" />
              Cotizar
            </ButtonLink>
          </div>

          {/* Mobile sheet. Radix Dialog supplies the focus trap, Escape
              handling and body scroll lock the previous hand-rolled menu
              managed (or missed) itself. */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Abrir menú"
              className="flex size-11 cursor-pointer items-center justify-center rounded-md text-fg active:scale-[0.97] lg:hidden"
            >
              <List size={22} aria-hidden="true" />
            </SheetTrigger>

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
                <div style={linkCascade(NAV_LINKS.length)} className={linkCascadeClass}>
                  <ButtonLink
                    href={whatsappUrl(WHATSAPP_MESSAGES.general)}
                    size="lg"
                    className="mt-6 w-full"
                    onClick={() => setOpen(false)}
                  >
                    <WhatsappLogo size={18} aria-hidden="true" />
                    Cotizar por WhatsApp
                  </ButtonLink>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </header>
    </>
  )
}

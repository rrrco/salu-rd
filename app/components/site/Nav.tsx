'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { List, X, WhatsappLogo } from '@phosphor-icons/react/ssr'
import { Logo } from './Logo'
import { ButtonLink } from '../ui/Button'
import { NAV_LINKS, whatsappUrl, WHATSAPP_MESSAGES } from '../../lib/site'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const reduce = useReducedMotion()

  /**
   * The home hero runs full-bleed to the top of the viewport and the nav sits
   * over it, so at rest the bar is transparent with light-on-dark contents.
   * Once the reader scrolls past the hero it becomes the translucent light bar.
   *
   * Derived during render rather than tracked in state: it is a function of two
   * values we already have, and an effect would introduce a frame where the nav
   * is styled for the wrong background.
   */
  const overHero = pathname === '/' && !scrolled && !open

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

  /** Escape closes the mobile sheet; body scroll locks while it is open. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="absolute top-0 h-px w-full" />

      <header
        className={[
          'sticky top-0 z-40 w-full',
          'transition-[background-color,border-color,backdrop-filter] duration-[240ms] ease-[var(--ease-out)]',
          overHero ? 'on-dark border-b border-transparent bg-transparent' : '',
          !overHero && scrolled
            ? 'border-b border-border bg-[color-mix(in_oklab,var(--color-bg)_70%,transparent)] backdrop-blur-xl backdrop-saturate-150'
            : '',
          !overHero && !scrolled ? 'border-b border-transparent bg-transparent' : '',
        ].filter(Boolean).join(' ')}
      >
        <nav
          aria-label="Principal"
          className="mx-auto flex h-[var(--nav-h)] max-w-(--container-content) items-center justify-between px-(--space-gutter)"
        >
          <Link href="/" aria-label="SALU División Veterinaria, inicio">
            <Logo onDark={overHero} />
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

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-mobile"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="flex size-11 items-center justify-center rounded-md text-fg active:scale-[0.97] lg:hidden"
          >
            {open ? <X size={22} aria-hidden="true" /> : <List size={22} aria-hidden="true" />}
          </button>
        </nav>
      </header>

      {/* Mobile sheet. Rendered outside the sticky header so the backdrop covers
          the full viewport rather than being clipped by the header bounds. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="nav-mobile"
            className="fixed inset-0 z-30 bg-bg pt-[var(--nav-h)] lg:hidden"
            /* The sheet materialises rather than appearing: a short fade with a
               few pixels of travel, so the eye is led down into the list instead
               of having it cut in. */
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.12 } }
                : { opacity: 0, y: -8, transition: { duration: 0.16, ease: [0.23, 1, 0.32, 1] } }
            }
            transition={{ duration: reduce ? 0.15 : 0.24, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div
              className="flex flex-col gap-1 px-(--space-gutter) py-8"
              /* Links cascade in at 40ms. Short enough that the list feels
                 like one movement, long enough to show reading order. */
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: reduce ? 0 : 0.04, delayChildren: 0.04 } },
              }}
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: reduce ? 0 : 8 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-border py-4 text-h3 text-fg"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: reduce ? 0 : 8 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                <ButtonLink
                  href={whatsappUrl(WHATSAPP_MESSAGES.general)}
                  size="lg"
                  className="mt-6 w-full"
                  onClick={() => setOpen(false)}
                >
                  <WhatsappLogo size={18} aria-hidden="true" />
                  Cotizar por WhatsApp
                </ButtonLink>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

    </>
  )
}

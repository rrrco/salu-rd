import Link from 'next/link'
import { EnvelopeSimple, MapPin } from '@phosphor-icons/react/ssr'
import { Logo } from './Logo'
import { WhatsAppIcon } from '../../lib/icons'
import { ButtonLink } from '@/components/ui/button'
import { SITE, NAV_LINKS, whatsappUrl, WHATSAPP_MESSAGES } from '../../lib/site'

/**
 * Light footer.
 *
 * A near-black slab under a light page was the heaviest thing on the site and
 * the last thing a reader saw. On a `teal-50` ground the page settles rather
 * than slams shut, and the closing CTA band above keeps the one dark bookend it
 * needs.
 *
 * WhatsApp gets a real button here, not just a line of text. It is the last
 * chance to convert, on the channel that converts.
 */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer data-bar-color="#e6f4f6" className="border-t border-border bg-teal-50">
      <div className="mx-auto max-w-(--container-content) px-(--space-gutter) py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div className="flex flex-col items-start gap-5">
            <Logo />
            <p className="max-w-[38ch] text-sm text-fg-muted">
              Productos farmacéuticos certificados, biológicos y consumibles
              veterinarios para clínicas, hospitales y distribuidores.
            </p>
            <ButtonLink href={whatsappUrl(WHATSAPP_MESSAGES.general)}>
              <WhatsAppIcon />
              Cotizar por WhatsApp
            </ButtonLink>
          </div>

          <nav aria-label="Pie de página" className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
              Navegación
            </h2>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-fg-muted transition-colors duration-[180ms] ease-[var(--ease-out)] hover-fine:text-accent-deep"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
              Contacto
            </h2>
            <a
              href={`mailto:${SITE.email}`}
              className="flex w-fit items-center gap-2.5 text-sm text-fg-muted transition-colors duration-[180ms] ease-[var(--ease-out)] hover-fine:text-accent-deep"
            >
              <EnvelopeSimple
                size={16}
                aria-hidden="true"
                className="shrink-0 text-accent-deep"
              />
              {SITE.email}
            </a>
            <a
              href={whatsappUrl(WHATSAPP_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2.5 text-sm text-fg-muted transition-colors duration-[180ms] ease-[var(--ease-out)] hover-fine:text-accent-deep"
            >
              <WhatsAppIcon size={16} className="shrink-0 text-accent-deep" />
              {SITE.phoneDisplay}
            </a>
            <p className="flex items-center gap-2.5 text-sm text-fg-muted">
              <MapPin size={16} aria-hidden="true" className="shrink-0 text-accent-deep" />
              {SITE.country}
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-6">
          <p className="text-xs text-fg-subtle">
            {year} {SITE.name} {SITE.division}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

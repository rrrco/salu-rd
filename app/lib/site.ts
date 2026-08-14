/**
 * Single source of truth for contact details and navigation.
 *
 * These were previously hardcoded in three places (`page.tsx`, `productos/page.tsx`,
 * and the duplicated WhatsApp FAB), which is how the email address ended up
 * misspelled in production.
 */
export const SITE = {
  name: 'SALU',
  division: 'División Veterinaria',
  email: 'salusrl.dv@gmail.com',
  phoneDisplay: '+1 829 763 1855',
  phoneE164: '18297631855',
  whatsapp: 'https://wa.me/18297631855',
  city: 'Santiago de los Caballeros',
  country: 'República Dominicana',
} as const

/**
 * Delivery is national only, and the site never said so. The country appeared
 * as an address in the footer and as flavour in the hero copy, both of which
 * read as where SALU is rather than how far it ships, so a buyer outside the
 * country had no way to find out before opening a chat.
 *
 * Three surfaces carry it, phrased for the room each one is in: the catalog
 * where browsing starts, the product where the decision is made, and the quote
 * panel as the last stop before WhatsApp.
 */
export const DELIVERY = {
  catalog: 'Cotizamos y despachamos únicamente dentro de República Dominicana.',
  product: 'Entrega en toda República Dominicana',
  quote:
    'Despachamos solo dentro de República Dominicana. Si estás fuera del país, escríbenos igual y te decimos si podemos ayudarte.',
  footer: 'Entregas solo dentro del territorio dominicano',
} as const

/**
 * WhatsApp is the primary conversion channel for this business, so it gets a
 * helper rather than a hardcoded URL in six places.
 *
 * The prefilled message matters: a buyer who taps from a product tile lands in
 * a chat that already names the product, so they never have to describe what
 * they were looking at. That removes the main reason people abandon a chat CTA.
 */
export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${SITE.phoneE164}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const WHATSAPP_MESSAGES = {
  general: 'Hola SALU, quisiera cotizar productos veterinarios.',
  product: (name: string) => `Hola SALU, quisiera cotizar ${name}.`,
} as const

/** Anchor IDs are contractual. Existing CTAs link to them. */
export const NAV_LINKS = [
  { href: '/#products', label: 'Productos' },
  { href: '/#purpose', label: 'Nosotros' },
  { href: '/productos', label: 'Catálogo' },
  { href: '/#contact', label: 'Contacto' },
] as const

/** Client-supplied, from `_design/notes.md`. Not invented. */
export const STATS = [
  { value: 10, suffix: '+', label: 'Años de experiencia' },
  { value: 200, suffix: '+', label: 'Productos en catálogo' },
  { value: 500, suffix: '+', label: 'Clientes atendidos' },
] as const

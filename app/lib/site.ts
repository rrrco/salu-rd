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
  country: 'República Dominicana',
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

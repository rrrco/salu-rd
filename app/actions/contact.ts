'use server'

import { Resend } from 'resend'
import { z } from 'zod'
import { SITE } from '../lib/site'

const schema = z.object({
  name: z.string().trim().min(2, 'Ingresa tu nombre completo.').max(120),
  email: z.email('Ingresa un correo electrónico válido.').max(160),
  phone: z
    .string()
    .trim()
    .min(7, 'Ingresa un teléfono válido.')
    .max(40)
    .regex(/^[+\d\s()-]+$/, 'El teléfono solo puede contener números y signos.'),
  organisation: z
    .string()
    .trim()
    .min(2, 'Indica tu clínica, hospital o empresa.')
    .max(160),
  message: z.string().trim().max(4000).optional(),
})

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<keyof z.infer<typeof schema>, string>>
  /** Echoed back so a failed submit does not wipe what the user typed. */
  values?: Record<string, string>
}

/**
 * Fixed-window rate limit, per instance.
 *
 * Deliberately simple. This is a low-traffic marketing form and the honeypot
 * catches most automated submissions; the limit exists to stop one client from
 * hammering the endpoint. A serverless instance can be recycled or duplicated,
 * so treat this as a speed bump, not a guarantee. Move to a shared store if the
 * form ever becomes a real target.
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(key: string) {
  const now = Date.now()
  const entry = hits.get(key)

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  entry.count += 1
  if (entry.count > MAX_PER_WINDOW) return true

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k)
  }

  return false
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    organisation: String(formData.get('organisation') ?? ''),
    message: String(formData.get('message') ?? ''),
  }

  /* Honeypot. A human never sees this field, so anything in it is a bot.
     Report success rather than an error: telling a bot it was detected just
     teaches it to skip the field next time. */
  if (String(formData.get('company_website') ?? '').trim() !== '') {
    return { status: 'success' }
  }

  const parsed = schema.safeParse(values)
  if (!parsed.success) {
    const errors: ContactState['errors'] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof schema>
      if (key && !errors[key]) errors[key] = issue.message
    }
    return {
      status: 'error',
      message: 'Revisa los campos marcados.',
      errors,
      values,
    }
  }

  if (rateLimited(parsed.data.email.toLowerCase())) {
    return {
      status: 'error',
      message: 'Recibimos varias solicitudes tuyas. Intenta de nuevo en un minuto.',
      values,
    }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set. Submission was not sent.')
    return {
      status: 'error',
      message: `No pudimos enviar el mensaje. Escríbenos a ${SITE.email} o por WhatsApp.`,
      values,
    }
  }

  const data = parsed.data
  const from = process.env.CONTACT_FROM_EMAIL ?? 'SALU Web <onboarding@resend.dev>'

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: SITE.email,
      replyTo: data.email,
      subject: `Nueva cotización: ${data.organisation}`,
      text: [
        `Nombre: ${data.name}`,
        `Correo: ${data.email}`,
        `Teléfono: ${data.phone}`,
        `Organización: ${data.organisation}`,
        '',
        'Mensaje:',
        data.message || '(sin mensaje)',
      ].join('\n'),
      html: `
        <h2 style="font-family:sans-serif">Nueva solicitud de cotización</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0"><strong>Nombre</strong></td><td>${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><strong>Correo</strong></td><td>${escapeHtml(data.email)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><strong>Teléfono</strong></td><td>${escapeHtml(data.phone)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><strong>Organización</strong></td><td>${escapeHtml(data.organisation)}</td></tr>
        </table>
        <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(data.message || '(sin mensaje)')}</p>
      `,
    })

    if (error) {
      console.error('[contact] Resend rejected the send:', error)
      return {
        status: 'error',
        message: `No pudimos enviar el mensaje. Escríbenos a ${SITE.email} o por WhatsApp.`,
        values,
      }
    }
  } catch (err) {
    console.error('[contact] Unexpected failure sending mail:', err)
    return {
      status: 'error',
      message: `No pudimos enviar el mensaje. Escríbenos a ${SITE.email} o por WhatsApp.`,
      values,
    }
  }

  return { status: 'success' }
}

'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { CheckCircle, WarningCircle } from '@phosphor-icons/react/ssr'
import { Button } from './ui/Button'
import { Field, TextArea, Honeypot } from './ui/Field'
import { submitContact, type ContactState } from '../actions/contact'
import { SITE } from '../lib/site'

const initialState: ContactState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Enviando' : 'Enviar mensaje'}
    </Button>
  )
}

/**
 * The previous version of this form had `action="#"` and a reCAPTCHA that was a
 * `useState` div, so every submission was silently discarded. It now posts to a
 * server action that validates and sends real mail.
 *
 * Field `name` attributes are unchanged from the previous build so nothing
 * downstream has to be updated.
 */
export default function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState)

  if (state.status === 'success') {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4"
      >
        <CheckCircle size={40} aria-hidden="true" className="text-accent" />
        <h3 className="text-h3 font-semibold">Mensaje enviado</h3>
        <p className="text-fg-muted">
          Gracias por escribirnos. Te responderemos a la brevedad. Si necesitas
          una respuesta inmediata, escríbenos por WhatsApp al {SITE.phoneDisplay}.
        </p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      noValidate
      className="relative flex flex-col gap-5"
    >
      <Honeypot />

      {state.status === 'error' && state.message ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-sm border border-[var(--color-error)] bg-[color-mix(in_oklab,var(--color-error)_6%,transparent)] p-3 text-sm text-[var(--color-error)]"
        >
          <WarningCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Nombre completo"
          required
          autoComplete="name"
          defaultValue={state.values?.name}
          error={state.errors?.name}
        />
        <Field
          id="email"
          label="Correo electrónico"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          defaultValue={state.values?.email}
          error={state.errors?.email}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="phone"
          label="Teléfono o WhatsApp"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="+1 809 000 0000"
          defaultValue={state.values?.phone}
          error={state.errors?.phone}
        />
        <Field
          id="organisation"
          label="Organización"
          required
          autoComplete="organization"
          placeholder="Clínica, hospital o distribuidor"
          defaultValue={state.values?.organisation}
          error={state.errors?.organisation}
        />
      </div>

      <TextArea
        id="message"
        label="Mensaje"
        rows={4}
        placeholder="Cuéntanos cómo podemos ayudar a tu práctica"
        defaultValue={state.values?.message}
        error={state.errors?.message}
      />

      <SubmitButton />

      <p className="text-xs text-fg-subtle">
        También puedes escribirnos a {SITE.email} o por WhatsApp al {SITE.phoneDisplay}.
      </p>
    </form>
  )
}

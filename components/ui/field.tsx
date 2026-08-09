import type { ComponentProps, ReactNode } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

/**
 * Label above, input, error below. Never placeholder-as-label.
 *
 * The Shell owns the aria contract: `aria-invalid` on the control, and
 * `aria-describedby` pointing at the hint or the error - never both, the
 * error replaces the hint.
 */
function Shell({
  id,
  label,
  error,
  hint,
  required,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-[0.06em] text-fg"
      >
        {label}
        {required && (
          <span className="text-accent" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-fg-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-[var(--color-error)]">
          {error}
        </p>
      )}
    </div>
  )
}

type FieldProps = {
  id: string
  label: string
  error?: string
  hint?: string
} & ComponentProps<'input'>

export function Field({ id, label, error, hint, required, ...rest }: FieldProps) {
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={required}>
      <Input
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...rest}
      />
    </Shell>
  )
}

type TextAreaProps = {
  id: string
  label: string
  error?: string
  hint?: string
} & ComponentProps<'textarea'>

export function TextArea({ id, label, error, hint, required, ...rest }: TextAreaProps) {
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={required}>
      <Textarea
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...rest}
      />
    </Shell>
  )
}

/**
 * Honeypot. A bot fills this; a human never sees it.
 *
 * Hidden with position and opacity rather than `display: none`, because some
 * bots skip fields that are display-none. `tabIndex={-1}` and `aria-hidden`
 * keep it out of the keyboard and screen reader paths. Deliberately a raw
 * input: it must not inherit visible-control styling or focus rings.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden opacity-0"
    >
      <label htmlFor="company_website">No completar este campo</label>
      <input
        id="company_website"
        name="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  )
}

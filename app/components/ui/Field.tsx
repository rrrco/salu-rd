import type { ComponentProps, ReactNode } from 'react'

/**
 * Label above, input, error below. Never placeholder-as-label.
 *
 * The original system made the border match the fill so inputs read borderless
 * at rest. It looked good but left the control with no perceivable boundary,
 * which fails WCAG 1.4.11. The boundary is now a real 3:1 border; focus still
 * turns it accent, which keeps the branded focus moment that detail was for.
 */
const inputBase = [
  'w-full rounded-sm px-4 py-3 text-body text-fg font-sans',
  'bg-surface border border-border-strong',
  'placeholder:text-fg-subtle',
  'transition-[background-color,border-color] duration-[180ms] ease-[var(--ease-out)]',
  'focus:border-accent focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-accent)_30%,transparent)]',
  'aria-[invalid=true]:border-[var(--color-error)]',
  'disabled:opacity-60 disabled:cursor-not-allowed',
].join(' ')

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
      <label
        htmlFor={id}
        className="font-semibold text-xs uppercase tracking-[0.06em] text-fg"
      >
        {label}
        {required && (
          <span className="text-accent" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
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
      <input
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={inputBase}
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

export function TextArea({
  id,
  label,
  error,
  hint,
  required,
  ...rest
}: TextAreaProps) {
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${inputBase} min-h-32 resize-y`}
        {...rest}
      />
    </Shell>
  )
}

/**
 * Honeypot. Replaces the previous build's fake reCAPTCHA, which was a `useState`
 * div that gated nothing. A bot fills this; a human never sees it.
 *
 * Hidden with position and opacity rather than `display: none`, because some
 * bots skip fields that are display-none. `tabIndex={-1}` and `aria-hidden`
 * keep it out of the keyboard and screen reader paths.
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

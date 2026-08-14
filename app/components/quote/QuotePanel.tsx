'use client'

import { useState, type ReactNode } from 'react'
import { Minus, Plus, TrashSimple } from '@phosphor-icons/react/ssr'
import { Button, ButtonLink } from '@/components/ui/button'
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { WhatsAppIcon } from '../../lib/icons'
import { DELIVERY, whatsappUrl } from '../../lib/site'
import { countItems, MAX_QTY, quoteMessage, type QuoteLine } from '../../lib/quote'
import {
  clearQuote,
  removeFromQuote,
  setQuoteOpen,
  setQuoteQty,
  useQuoteLines,
  useQuoteOpen,
} from '../../lib/quote-store'

/**
 * The quote, opened.
 *
 * `Dialog`'s `drawer` variant: a bottom sheet below `lg`, docked to the right
 * edge above it. The breakpoint is the same one the entry points swap at, so
 * the material always matches the control that opened it - the bar at the
 * bottom of a phone opens a panel from the bottom, the glyph in the desktop
 * nav opens the drawer under it.
 *
 * Mounted once in the site layout, opened from the nav button or the mobile
 * bar. Neither of those is a `DialogTrigger`, so `open` is store state: the two
 * controls live in different subtrees and the panel has to answer to both.
 */
export function QuotePanel() {
  const open = useQuoteOpen()
  const lines = useQuoteLines()
  const total = countItems(lines)

  return (
    <Dialog open={open} onOpenChange={setQuoteOpen}>
      <DialogContent variant="drawer" aria-describedby={undefined}>
        <div className="flex shrink-0 items-center gap-3 border-b border-border bg-surface py-2 pl-5 pr-2">
          <div className="min-w-0 flex-1">
            <DialogTitle>Tu cotización</DialogTitle>
            {/* Announced on change, so a screen reader hears the count move
                when a stepper is pressed with the panel open. */}
            <p aria-live="polite" className="text-xs text-fg-subtle">
              {total === 1 ? '1 producto' : `${total} productos`}
            </p>
          </div>
          <DialogCloseButton label="Cerrar cotización" />
        </div>

        {lines.length === 0 ? (
          <EmptyQuote />
        ) : (
          <>
            {/* `min-h-0` or the list refuses to shrink below its content and
                pushes the footer off the bottom of a full-height drawer. */}
            <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5">
              {lines.map((line) => (
                <QuoteRow key={line.slug} line={line} />
              ))}
            </ul>

            <div className="flex shrink-0 flex-col gap-3 border-t border-border bg-surface p-5">
              {/* Above the button, unlike the line below it: this is a
                  condition the buyer should read before pressing, not a
                  description of what pressing does. The second sentence is
                  what keeps it from reading as a door slammed shut - a clinic
                  outside the country still has someone to ask. */}
              <p className="text-center text-xs text-fg-subtle">{DELIVERY.quote}</p>
              <ButtonLink
                href={whatsappUrl(quoteMessage(lines))}
                size="lg"
                className="w-full"
                onClick={() => setQuoteOpen(false)}
              >
                <WhatsAppIcon />
                Enviar por WhatsApp
              </ButtonLink>
              {/* No prices anywhere on this site, so say what the buyer is
                  actually about to get back. */}
              <p className="text-center text-xs text-fg-subtle">
                Se abre un chat con la lista escrita. Te respondemos con precios
                y disponibilidad.
              </p>
              <ClearQuoteButton />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

/** Reachable from the nav button, which is visible whether or not there is
 *  anything in the list, so it has to say what to do next. */
function EmptyQuote() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <h3 className="text-h3 font-semibold">Aún no has agregado productos</h3>
      <p className="max-w-[40ch] text-sm text-fg-muted">
        Agrega los que te interesen desde el catálogo y los cotizamos todos en un
        solo mensaje.
      </p>
      <ButtonLink
        href="/productos"
        variant="secondary"
        className="mt-2"
        onClick={() => setQuoteOpen(false)}
      >
        Ver catálogo
      </ButtonLink>
    </div>
  )
}

function QuoteRow({ line }: { line: QuoteLine }) {
  return (
    <li className="flex items-center gap-3 border-b border-border py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-fg">{line.name}</p>
        {line.size ? (
          <p className="text-xs text-fg-subtle tabular-nums">{line.size}</p>
        ) : null}
      </div>

      {/* The stepper only ever changes a quantity; removing is the trash beside
          it. Folding removal into the minus at qty 1 reads tidy and costs five
          presses to drop a line of five, which is the case that actually
          happens. */}
      <div className="flex shrink-0 items-center rounded-md border border-border">
        <StepperButton
          label={`Quitar una unidad de ${line.name}`}
          disabled={line.qty <= 1}
          onClick={() => setQuoteQty(line.slug, line.qty - 1)}
        >
          <Minus className="size-4" />
        </StepperButton>

        <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
          {line.qty}
        </span>

        <StepperButton
          label={`Agregar una unidad de ${line.name}`}
          disabled={line.qty >= MAX_QTY}
          onClick={() => setQuoteQty(line.slug, line.qty + 1)}
        >
          <Plus className="size-4" />
        </StepperButton>
      </div>

      <button
        type="button"
        aria-label={`Quitar ${line.name} de la cotización`}
        onClick={() => removeFromQuote(line.slug)}
        className={[
          'flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-subtle',
          'transition-[background-color,color,transform] duration-[180ms] ease-[var(--ease-out)]',
          'hover-fine:bg-teal-50 hover-fine:text-error active:scale-[0.97] active:duration-[100ms]',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
        ].join(' ')}
      >
        <TrashSimple className="size-5" />
      </button>
    </li>
  )
}

function StepperButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={[
        'flex size-9 cursor-pointer items-center justify-center rounded-md text-fg-muted',
        'transition-[background-color,color,transform] duration-[180ms] ease-[var(--ease-out)]',
        'hover-fine:bg-surface-sunken hover-fine:text-accent',
        'active:scale-[0.94] active:duration-[100ms]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
        'disabled:pointer-events-none disabled:opacity-40',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

/**
 * Emptying the list is the one action here that cannot be undone by pressing
 * something else, so it asks twice. The confirmation is the same button
 * changing its mind, not a nested dialog over a dialog.
 *
 * Nothing resets `confirming` on close because nothing has to: Radix unmounts
 * the dialog content, so an armed button leaves with it and the next open
 * starts disarmed.
 */
function ClearQuoteButton() {
  const [confirming, setConfirming] = useState(false)

  return (
    <Button
      variant="ghost"
      onClick={() => {
        if (!confirming) {
          setConfirming(true)
          return
        }
        clearQuote()
        setConfirming(false)
      }}
      className={confirming ? 'text-error' : ''}
    >
      {confirming ? 'Confirmar: vaciar todo' : 'Vaciar cotización'}
    </Button>
  )
}

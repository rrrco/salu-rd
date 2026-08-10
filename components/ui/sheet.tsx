'use client'

import * as React from 'react'
import { X } from '@phosphor-icons/react/ssr'
import { Dialog as SheetPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

/**
 * Full-screen sheet on Radix Dialog. The site has exactly one sheet - the
 * mobile nav - so this is deliberately a single full-screen material rather
 * than shadcn's four side-anchored variants: owned code carries no dead
 * options. Radix supplies the focus trap, Escape handling and body scroll
 * lock that the previous hand-rolled menu lacked or reimplemented.
 *
 * Enter/exit are CSS keyframes (nav-sheet-in/out in globals.css), not
 * transitions: Radix waits for `animationend` before unmounting the closing
 * content. Exit is faster than enter - closing is the system acknowledging a
 * decision already made.
 */
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

/** The content is opaque and full-bleed, so no darkening overlay renders -
 *  an overlay behind an opaque surface is paint the reader never sees. */
function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content>) {
  return (
    <SheetPortal>
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          'fixed inset-0 z-50 flex h-dvh w-full flex-col bg-bg outline-none',
          'data-[state=open]:animate-[nav-sheet-in_240ms_var(--ease-out)]',
          'data-[state=closed]:animate-[nav-sheet-out_160ms_var(--ease-out)]',
          className
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('font-semibold text-fg', className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-sm text-fg-muted', className)}
      {...props}
    />
  )
}

/** Icon-sized close control for the sheet's own top bar. Lives inside the
 *  focus trap, visually where the hamburger was. */
function SheetCloseButton({ label }: { label: string }) {
  return (
    <SheetClose
      aria-label={label}
      className={cn(
        'flex size-11 cursor-pointer items-center justify-center rounded-md text-fg',
        'transition-[background-color,transform] duration-[180ms] ease-[var(--ease-out)]',
        'hover-fine:bg-teal-50 active:scale-[0.97] active:duration-[100ms]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]'
      )}
    >
      <X size={20} aria-hidden="true" />
    </SheetClose>
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetCloseButton,
  SheetContent,
  SheetTitle,
  SheetDescription,
}

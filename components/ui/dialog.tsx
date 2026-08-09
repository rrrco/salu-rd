'use client'

import * as React from 'react'
import { X } from '@phosphor-icons/react/ssr'
import { Dialog as DialogPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

/**
 * One dialog, two materials.
 *
 * Below `sm` it is a bottom sheet: the panel meets the thumb rather than the
 * middle of the screen. At `sm` and up it centres, because a bottom sheet on a
 * 1400px display is a strip of content pinned to the wrong edge.
 *
 * Positioning is done by a flex wrapper, not by `translate(-50%, -50%)`. That
 * keeps `transform` free for the animation: a centred dialog that also animates
 * transform has to bake the -50% offsets into every keyframe, and every future
 * keyframe has to remember. The wrapper is `pointer-events-none` so clicks fall
 * through to the overlay and Radix's dismiss-on-outside-press still fires.
 *
 * Enter and exit are CSS keyframes (globals.css), not transitions: Radix waits
 * for `animationend` before unmounting closing content. Exit is 160ms against
 * an enter of 240ms, the same asymmetry `sheet.tsx` uses. Closing is the system
 * acknowledging a decision already made, so it gets out of the way.
 */
function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/**
 * Teal-tinted scrim, matching the shadow tokens. Never pure black on light.
 *
 * The blur is 4px and it earns its cost here: what sits behind this dialog is a
 * dense grid of packshots on white, which stays legible under a flat scrim and
 * competes with the panel for attention. This is the opposite case to
 * `.glass-panel`, where a backdrop-filter sat behind an opaque fill and was
 * correctly removed as GPU work nobody could see.
 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-teal-950/50 backdrop-blur-[4px]',
        'data-[state=open]:animate-[dialog-overlay-in_240ms_var(--ease-out)]',
        'data-[state=closed]:animate-[dialog-overlay-out_160ms_var(--ease-out)]',
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            'pointer-events-auto flex w-full flex-col overflow-hidden outline-none',
            'bg-surface text-fg shadow-lg',
            // Mobile: meets the bottom edge, so only the top corners round.
            'max-h-[88dvh] rounded-t-lg',
            // Desktop: a free-floating panel at the container radius.
            'sm:max-h-[min(85dvh,52rem)] sm:max-w-3xl sm:rounded-lg',
            // `transform-origin` stays centred. A modal is not anchored to a
            // trigger, so it is the exception to the origin-aware rule that
            // governs popovers.
            'data-[state=open]:animate-[dialog-sheet-in_240ms_var(--ease-out)]',
            'data-[state=closed]:animate-[dialog-sheet-out_160ms_var(--ease-out)]',
            'sm:data-[state=open]:animate-[dialog-panel-in_240ms_var(--ease-out)]',
            'sm:data-[state=closed]:animate-[dialog-panel-out_160ms_var(--ease-out)]',
            className
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </div>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn('flex flex-col gap-2', className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-h3 font-semibold text-fg', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-sm text-fg-muted', className)}
      {...props}
    />
  )
}

/** Icon-sized close control, matching `SheetCloseButton`: same 44px target,
 *  same press feedback, same Phosphor glyph at `regular` weight. */
function DialogCloseButton({ label, className }: { label: string; className?: string }) {
  return (
    <DialogClose
      aria-label={label}
      className={cn(
        'flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-muted',
        'transition-[background-color,color,transform] duration-[180ms] ease-[var(--ease-out)]',
        'hover-fine:bg-teal-50 hover-fine:text-fg active:scale-[0.97] active:duration-[100ms]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
        className
      )}
    >
      <X size={20} aria-hidden="true" />
    </DialogClose>
  )
}

export {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

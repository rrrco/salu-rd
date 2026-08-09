'use client'

import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Plus } from '@phosphor-icons/react/ssr'

/**
 * Animated open/close panel.
 *
 * Replaces a native `<details>`, which snaps: the content is there or it is
 * not, and the surrounding layout jumps by a few hundred pixels in one frame.
 * That reads as a bug even when it is the browser default.
 *
 * Height animates from 0 to auto with a strong ease-out, so the panel is
 * already most of the way open by the time the eye follows it down. Opacity
 * runs shorter than height and is delayed slightly on the way in, so text
 * arrives into space that already exists instead of stretching with it.
 *
 * Exit is faster than enter. Closing is the system responding to a decision
 * already made, so it should get out of the way; opening is the content
 * arriving and can take its time.
 */
export function Disclosure({
  title,
  hint,
  children,
  className,
}: {
  title: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const reduce = useReducedMotion()

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className={[
          'flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left',
          'transition-colors duration-[180ms] ease-[var(--ease-out)]',
          'hover-fine:bg-teal-50',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-focus)]',
          'rounded-lg',
        ].join(' ')}
      >
        <span className="flex flex-col">
          <span className="font-semibold text-fg">{title}</span>
          {hint ? <span className="text-sm text-fg-muted">{hint}</span> : null}
        </span>

        {/* The plus rotates into a cross. One glyph doing both states beats two
            glyphs swapping, because the rotation is continuous and the reader
            never sees a hard cut. */}
        <motion.span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-accent-deep"
          animate={{ rotate: open ? 135 : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: 'spring', bounce: 0, duration: 0.4 }
          }
        >
          <Plus size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={id}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            /* Exit is quicker than enter: closing is the system acknowledging a
               decision already made, so it should get out of the way. */
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.24, ease: [0.23, 1, 0.32, 1] },
                opacity: { duration: 0.14 },
              },
            }}
            transition={
              reduce
                ? { duration: 0.15 }
                : {
                    height: { duration: 0.34, ease: [0.23, 1, 0.32, 1] },
                    opacity: { duration: 0.22, delay: 0.06 },
                  }
            }
            className="overflow-hidden"
          >
            <div className="border-t border-border p-6">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

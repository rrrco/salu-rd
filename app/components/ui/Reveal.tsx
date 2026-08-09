'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Scroll reveal. Motivation: storytelling. Content enters as the reader arrives
 * at it, which sequences an eight-section page into eight moments.
 *
 * Fires once. A section that re-animates every time it scrolls back into view
 * is a distraction, not a reveal.
 *
 * Under reduced motion the translate is dropped and only opacity remains. That
 * is the accessible degradation: gentler, not absent.
 */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'figure'
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as]

  return (
    <Tag
      data-reveal
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: reduce ? 0.2 : 0.6,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </Tag>
  )
}

/**
 * Staggered group. Motivation: hierarchy. A 60ms cascade reveals reading order
 * without the reader having to work it out.
 *
 * Delays stay short. Long staggers make an interface feel slow, and stagger is
 * decorative so it must never gate interaction.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.06,
  delayChildren = 0.05,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delayChildren?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduce ? 0 : stagger,
            delayChildren: reduce ? 0 : delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

/** Child of `RevealGroup`. Must share the same client component tree. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      data-reveal
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0.2 : 0.55, ease: [0.23, 1, 0.32, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

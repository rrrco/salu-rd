'use client'

import { useEffect, useRef } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

/**
 * Counts a stat up when it scrolls into view.
 *
 * Motivation: these three numbers are the entire trust argument of the section,
 * so they earn the emphasis. Everything else on the page stays still.
 *
 * The value is written straight to the DOM node rather than held in state. It
 * changes every frame for 1.4s, and routing a transient per-frame value through
 * React would re-render the tree roughly 250 times to update one text node.
 *
 * The final value is what server-renders, so the number is correct before
 * hydration, correct with JavaScript disabled, and correct for a crawler. The
 * animation only ever plays it back from zero.
 */
export function CountUp({
  value,
  suffix = '',
  duration = 1400,
  className,
}: {
  value: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!inView || reduce || !node) return

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // Strong ease-out: the number lands early and settles, rather than
      // crawling to the finish.
      const eased = 1 - Math.pow(1 - t, 3)
      node.textContent = `${Math.round(eased * value)}${suffix}`
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, suffix, duration, reduce])

  return (
    <span ref={ref} className={`tabular ${className ?? ''}`}>
      {value}
      {suffix}
    </span>
  )
}

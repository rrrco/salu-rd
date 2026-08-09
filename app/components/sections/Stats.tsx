'use client'

import { motion, useReducedMotion } from 'motion/react'
import { CountUp } from '../ui/CountUp'
import { STATS } from '../../lib/site'

/**
 * The stats panel, sitting on the hero.
 *
 * The original design floated a white card over the bottom of the hero with a
 * `margin-top: -80px` and a hard black shadow. The layering instinct was right;
 * the execution was a 2016 template. This is the same moment built as a real
 * material: a translucent panel with the gradient visible through it, a bright
 * top edge where light catches it, and a shadow tinted to the surface beneath.
 *
 * It materialises rather than fading in. Blur and scale resolve together, so it
 * reads as a pane of glass arriving rather than a rectangle appearing.
 */
export function HeroStats() {
  const reduce = useReducedMotion()

  return (
    <motion.dl
      data-reveal
      className="glass-panel grid grid-cols-3 rounded-lg"
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: 20, scale: 0.985, filter: 'blur(14px)' }
      }
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={
        reduce
          ? { duration: 0.25 }
          : // Critically damped. No overshoot on something that simply arrives.
            { type: 'spring', bounce: 0, duration: 0.75, delay: 0.32 }
      }
    >
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={[
            'flex flex-col items-center gap-1 px-3 py-6 text-center sm:px-8 sm:py-8',
            i > 0 ? 'border-l border-white/12' : '',
          ].join(' ')}
        >
          <dd className="text-[clamp(1.75rem,1.1rem+2.4vw,3rem)] font-semibold leading-none tracking-[-0.035em] text-white">
            <CountUp value={stat.value} suffix={stat.suffix} />
          </dd>
          <dt className="text-xs text-teal-100 sm:text-sm">{stat.label}</dt>
        </div>
      ))}
    </motion.dl>
  )
}

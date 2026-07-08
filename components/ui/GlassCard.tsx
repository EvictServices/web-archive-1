'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  span?: string
  onClick?: () => void
}

export default function GlassCard({ children, className = '', span = '', onClick }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-card p-5 transition-colors duration-300 hover:border-white/[0.13] sm:p-7 ${span} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  span?: string
  delay?: number
  onClick?: () => void
}

export default function GlassCard({ children, className = '', span = '', delay = 0, onClick }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const stagger = Math.min(delay * 0.1, 0.3)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : undefined}
      transition={{ delay: stagger, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-accent/15 hover:bg-white/[0.03] ${span} ${className}`}
      onClick={onClick}
    >
      <motion.div
        initial={{ opacity: 0, x: '-100%' }}
        animate={inView ? { opacity: [0, 0.6, 0], x: '200%' } : undefined}
        transition={{ delay: stagger + 0.2, duration: 0.8, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
      />

      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/[0.02] blur-3xl transition-opacity duration-500 group-hover:bg-accent/[0.04]" />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

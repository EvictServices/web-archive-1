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

  const stagger = Math.min(delay * 0.08, 0.24)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ delay: stagger, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-card p-6 transition-colors duration-300 hover:border-white/[0.13] sm:p-7 ${span} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

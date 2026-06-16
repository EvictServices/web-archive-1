'use client'

import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  span?: string
  delay?: number
  onClick?: () => void
}

export default function GlassCard({ children, className = '', span = '', delay = 0, onClick }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 transition-all duration-500 hover:border-accent/15 hover:bg-white/[0.03] ${span} ${className}`}
      onClick={onClick}
    >
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/[0.02] blur-3xl transition-opacity duration-500 group-hover:bg-accent/[0.04]" />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

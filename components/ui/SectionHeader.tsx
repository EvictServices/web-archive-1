'use client'

import { motion } from 'framer-motion'

interface SectionHeaderProps {
  label: string
  headline: React.ReactNode
  subline?: React.ReactNode
  className?: string
}

export default function SectionHeader({ label, headline, subline, className = '' }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px 0px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`mb-12 max-w-2xl ${className}`}
    >
      <p className="text-[11px] font-semibold tracking-[0.2em] text-accent-bright uppercase">{label}</p>
      <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
        {headline}
      </h2>
      {subline && <p className="mt-4 text-[15px] leading-relaxed text-white/50">{subline}</p>}
    </motion.div>
  )
}

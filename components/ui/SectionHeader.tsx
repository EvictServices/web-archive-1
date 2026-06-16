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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-14 text-center ${className}`}
    >
      <p className="inline-block text-[10px] font-medium tracking-[0.2em] text-accent uppercase">
        {label}
        <span className="mx-auto mt-2 block h-px w-8 bg-accent/40" />
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tighter text-white sm:text-5xl">
        {headline}
      </h2>
      {subline && <p className="mt-2 text-sm text-white/20">{subline}</p>}
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { useLightMotion } from '@/hooks/useLightMotion'
import { PAGE_TOP_PADDING, PAGE_X_PADDING } from '@/lib/pageLayout'

const ease = [0.23, 1, 0.32, 1] as const

interface PageHeaderProps {
  label: string
  title: string
  description?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function PageLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.08]" />
      <span className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">{label}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.08]" />
    </div>
  )
}

export default function PageHeader({ label, title, description, className = '', children }: PageHeaderProps) {
  const lightMotion = useLightMotion()

  return (
    <motion.header
      className={`text-center ${className}`}
      initial={{ opacity: 0, y: lightMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: lightMotion ? 0.2 : 0.4, ease }}
    >
      <PageLabel label={label} />
      {children}
      <h1 className="font-display mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
      {description && (
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/50">{description}</p>
      )}
    </motion.header>
  )
}

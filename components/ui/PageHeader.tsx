'use client'

import { motion } from 'framer-motion'
import { useLightMotion } from '@/hooks/useLightMotion'

const ease = [0.23, 1, 0.32, 1] as const

export const PAGE_X_PADDING = 'px-4 sm:px-6'
export const PAGE_TOP_PADDING = 'pt-28 sm:pt-32'

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
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
      <span className="text-[9px] font-medium tracking-[0.2em] text-white/60 uppercase">{label}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
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
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">{title}</h1>
      {description && (
        <p className="mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-white/60">{description}</p>
      )}
    </motion.header>
  )
}

'use client'

import { memo, type ReactNode } from 'react'

interface StatusCardProps {
  icon?: ReactNode
  label: string
  value: string
  valueClass?: string
  detail?: string
  onClick?: () => void
  compact?: boolean
  variant?: 'default' | 'stat'
}

function StatusCard({ icon, label, value, valueClass, detail, onClick, compact, variant = 'default' }: StatusCardProps) {
  const Tag = onClick ? 'button' : 'div'

  if (variant === 'stat') {
    return (
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={`w-full rounded-2xl border border-white/[0.06] bg-black/25 px-2 py-3.5 text-center ${
          onClick ? 'cursor-pointer transition-colors hover:border-white/[0.13]' : ''
        }`}
      >
        <p className="text-[10px] font-medium tracking-wide text-white/40 uppercase">{label}</p>
        <p className={`font-display mt-1 text-base font-semibold tracking-tight ${valueClass ?? 'text-white'}`}>{value}</p>
      </Tag>
    )
  }

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02] text-left transition-all duration-300 ${
        compact ? 'p-3' : 'p-4'
      } ${
        onClick
          ? 'cursor-pointer hover:border-accent/15 hover:bg-white/[0.03] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]'
          : ''
      }`}
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/[0.02] blur-3xl transition-opacity duration-500 group-hover:bg-accent/[0.05]" />

      <div className="relative flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] transition-colors group-hover:border-accent/20 group-hover:bg-accent/[0.06]">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-medium tracking-wide text-white/30 uppercase">{label}</p>
          <p className={`font-semibold tracking-tight text-white ${compact ? 'mt-0.5 text-sm' : 'mt-1 text-xl'}`}>
            {value}
          </p>
          {detail && (
            <p className={`leading-relaxed text-white/60 ${compact ? 'mt-1 text-[10px] line-clamp-2' : 'mt-1.5 text-[11px]'}`}>
              {detail}
            </p>
          )}
        </div>

        {onClick && (
          <span className="shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1.5 text-white/25 opacity-0 transition-opacity group-hover:opacity-100">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        )}
      </div>
    </Tag>
  )
}

export default memo(StatusCard)

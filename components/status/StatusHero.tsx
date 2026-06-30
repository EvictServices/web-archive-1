'use client'

import { motion } from 'framer-motion'
import { useLightMotion } from '@/hooks/useLightMotion'

const ease = [0.23, 1, 0.32, 1] as const

interface StatusHeroProps {
  users: number
  guilds: number
  latencyMs: number
  shardsOnline: number
  shardsTotal: number
  lastUpdate: Date | null
  operational: boolean
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

const METRICS = [
  {
    key: 'latency',
    label: 'Avg Latency',
    shortLabel: 'Latency',
    icon: (
      <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
  },
  {
    key: 'servers',
    label: 'Total Servers',
    shortLabel: 'Servers',
    icon: (
      <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    key: 'users',
    label: 'Total Users',
    shortLabel: 'Users',
    icon: (
      <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
] as const

export function StatusHeroSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02] sm:rounded-2xl">
      <div className="border-b border-white/[0.04] px-3 py-3.5 sm:px-6 sm:py-6">
        <div className="h-4 w-40 animate-pulse rounded bg-white/[0.06] sm:h-5 sm:w-48" />
        <div className="mt-1.5 h-3 w-52 animate-pulse rounded bg-white/[0.04] sm:mt-2 sm:h-3.5 sm:w-64" />
      </div>
      <div className="grid grid-cols-3 divide-x divide-white/[0.04]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="px-2 py-3 sm:px-5 sm:py-5">
            <div className="mx-auto h-2 w-10 animate-pulse rounded bg-white/[0.05] sm:mx-0 sm:h-2.5 sm:w-14" />
            <div className="mx-auto mt-1.5 h-5 w-12 animate-pulse rounded bg-white/[0.06] sm:mx-0 sm:mt-2 sm:h-6 sm:w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StatusHero({
  users,
  guilds,
  latencyMs,
  shardsOnline,
  shardsTotal,
  lastUpdate,
  operational,
}: StatusHeroProps) {
  const lightMotion = useLightMotion()
  const values: Record<string, string> = {
    latency: `${latencyMs}ms`,
    servers: formatNumber(guilds),
    users: formatNumber(users),
  }

  const glowClass = operational ? 'bg-green-500/[0.07]' : 'bg-amber-500/[0.07]'
  const dotClass = operational ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.45)]' : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.45)]'
  const statusLabel = operational ? 'All Systems Operational' : 'Partial Outage'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: lightMotion ? 0.2 : 0.35, ease }}
      className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] sm:rounded-2xl"
    >
      <div className={`pointer-events-none absolute -top-16 left-1/2 h-32 w-2/3 -translate-x-1/2 rounded-full sm:-top-20 sm:h-40 ${glowClass} blur-3xl`} />

      <div className="relative border-b border-white/[0.04] px-3 py-3.5 sm:px-6 sm:py-6">
        <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5 shrink-0 sm:h-2 sm:w-2">
                {operational && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/30" />
                )}
                <span className={`relative inline-flex h-full w-full rounded-full ${dotClass}`} />
              </span>
              <span className="text-[13px] font-semibold leading-tight text-white sm:text-base">{statusLabel}</span>
            </div>
            <p className="mt-1 text-[11px] leading-snug text-white/45 sm:mt-2 sm:text-[12px] sm:leading-relaxed">
              Powering{' '}
              <span className="font-medium text-white/70">{formatNumber(users)}</span> users across{' '}
              <span className="font-medium text-white/70">{formatNumber(guilds)}</span> communities
            </p>
            {lastUpdate && (
              <p className="mt-0.5 hidden text-[10px] tabular-nums text-white/25 sm:block">
                Updated {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[8px] font-medium tracking-[0.12em] text-white/35 uppercase sm:text-[9px] sm:tracking-[0.14em]">
              <span className="sm:hidden">Shards</span>
              <span className="hidden sm:inline">Shards Online</span>
            </p>
            <p className="mt-0.5 text-xl font-bold tabular-nums tracking-tight text-white sm:text-[28px]">
              {shardsOnline}
              <span className="text-sm font-medium text-white/25 sm:text-lg">/{shardsTotal}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-3 divide-x divide-white/[0.04]">
        {METRICS.map((metric) => (
          <div key={metric.key} className="px-2 py-3 text-center sm:px-5 sm:py-5 sm:text-left">
            <div className="flex items-center justify-center gap-1 text-white sm:justify-start sm:gap-1.5">
              <span className="hidden sm:block">{metric.icon}</span>
              <p className="text-[7px] font-medium tracking-[0.1em] uppercase sm:text-[9px] sm:tracking-[0.12em]">
                <span className="sm:hidden">{metric.shortLabel}</span>
                <span className="hidden sm:inline">{metric.label}</span>
              </p>
            </div>
            <p className="mt-1 text-base font-bold tabular-nums tracking-tight text-white sm:mt-2 sm:text-xl">
              {values[metric.key]}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

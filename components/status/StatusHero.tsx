'use client'

import { motion } from 'framer-motion'
import { TbBolt, TbRefresh, TbServer, TbUsers } from 'react-icons/tb'
import { formatNumber } from '@/lib/status'
import { useLightMotion } from '@/hooks/useLightMotion'

const ease = [0.23, 1, 0.32, 1] as const

interface StatusHeroProps {
  users: number
  guilds: number
  latencyMs: number
  lastUpdate: Date | null
  operational: boolean
  refreshIn: number
}

const METRICS = [
  { key: 'latency', label: 'Gateway', icon: TbBolt },
  { key: 'guilds', label: 'Servers', icon: TbServer },
  { key: 'users', label: 'Users', icon: TbUsers },
] as const

export function StatusHeroSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.02]" />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.02]" />
        ))}
      </div>
    </div>
  )
}

export default function StatusHero({
  users,
  guilds,
  latencyMs,
  lastUpdate,
  operational,
  refreshIn,
}: StatusHeroProps) {
  const lightMotion = useLightMotion()

  const values: Record<string, string> = {
    latency: `${latencyMs}ms`,
    guilds: formatNumber(guilds),
    users: formatNumber(users),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: lightMotion ? 0.2 : 0.35, ease }}
      className="space-y-4"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div
          className={`pointer-events-none absolute -top-20 left-1/2 h-40 w-2/3 -translate-x-1/2 rounded-full blur-3xl ${
            operational ? 'bg-emerald-500/[0.08]' : 'bg-amber-500/[0.08]'
          }`}
        />

        <div className="relative flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                {operational && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/30" />
                )}
                <span
                  className={`relative inline-flex h-full w-full rounded-full ${
                    operational
                      ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                      : 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                  }`}
                />
              </span>
              <p className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                {operational ? 'All systems operational' : 'Partial outage'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:shrink-0 sm:text-right">
            <div>
              <p className="text-[9px] font-medium tracking-[0.14em] text-white/30 uppercase">Refresh</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium tabular-nums text-white/55 sm:justify-end">
                <TbRefresh className="h-3.5 w-3.5" />
                {refreshIn}s
              </p>
            </div>
            {lastUpdate && (
              <div className="hidden border-l border-white/[0.06] pl-4 sm:block">
                <p className="text-[9px] font-medium tracking-[0.14em] text-white/30 uppercase">Updated</p>
                <p className="mt-0.5 text-sm font-medium tabular-nums text-white/55">
                  {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {METRICS.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 py-4 transition-colors hover:border-white/[0.08] hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-2 text-white/35">
              <Icon className="h-3.5 w-3.5" />
              <p className="text-[9px] font-medium tracking-[0.12em] uppercase">{label}</p>
            </div>
            <p className="mt-2 text-xl font-bold tabular-nums tracking-tight text-white sm:text-2xl">
              {values[key]}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
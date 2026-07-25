'use client'

import { motion } from 'framer-motion'
import { TbRefresh } from 'react-icons/tb'
import { formatNumber } from '@/lib/status'
import { useLightMotion } from '@/hooks/useLightMotion'

const ease = [0.23, 1, 0.32, 1] as const

interface StatusHeroProps {
  users: number
  guilds: number
  latencyMs: number
  lastUpdate: Date | null
  operational: boolean
  starting?: boolean
  refreshIn: number
}

const METRICS = [
  { key: 'latency', label: 'Gateway Latency' },
  { key: 'guilds', label: 'Servers' },
  { key: 'users', label: 'Users'},
] as const

export function StatusHeroSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-3xl border border-white/[0.08] bg-white/[0.03]" />
      <div className="h-40 animate-pulse rounded-3xl border border-white/[0.08] bg-white/[0.03] sm:h-28" />
    </div>
  )
}

export default function StatusHero({
  users,
  guilds,
  latencyMs,
  lastUpdate,
  operational,
  starting = false,
  refreshIn,
}: StatusHeroProps) {
  const lightMotion = useLightMotion()

  const values: Record<string, string> = {
    latency: `${latencyMs}ms`,
    guilds: formatNumber(guilds),
    users: formatNumber(users),
  }

  const headline = operational
    ? 'All systems operational'
    : starting
      ? 'Clusters starting up'
      : 'Partial outage'
  const tone = operational ? 'ok' : starting ? 'boot' : 'warn'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: lightMotion ? 0.2 : 0.35, ease }}
      className="space-y-4"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01]">
        <div
          className={`pointer-events-none absolute -top-20 left-1/2 h-40 w-2/3 -translate-x-1/2 rounded-full blur-3xl ${
            tone === 'ok'
              ? 'bg-emerald-500/[0.08]'
              : tone === 'boot'
                ? 'bg-sky-500/[0.08]'
                : 'bg-amber-500/[0.08]'
          }`}
        />

        <div className="relative flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              {(operational || starting) && (
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                    operational ? 'bg-emerald-400/30' : 'bg-sky-400/30'
                  }`}
                />
              )}
              <span
                className={`relative inline-flex h-full w-full rounded-full ${
                  tone === 'ok'
                    ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                    : tone === 'boot'
                      ? 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                      : 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                }`}
              />
            </span>
            <p className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {headline}
            </p>
          </div>

          <div className="flex items-center gap-5 sm:shrink-0 sm:text-right">
            <div>
              <p className="text-[11px] font-medium tracking-[0.14em] text-white/35 uppercase">Refresh</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium tabular-nums text-white/60 sm:justify-end">
                <TbRefresh className="h-4 w-4" />
                {refreshIn}s
              </p>
            </div>
            {lastUpdate && (
              <div className="hidden border-l border-white/[0.07] pl-5 sm:block">
                <p className="text-[11px] font-medium tracking-[0.14em] text-white/35 uppercase">Updated</p>
                <p className="mt-1 text-sm font-medium tabular-nums text-white/60">
                  {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid divide-y divide-white/[0.06] rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {METRICS.map(({ key, label }) => (
          <div key={key} className="flex items-baseline justify-between gap-3 px-6 py-4 sm:block sm:px-7 sm:py-5">
            <div>
              <p className="text-[13px] font-medium text-white/60">{label}</p>
            </div>
            <p className="font-display text-xl font-semibold tabular-nums tracking-tight text-white sm:mt-3 sm:text-2xl">
              {values[key]}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

'use client'

import { memo } from 'react'
import { TbChevronRight } from 'react-icons/tb'
import {
  type Cluster,
  formatNumber,
  latencyToMs,
  latencyTone,
  LATENCY_DOT_CLASS,
  LATENCY_TONE_CLASS,
} from '@/lib/status'

interface ClusterCardProps {
  cluster: Cluster
  index: number
  highlighted?: boolean
  onClick: () => void
}

function ShardStrip({ shards, alive }: { shards: Cluster['shards']; alive: boolean }) {
  return (
    <div className="flex flex-wrap items-end gap-1">
      {shards.map((shard) => {
        const ms = latencyToMs(shard.latency)
        const tone = alive ? latencyTone(ms) : 'bad'
        return (
          <span
            key={shard.id}
            title={`Shard ${shard.id} · ${ms}ms`}
            className={`w-1.5 rounded-sm ${alive ? LATENCY_DOT_CLASS[tone] : 'bg-red-400/40'} ${
              tone === 'good' ? 'h-2.5' : tone === 'warn' ? 'h-3.5' : 'h-4'
            }`}
          />
        )
      })}
    </div>
  )
}

function ClusterCard({ cluster, index, highlighted = false, onClick }: ClusterCardProps) {
  const latencyMs = latencyToMs(cluster.average_latency)
  const tone = cluster.alive ? latencyTone(latencyMs) : 'bad'

  return (
    <button
      type="button"
      id={highlighted ? `cluster-${cluster.id}` : undefined}
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-3xl border bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 text-left transition-colors ${
        highlighted
          ? 'border-accent/60 ring-2 ring-accent/25'
          : 'border-white/[0.08] hover:border-white/[0.16]'
      }`}
    >
      <div
        className={`pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full blur-3xl ${
          cluster.alive ? 'bg-accent/[0.07]' : 'bg-red-400/[0.09]'
        }`}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-base font-semibold tracking-tight text-white/90">
            Cluster {index + 1}
          </p>
          <span className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase ${
                cluster.alive
                  ? 'bg-emerald-400/10 text-emerald-300'
                  : 'bg-red-400/10 text-red-300'
              }`}
            >
              {cluster.alive ? 'Online' : 'Offline'}
            </span>
            <TbChevronRight className="h-4 w-4 shrink-0 text-white/20 transition-transform group-hover:translate-x-0.5 group-hover:text-white/45" />
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div>
            <p className="text-[11px] font-medium text-white/35">Servers</p>
            <p className="mt-1 text-base font-semibold tabular-nums text-white/80">{formatNumber(cluster.guilds)}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-white/35">Users</p>
            <p className="mt-1 text-base font-semibold tabular-nums text-white/80">{formatNumber(cluster.users)}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-white/35">Latency</p>
            <p className={`mt-1 text-base font-semibold tabular-nums ${LATENCY_TONE_CLASS[tone]}`}>
              {latencyMs}ms
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-[11px] font-medium text-white/35">Shard Health</p>
          <ShardStrip shards={cluster.shards} alive={cluster.alive} />
        </div>
      </div>
    </button>
  )
}

export default memo(ClusterCard)

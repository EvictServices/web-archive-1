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
    <div className="flex flex-wrap gap-1">
      {shards.map((shard) => {
        const ms = latencyToMs(shard.latency)
        const tone = alive ? latencyTone(ms) : 'bad'
        return (
          <span
            key={shard.id}
            title={`Shard ${shard.id} · ${ms}ms`}
            className={`h-1.5 w-1.5 rounded-full ${alive ? LATENCY_DOT_CLASS[tone] : 'bg-red-400/40'}`}
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
      className={`group relative w-full overflow-hidden rounded-2xl border bg-white/[0.02] p-4 text-left transition-all ${
        highlighted
          ? 'border-white/50 ring-2 ring-white/25'
          : 'border-white/[0.05] hover:border-accent/20 hover:bg-white/[0.03]'
      }`}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/[0.03] blur-2xl transition-opacity group-hover:bg-accent/[0.06]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  cluster.alive ? 'bg-emerald-400/80' : 'bg-red-400/80'
                }`}
              />
              <p className="text-sm font-semibold text-white/80">Cluster {index + 1}</p>
            </div>
          </div>
          <TbChevronRight className="h-4 w-4 shrink-0 text-white/15 transition-transform group-hover:translate-x-0.5 group-hover:text-white/35" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div>
            <p className="text-[8px] font-medium tracking-wider text-white/25 uppercase">Servers</p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-white/70">{formatNumber(cluster.guilds)}</p>
          </div>
          <div>
            <p className="text-[8px] font-medium tracking-wider text-white/25 uppercase">Users</p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-white/70">{formatNumber(cluster.users)}</p>
          </div>
          <div>
            <p className="text-[8px] font-medium tracking-wider text-white/25 uppercase">Latency</p>
            <p className={`mt-0.5 text-sm font-bold tabular-nums ${LATENCY_TONE_CLASS[tone]}`}>
              {latencyMs}ms
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-[8px] font-medium tracking-wider text-white/20 uppercase">Shard health</p>
          <ShardStrip shards={cluster.shards} alive={cluster.alive} />
        </div>
      </div>
    </button>
  )
}

export default memo(ClusterCard)
